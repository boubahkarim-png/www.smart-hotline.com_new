#!/usr/bin/env python3
"""
Skill Manager with Progressive Disclosure

Implements:
- SkillDiscovery: Find all skills from agent-registry.yaml and skills directories
- ProgressiveLoader: Lazy loading with caching and TTL
- Category-based loading groups
- Performance metrics tracking

Real-world benchmarks:
- Discovery time: < 3000ms
- Cache hit rate: >= 85%
- Memory overhead: < 256MB
"""

import os
import sys
import yaml
import time
import json
import hashlib
import logging
import threading
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Any, Set
from dataclasses import dataclass, field, asdict
from collections import defaultdict
import psutil

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# ==================== REAL-WORLD BENCHMARKS ====================
class REAL_WORLD_BENCHMARKS:
    """Performance thresholds from production requirements"""
    DISCOVERY_TIME_MS = 3000      # Must discover all skills in < 3s
    CACHE_HIT_RATE = 0.85         # 85% cache hit rate required
    MEMORY_OVERHEAD_MB = 256      # Max memory overhead
    CACHE_TTL_MINUTES = 5         # Cache TTL
    LAZY_LOAD_THRESHOLD = 10      # Load categories progressively


# ==================== DATA MODELS ====================
@dataclass
class Skill:
    """Represents a discoverable skill"""
    name: str
    skill_id: str
    description: str
    source: str  # agent-registry, anthropic-skills, etc.
    category: str = "uncategorized"
    tags: List[str] = field(default_factory=list)
    loaded: bool = False
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    def to_dict(self) -> Dict:
        """Convert to dictionary for serialization"""
        return asdict(self)


@dataclass
class CacheEntry:
    """Cache entry with TTL"""
    data: Any
    timestamp: datetime
    ttl_minutes: int = 5
    
    def is_valid(self) -> bool:
        """Check if cache entry is still valid"""
        expiry = self.timestamp + timedelta(minutes=self.ttl_minutes)
        return datetime.now() < expiry


@dataclass
class CategoryStats:
    """Statistics for a skill category"""
    skill_count: int = 0
    loaded_count: int = 0
    memory_usage_mb: float = 0.0
    load_time_ms: float = 0.0
    
    
