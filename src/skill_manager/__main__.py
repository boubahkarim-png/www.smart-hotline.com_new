#!/usr/bin/env python3
"""
Main entry point for skill_manager module

Provides command-line interface for skill management operations.
"""

import sys
import argparse
import time
from skill_manager import SkillDiscovery, ProgressiveLoader, REAL_WORLD_BENCHMARKS
from skill_manager import Skill


def cmd_discover(args):
    """Discover and list all skills"""
    print("Discovering all skills...")
    discovery = SkillDiscovery()
    skills = discovery.discover_all()
    
    stats = discovery.get_statistics()
    print(f"\nDiscovery complete!")
    print(f"Total skills: {stats['total_skills']}")
    print(f"Time: {stats['discovery_time_ms']:.2f}ms")
    print(f"\nCategories:")
    for cat, count in sorted(stats['categories'].items()):
        print(f"  {cat}: {count}")
    
    if args.list:
        print(f"\nAll skills ({len(skills)}):")
        for skill in sorted(skills.values(), key=lambda s: s.skill_id):
            print(f"  {skill.skill_id}: {skill.name} [{skill.category}]")
    
    # Benchmark check
    if stats['discovery_time_ms'] > REAL_WORLD_BENCHMARKS.DISCOVERY_TIME_MS:
        print(f"\n⚠️  WARNING: Discovery time exceeds benchmark!")
        print(f"   Expected: <{REAL_WORLD_BENCHMARKS.DISCOVERY_TIME_MS}ms")
        print(f"   Actual: {stats['discovery_time_ms']:.2f}ms")
        return 1
    
    return 0


def cmd_load(args):
    """Load skills progressively and show metrics"""
    print("Initializing progressive loader...")
    discovery = SkillDiscovery()
    discovery.discover_all()
    
    loader = ProgressiveLoader(discovery)
    
    if args.preload:
        print(f"Preloading categories: {args.preload}")
        loader.preload_categories(args.preload)
    else:
        print("Preloading priority categories...")
        loader.preload_categories()
    
    metrics = loader.get_performance_metrics()
    cache_stats = loader.get_cache_stats()
    
    print(f"\nLoader Statistics:")
    print(f"  Total skills: {cache_stats['total_skills']}")
    print(f"  Loaded skills: {cache_stats['loaded_skills']}")
    print(f"  Cached skills: {cache_stats['cached_skills']}")
    print(f"\nPerformance:")
    print(f"  Cache hit rate: {metrics.get('cache_hit_rate', 0):.2%} (target: {REAL_WORLD_BENCHMARKS.CACHE_HIT_RATE:.0%})")
    print(f"  Memory overhead: {metrics.get('memory_overhead_mb', 0):.2f} MB (limit: {REAL_WORLD_BENCHMARKS.MEMORY_OVERHEAD_MB} MB)")
    print(f"  Peak memory: {metrics.get('peak_memory_mb', 0):.2f} MB")
    
    # Benchmark checks
    passed = 0
    failed = 0
    
    if metrics.get('cache_hit_rate', 0) >= REAL_WORLD_BENCHMARKS.CACHE_HIT_RATE:
        print("  ✓ Cache hit rate: PASS")
        passed += 1
    else:
        print("  ✗ Cache hit rate: FAIL")
        failed += 1
    
    if metrics.get('memory_overhead_mb', 0) < REAL_WORLD_BENCHMARKS.MEMORY_OVERHEAD_MB:
        print("  ✓ Memory overhead: PASS")
        passed += 1
    else:
        print("  ✗ Memory overhead: FAIL")
        failed += 1
    
    if failed == 0:
        print(f"\n✓ All benchmarks passed ({passed}/{passed})")
        return 0
    else:
        print(f"\n✗ {failed} benchmark(s) failed")
        return 1


def cmd_skill(args):
    """Get details about a specific skill"""
    discovery = SkillDiscovery()
    discovery.discover_all()
    loader = ProgressiveLoader(discovery)
    
    skill = loader.get_skill(args.skill_id)
    if not skill:
        print(f"Skill not found: {args.skill_id}")
        return 1
    
    print(f"Skill: {skill.name}")
    print(f"ID: {skill.skill_id}")
    print(f"Category: {skill.category}")
    print(f"Source: {skill.source}")
    print(f"Description: {skill.description}")
    print(f"Tags: {', '.join(skill.tags)}")
    print(f"Loaded: {skill.loaded}")
    if skill.metadata:
        print(f"Metadata:")
        for key, value in skill.metadata.items():
            print(f"  {key}: {value}")
    
    return 0


def cmd_category(args):
    """List skills in a category"""
    discovery = SkillDiscovery()
    discovery.discover_all()
    
    category = args.category
    if category == "all":
        categories = discovery.get_all_categories()
        print(f"All categories ({len(categories)}):")
        for cat in sorted(categories):
            skills = discovery.get_skills_by_category(cat)
            print(f"  {cat}: {len(skills)} skills")
        return 0
    
    skills = discovery.get_skills_by_category(category)
    if not skills:
        print(f"Category not found: {category}")
        print(f"Available: {', '.join(discovery.get_all_categories())}")
        return 1
    
    print(f"Category '{category}' ({len(skills)} skills):")
    for skill in sorted(skills, key=lambda s: s.skill_id)[:args.limit]:
        print(f"  {skill.skill_id}: {skill.name}")
    
    if len(skills) > args.limit:
        print(f"  ... and {len(skills) - args.limit} more")
    
    return 0


def main():
    parser = argparse.ArgumentParser(
        description="Skill Manager - Progressive skill loading with caching"
    )
    subparsers = parser.add_subparsers(dest='command', help='Command')
    
    # Discover command
    p_discover = subparsers.add_parser('discover', help='Discover all skills')
    p_discover.add_argument('--list', action='store_true', help='List all discovered skills')
    p_discover.set_defaults(func=cmd_discover)
    
    # Load command
    p_load = subparsers.add_parser('load', help='Load skills and show metrics')
    p_load.add_argument('--preload', nargs='*', help='Preload specific categories')
    p_load.set_defaults(func=cmd_load)
    
    # Skill command
    p_skill = subparsers.add_parser('skill', help='Get skill details')
    p_skill.add_argument('skill_id', help='Skill ID')
    p_skill.set_defaults(func=cmd_skill)
    
    # Category command
    p_category = subparsers.add_parser('category', help='List skills in category')
    p_category.add_argument('category', help='Category name (or "all")')
    p_category.add_argument('--limit', type=int, default=20, help='Limit output')
    p_category.set_defaults(func=cmd_category)
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return 1
    
    try:
        return args.func(args)
    except KeyboardInterrupt:
        print("\nInterrupted")
        return 130
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())