# ==================== SKILL DISCOVERY ====================
class SkillDiscovery:
    """Discovers skills from multiple sources"""
    
    def __init__(self, config_paths: List[str] = None):
        self.config_paths = config_paths or [
            "/root/.config/opencode/agent-registry.yaml",
            "/root/.config/opencode/anthropic-skills/skills",
            "/root/.config/opencode/marketing-skills",
            "/root/.config/opencode/superpowers/skills",
            "/root/projects/"
        ]
        self.skills: Dict[str, Skill] = {}
        self.categories: Dict[str, Set[str]] = defaultdict(set)
        self.discovery_time_ms: float = 0.0
        
    def discover_all(self) -> Dict[str, Skill]:
        """Discover all skills from configured sources"""
        start_time = time.time()
        logger.info("Starting skill discovery...")
        
        # Clear previous results
        self.skills.clear()
        self.categories.clear()
        
        # Discover from each source
        for source_path in self.config_paths:
            if os.path.exists(source_path):
                logger.info(f"Discovering from: {source_path}")
                self._discover_from_source(source_path)
            else:
                logger.warning(f"Source path not found: {source_path}")
        
        # Categorize all skills
        self._categorize_skills()
        
        self.discovery_time_ms = (time.time() - start_time) * 1000
        logger.info(f"Discovered {len(self.skills)} skills in {self.discovery_time_ms:.2f}ms")
        
        # Validate benchmark
        if self.discovery_time_ms > REAL_WORLD_BENCHMARKS.DISCOVERY_TIME_MS:
            logger.warning(f"Discovery time {self.discovery_time_ms:.2f}ms exceeds benchmark of {REAL_WORLD_BENCHMARKS.DISCOVERY_TIME_MS}ms")
        
        return self.skills
    
    def _discover_from_source(self, source_path: str):
        """Discover skills from a specific source"""
        if source_path.endswith('.yaml') or source_path.endswith('.yml'):
            self._discover_from_agent_registry(source_path)
        elif os.path.isdir(source_path):
            self._discover_from_skills_dir(source_path)
    
    def _discover_from_agent_registry(self, yaml_path: str):
        """Discover skills from agent-registry.yaml"""
        try:
            with open(yaml_path, 'r') as f:
                data = yaml.safe_load(f)
            
            agents = data.get('agents', {})
            for agent_id, agent_data in agents.items():
                # Extract skills from agent capabilities
                capabilities = agent_data.get('capabilities', [])
                for capability in capabilities:
                    skill_id = f"{agent_id}:{capability}"
                    if skill_id not in self.skills:
                        skill = Skill(
                            name=capability.replace('_', ' ').title(),
                            skill_id=skill_id,
                            description=f"Capability: {capability}",
                            source="agent-registry",
                            tags=[agent_id, "agent-capability"],
                            metadata={
                                "agent_name": agent_data.get('name', ''),
                                "agent_role": agent_data.get('role', ''),
                                "expert_in": agent_data.get('expert_in', [])
                            }
                        )
                        self.skills[skill_id] = skill
                
                # Extract expert_in as skills
                expert_skills = agent_data.get('expert_in', [])
                for skill_name in expert_skills:
                    skill_id = f"{agent_id}:expert_{skill_name}"
                    if skill_id not in self.skills:
                        skill = Skill(
                            name=skill_name.replace('_', ' ').title(),
                            skill_id=skill_id,
                            description=f"Expertise: {skill_name}",
                            source="agent-registry",
                            tags=[agent_id, "expertise"],
                            metadata={"agent_name": agent_data.get('name', '')}
                        )
                        self.skills[skill_id] = skill
        except Exception as e:
            logger.error(f"Failed to parse agent registry {yaml_path}: {e}")
    
    def _discover_from_skills_dir(self, skills_dir: str):
        """Discover skills from skills directories"""
        try:
            for item in os.listdir(skills_dir):
                item_path = os.path.join(skills_dir, item)
                if os.path.isdir(item_path):
                    skill_md = os.path.join(item_path, "SKILL.md")
                    if os.path.exists(skill_md):
                        self._parse_skill_md(skill_md, skills_dir)
        except Exception as e:
            logger.error(f"Failed to scan skills directory {skills_dir}: {e}")
    
    def _parse_skill_md(self, md_path: str, source_dir: str):
        """Parse a skill markdown file"""
        try:
            with open(md_path, 'r') as f:
                content = f.read()
            
            # Extract skill name from directory name
            skill_dir = os.path.basename(os.path.dirname(md_path))
            
            # Simple parsing - look for description
            name = skill_dir.replace('-', ' ').title()
            description = "Skill description not extracted"
            
            # Try to find a better description
            lines = content.split('\n')
            for line in lines[:20]:
                if line.strip() and not line.startswith('#') and len(line) > 30:
                    description = line.strip()[:200]
                    break
            
            skill_id = f"skill:{skill_dir}"
            if skill_id not in self.skills:
                skill = Skill(
                    name=name,
                    skill_id=skill_id,
                    description=description,
                    source="skills-directory",
                    tags=[skill_dir, "anthropic-skill"],
                    metadata={"skill_file": md_path}
                )
                self.skills[skill_id] = skill
        except Exception as e:
            logger.error(f"Failed to parse skill {md_path}: {e}")
    
    def _categorize_skills(self):
        """Categorize skills by domain/category"""
        # Define category mapping rules
        category_rules = {
            'engineering': [
                'debugger', 'performance', 'security', 'database', 'devops', 
                'kubernetes', 'terraform', 'docker', 'build', 'deployment',
                'backend', 'frontend', 'full-stack', 'api', 'golang', 'python',
                'rust', 'cpp', 'java', 'php', 'ruby', 'nodejs', 'typescript'
            ],
            'product': [
                'product-manager', 'business-analyst', 'roadmap', 'prioritization',
                'user-story', 'requirement'
            ],
            'marketing': [
                'seo', 'content', 'social', 'email', 'campaign', 'ad-creative',
                'paid-ads', 'landing-page', 'conversion', 'copywriting',
                'lead-magnet', 'referral', 'analytics', 'tracking'
            ],
            'operations': [
                'monitoring', 'alert', 'health-check', 'auto-cleanup',
                'backup', 'maintenance', 'incident', 'sre', 'reliability'
            ],
            'security': [
                'security-audit', 'compliance', 'penetration', 'vulnerability',
                'access-control', 'encryption', 'authentication', 'authorization'
            ],
            'data': [
                'data-engineer', 'data-scientist', 'data-analyst', 'etl',
                'pipeline', 'warehouse', 'analytics', 'bi', 'reporting'
            ],
            'ai-ml': [
                'ai-engineer', 'ml-engineer', 'llm', 'model', 'training',
                'inference', 'prompt', 'gpt', 'claude', 'anthropic'
            ],
            'testing': [
                'test', 'qa', 'automation', 'pytest', 'unittest', 'validation',
                'verification', 'ci-cd'
            ]
        }
        
        # Categorize each skill
        for skill in self.skills.values():
            skill_lower = skill.name.lower()
            skill_id_lower = skill.skill_id.lower()
            skill_tags = [t.lower() for t in skill.tags]
            
            categorized = False
            for category, keywords in category_rules.items():
                for keyword in keywords:
                    if (keyword in skill_lower or 
                        keyword in skill_id_lower or 
                        any(keyword in tag for tag in skill_tags)):
                        skill.category = category
                        self.categories[category].add(skill.skill_id)
                        categorized = True
                        break
                if categorized:
                    break
            
            if not categorized:
                skill.category = "general"
                self.categories["general"].add(skill.skill_id)
    
    def get_skills_by_category(self, category: str) -> List[Skill]:
        """Get all skills in a specific category"""
        skill_ids = self.categories.get(category, set())
        return [self.skills[sid] for sid in skill_ids if sid in self.skills]
    
    def get_all_categories(self) -> List[str]:
        """Get list of all categories"""
        return list(self.categories.keys())
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get discovery statistics"""
        return {
            "total_skills": len(self.skills),
            "categories": {cat: len(skills) for cat, skills in self.categories.items()},
            "discovery_time_ms": self.discovery_time_ms,
            "sources": list(set(s.source for s in self.skills.values()))
        }


# ==================== PROGRESSIVE LOADER ====================
class ProgressiveLoader:
    """Lazy-loads skills with caching and performance tracking"""
    
    def __init__(self, discovery: SkillDiscovery):
        self.discovery = discovery
        self._loaded_skills: Dict[str, Skill] = {}
        self._skill_cache: Dict[str, CacheEntry] = {}
        self._category_load_order: List[str] = []
        self._lock = threading.RLock()
        self._performance_metrics = {
            "cache_hits": 0,
            "cache_misses": 0,
            "total_loads": 0,
            "load_time_ms": 0.0,
            "peak_memory_mb": 0.0
        }
        
        # Determine load order by category priority
        self._determine_load_order()
    
    def _determine_load_order(self):
        """Determine which categories to load first"""
        # Priority order: engineering > product > marketing > operations > security > data > ai-ml > general
        priority_order = [
            'engineering', 'product', 'marketing', 'operations',
            'security', 'data', 'ai-ml', 'general'
        ]
        
        available_cats = self.discovery.get_all_categories()
        self._category_load_order = [
            cat for cat in priority_order if cat in available_cats
        ]
        # Add any remaining categories at the end
        for cat in available_cats:
            if cat not in self._category_load_order:
                self._category_load_order.append(cat)
    
    def get_skill(self, skill_id: str, force_reload: bool = False) -> Optional[Skill]:
        """
        Get a skill by ID, loading it on demand
        
        Args:
            skill_id: Unique skill identifier
            force_reload: Force reload even if cached
            
        Returns:
            Skill object or None if not found
        """
        with self._lock:
            # Check cache first
            if not force_reload and skill_id in self._skill_cache:
                cache_entry = self._skill_cache[skill_id]
                if cache_entry.is_valid():
                    self._performance_metrics["cache_hits"] += 1
                    return cache_entry.data
                else:
                    # Cache expired, remove it
                    del self._skill_cache[skill_id]
            
            # Cache miss or expired
            if skill_id in self._loaded_skills:
                self._performance_metrics["cache_misses"] += 1
                return self._loaded_skills[skill_id]
            
            # Check if skill exists
            if skill_id not in self.discovery.skills:
                logger.warning(f"Skill not found: {skill_id}")
                return None
            
            # Load the skill
            start_time = time.time()
            skill = self.discovery.skills[skill_id]
            loaded_skill = self._load_skill(skill)
            load_time = (time.time() - start_time) * 1000
            
            # Cache it
            self._loaded_skills[skill_id] = loaded_skill
            self._skill_cache[skill_id] = CacheEntry(
                data=loaded_skill,
                timestamp=datetime.now(),
                ttl_minutes=REAL_WORLD_BENCHMARKS.CACHE_TTL_MINUTES
            )
            
            self._performance_metrics["cache_misses"] += 1
            self._performance_metrics["total_loads"] += 1
            self._performance_metrics["load_time_ms"] += load_time
            
            # Track memory
            self._update_memory_usage()
            
            return loaded_skill
    
    def _load_skill(self, skill: Skill) -> Skill:
        """
        Actually load a skill (simulate loading its implementation)
        This would normally load the actual skill module
        """
        # Simulate loading by marking as loaded and adding metadata
        skill.loaded = True
        skill.metadata['loaded_at'] = datetime.now().isoformat()
        skill.metadata['memory_estimate_kb'] = 512  # Estimate per skill
        return skill
    
    def load_category(self, category: str) -> List[Skill]:
        """
        Load all skills in a category
        
        Args:
            category: Category name to load
            
        Returns:
            List of loaded skills
        """
        skills = self.discovery.get_skills_by_category(category)
        loaded = []
        for skill in skills:
            loaded_skill = self.get_skill(skill.skill_id)
            if loaded_skill:
                loaded.append(loaded_skill)
        return loaded
    
    def _update_memory_usage(self):
        """Update peak memory usage stats"""
        process = psutil.Process(os.getpid())
        memory_mb = process.memory_info().rss / 1024 / 1024
        self._performance_metrics["peak_memory_mb"] = max(
            self._performance_metrics["peak_memory_mb"],
            memory_mb
        )
    
    def get_performance_metrics(self) -> Dict[str, Any]:
        """Get current performance metrics"""
        with self._lock:
            metrics = self._performance_metrics.copy()
            
            # Calculate cache hit rate
            total_requests = metrics["cache_hits"] + metrics["cache_misses"]
            if total_requests > 0:
                metrics["cache_hit_rate"] = metrics["cache_hits"] / total_requests
            else:
                metrics["cache_hit_rate"] = 0.0
            
            # Memory overhead
            process = psutil.Process(os.getpid())
            baseline_mb = getattr(self, '_baseline_memory_mb', 0)
            if baseline_mb == 0:
                baseline_mb = process.memory_info().rss / 1024 / 1024
                self._baseline_memory_mb = baseline_mb
            
            current_mb = process.memory_info().rss / 1024 / 1024
            metrics["memory_overhead_mb"] = current_mb - baseline_mb
            metrics["current_memory_mb"] = current_mb
            
            return metrics
    
    def get_loaded_skills(self) -> List[Skill]:
        """Get list of all currently loaded skills"""
        with self._lock:
            return list(self._loaded_skills.values())
    
    def get_cache_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        with self._lock:
            return {
                "cached_skills": len(self._skill_cache),
                "loaded_skills": len(self._loaded_skills),
                "total_skills": len(self.discovery.skills)
            }
    
    def preload_categories(self, categories: List[str] = None):
        """
        Preload specific categories or priority ones by default
        
        Args:
            categories: List of categories to preload. If None, loads high-priority ones.
        """
        if categories is None:
            # Load first 2 priority categories
            categories = self._category_load_order[:2]
        
        logger.info(f"Preloading categories: {categories}")
        for category in categories:
            self.load_category(category)
    
    def clear_cache(self):
        """Clear the cache (not loaded skills)"""
        with self._lock:
            self._skill_cache.clear()
            logger.info("Cache cleared")
    
    def unload_skill(self, skill_id: str):
        """Unload a specific skill to free memory"""
        with self._lock:
            if skill_id in self._loaded_skills:
                del self._loaded_skills[skill_id]
            if skill_id in self._skill_cache:
                del self._skill_cache[skill_id]
            logger.debug(f"Unloaded skill: {skill_id}")
    
    def unload_category(self, category: str):
        """Unload all skills in a category"""
        skills = self.discovery.get_skills_by_category(category)
        for skill in skills:
            self.unload_skill(skill.skill_id)
        logger.info(f"Unloaded {len(skills)} skills from category: {category}")


# ==================== MAIN EXECUTION ====================
def main():
    """Standalone execution for testing"""
    print("=" * 60)
    print("SKILL MANAGER - PROGRESSIVE DISCLOSURE DEMO")
    print("=" * 60)
    
    # Initialize
    print("\n1. Initializing Skill Discovery...")
    discovery = SkillDiscovery()
    
    # Discover all skills
    print("\n2. Discovering all skills...")
    all_skills = discovery.discover_all()
    
    # Print statistics
    stats = discovery.get_statistics()
    print(f"\nDiscovery Statistics:")
    print(f"  Total skills: {stats['total_skills']}")
    print(f"  Discovery time: {stats['discovery_time_ms']:.2f}ms")
    print(f"  Benchmark: < {REAL_WORLD_BENCHMARKS.DISCOVERY_TIME_MS}ms")
    print(f"  Status: {'✓ PASS' if stats['discovery_time_ms'] < REAL_WORLD_BENCHMARKS.DISCOVERY_TIME_MS else '✗ FAIL'}")
    
    print(f"\n  Categories ({len(stats['categories'])}):")
    for cat, count in sorted(stats['categories'].items()):
        print(f"    {cat}: {count}")
    
    # Initialize progressive loader
    print("\n3. Initializing Progressive Loader...")
    loader = ProgressiveLoader(discovery)
    
    # Demonstrate progressive loading
    print("\n4. Demonstrating progressive loading...")
    print("  Accessing skills one by one...")
    
    # Access a few skills
    sample_skills = list(all_skills.keys())[:5]
    for skill_id in sample_skills:
        skill = loader.get_skill(skill_id)
        if skill:
            print(f"  Loaded: {skill.name} [{skill.category}]")
    
    # Show metrics
    metrics = loader.get_performance_metrics()
    print(f"\n5. Performance Metrics:")
    print(f"  Cache hits: {metrics['cache_hits']}")
    print(f"  Cache misses: {metrics['cache_misses']}")
    print(f"  Cache hit rate: {metrics.get('cache_hit_rate', 0):.2%}")
    print(f"  Target: {REAL_WORLD_BENCHMARKS.CACHE_HIT_RATE:.0%}")
    print(f"  Memory overhead: {metrics.get('memory_overhead_mb', 0):.2f} MB")
    print(f"  Limit: {REAL_WORLD_BENCHMARKS.MEMORY_OVERHEAD_MB} MB")
    
    cache_rate = metrics.get('cache_hit_rate', 0)
    memory_overhead = metrics.get('memory_overhead_mb', 0)
    
    print(f"\n  Cache hit rate: {'✓ PASS' if cache_rate >= REAL_WORLD_BENCHMARKS.CACHE_HIT_RATE else '✗ FAIL'}")
    print(f"  Memory overhead: {'✓ PASS' if memory_overhead < REAL_WORLD_BENCHMARKS.MEMORY_OVERHEAD_MB else '✗ FAIL'}")
    
    # Cleanup
    loader.clear_cache()
    print("\n6. Cache cleared. Demo complete.")
    
    return 0


if __name__ == "__main__":
    sys.exit(main())
