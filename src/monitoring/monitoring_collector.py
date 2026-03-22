#!/usr/bin/env python3
"""
Monitoring Collector Implementation

Features:
- Prometheus metrics collection
- SQLite database for metrics storage
- Health check endpoints
- Resource usage monitoring (CPU, memory, disk)
- Agent health status tracking
- Circuit breaker for metrics collection
- Graceful shutdown
- REAL_WORLD_BENCHMARKS: p99_latency=100ms, p95_latency=50ms, throughput=100rps
"""

import os
import sys
import time
import sqlite3
import threading
import logging
import json
from datetime import datetime, timedelta
from pathlib import Path
import psutil
import prometheus_client
from prometheus_client import Counter, Gauge, Histogram, Summary, CollectorRegistry
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
import contextlib
import socket
import signal
import random

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# REAL_WORLD_BENCHMARKS
class REAL_WORLD_BENCHMARKS:
    P99_LATENCY_MS = 100
    P95_LATENCY_MS = 50
    THROUGHPUT_RPS = 100
    METRICS_COLLECTION_TIMEOUT_MS = 500
    SQLITE_DB_SIZE_LIMIT_MB = 100

# Prometheus metrics
REGISTRY = CollectorRegistry()

# Counters
METRICS_COLLECTED = Counter('monitoring_metrics_collected_total', 'Total number of metrics collected', registry=REGISTRY)
COLLECTION_FAILURES = Counter('monitoring_collection_failures_total', 'Total number of collection failures', registry=REGISTRY)

# Gauges
CPU_USAGE = Gauge('monitoring_cpu_usage_percent', 'Current CPU usage percentage', registry=REGISTRY)
MEMORY_USAGE = Gauge('monitoring_memory_usage_bytes', 'Current memory usage in bytes', registry=REGISTRY)
DISK_USAGE = Gauge('monitoring_disk_usage_bytes', 'Current disk usage in bytes', registry=REGISTRY)
AGENT_HEALTH = Gauge('monitoring_agent_health_status', 'Agent health status (1=healthy, 0=unhealthy)', ['agent_id', 'agent_type'], registry=REGISTRY)
DATABASE_SIZE = Gauge('monitoring_database_size_bytes', 'SQLite database size in bytes', registry=REGISTRY)

# Histograms
COLLECTION_LATENCY = Histogram('monitoring_collection_latency_seconds', 'Latency of metrics collection operations', registry=REGISTRY)
REQUEST_LATENCY = Histogram('monitoring_request_latency_seconds', 'Latency of HTTP requests', registry=REGISTRY)

# Summary for percentiles
REQUEST_LATENCY_SUMMARY = Summary('monitoring_request_latency_summary_seconds', 'Summary of HTTP request latencies', registry=REGISTRY, quantiles={'0.95': 0.95, '0.99': 0.99})

class MonitoringCollector:
    def __init__(self, db_path: str = "/tmp/monitoring.db", port: int = 8888):
        self.db_path = db_path
        self.port = port
        self.running = True
        self.metrics_collection_interval = 5  # seconds
        self.agent_health_threshold = 30  # seconds
        self.max_metrics_per_collection = 1000
        
        # Initialize SQLite database
        self._init_database()
        
        # Circuit breaker state
        self.circuit_breaker_state = "CLOSED"  # CLOSED, OPEN, HALF_OPEN
        self.failure_count = 0
        self.failure_threshold = 5
        self.circuit_reset_timeout = 60  # seconds
        self.last_failure_time = None
        
        # Agent health tracking
        self.agent_health_status = {}
        self.agent_last_seen = {}
        
        # Background threads
        self.collection_thread = None
        self.health_check_thread = None
        
        # Setup graceful shutdown
        signal.signal(signal.SIGINT, self._signal_handler)
        signal.signal(signal.SIGTERM, self._signal_handler)
        
        logger.info(f"Monitoring Collector initialized. DB: {self.db_path}, Port: {self.port}")
        
    def _init_database(self):
        """Initialize SQLite database with metrics schema"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create metrics table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS metrics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                metric_name TEXT NOT NULL,
                metric_value REAL NOT NULL,
                metric_type TEXT NOT NULL,
                agent_id TEXT,
                tags TEXT
            )
        ''')
        
        # Create agent health table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS agent_health (
                agent_id TEXT PRIMARY KEY,
                agent_type TEXT NOT NULL,
                status INTEGER DEFAULT 1,  # 1=healthy, 0=unhealthy
                last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
                last_status_change DATETIME DEFAULT CURRENT_TIMESTAMP,
                metadata TEXT
            )
        ''')
        
        # Create indexes for performance
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_metrics_timestamp ON metrics(timestamp)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_metrics_name ON metrics(metric_name)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_agent_health_id ON agent_health(agent_id)')
        
        conn.commit()
        conn.close()
        
        # Initialize Prometheus gauges
        self._update_database_size()
        
    def _update_database_size(self):
        """Update database size gauge"""
        try:
            if os.path.exists(self.db_path):
                size = os.path.getsize(self.db_path)
                DATABASE_SIZE.set(size)
        except Exception as e:
            logger.error(f"Failed to get database size: {e}")
            
    def _check_circuit_breaker(self):
        """Check if circuit breaker should trip"""
        if self.circuit_breaker_state == "OPEN":
            # Check if we should reset to HALF_OPEN
            if (datetime.now() - self.last_failure_time).total_seconds() > self.circuit_reset_timeout:
                self.circuit_breaker_state = "HALF_OPEN"
                logger.info("Circuit breaker reset to HALF_OPEN")
                return True
            return False
        
        return True
        
    def _trip_circuit_breaker(self):
        """Trip the circuit breaker"""
        self.circuit_breaker_state = "OPEN"
        self.failure_count = 0
        self.last_failure_time = datetime.now()
        logger.error("Circuit breaker TRIPPED due to collection failures")
        
    def collect_metrics(self):
        """Collect system and agent metrics with circuit breaker"""
        if not self._check_circuit_breaker():
            logger.warning("Circuit breaker is OPEN, skipping metrics collection")
            return False
            
        start_time = datetime.now()
        
        try:
            # Collect system metrics
            self._collect_system_metrics()
            
            # Collect agent metrics
            self._collect_agent_metrics()
            
            # Update Prometheus gauges
            self._update_prometheus_metrics()
            
            # Store metrics in SQLite
            self._store_metrics_in_db()
            
            # Reset failure count on success
            if self.failure_count > 0:
                self.failure_count = 0
                logger.info("Collection successful, reset failure count")
                
            duration = (datetime.now() - start_time).total_seconds()
            COLLECTION_LATENCY.observe(duration)
            
            # Check p99 latency benchmark
            if duration > REAL_WORLD_BENCHMARKS.P99_LATENCY_MS / 1000:
                logger.warning(f"Collection latency {duration*1000:.2f}ms exceeds p99 benchmark {REAL_WORLD_BENCHMARKS.P99_LATENCY_MS}ms")
                
            METRICS_COLLECTED.inc()
            return True
            
        except Exception as e:
            duration = (datetime.now() - start_time).total_seconds()
            COLLECTION_LATENCY.observe(duration)
            
            COLLECTION_FAILURES.inc()
            self.failure_count += 1
            
            if self.failure_count >= self.failure_threshold:
                self._trip_circuit_breaker()
                
            logger.error(f"Metrics collection failed: {e}")
            return False
            
    def _collect_system_metrics(self):
        """Collect system-level metrics"""
        try:
            # CPU usage
            cpu_percent = psutil.cpu_percent(interval=0.1)
            
            # Memory usage
            memory = psutil.virtual_memory()
            
            # Disk usage
            disk = psutil.disk_usage('/')
            
            # Network stats
            net = psutil.net_io_counters()
            
            # Store in instance variables for later use
            self.system_metrics = {
                'cpu_percent': cpu_percent,
                'memory_total': memory.total,
                'memory_used': memory.used,
                'memory_percent': memory.percent,
                'disk_total': disk.total,
                'disk_used': disk.used,
                'disk_percent': disk.percent,
                'bytes_sent': net.bytes_sent,
                'bytes_recv': net.bytes_recv,
                'packets_sent': net.packets_sent,
                'packets_recv': net.packets_recv,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Failed to collect system metrics: {e}")
            
    def _collect_agent_metrics(self):
        """Collect agent health metrics"""
        try:
            # Simulate agent health checks
            # In real implementation, this would query actual agent status
            
            # Get agent list from database
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Get all agents from agent_health table
            cursor.execute("SELECT agent_id, agent_type FROM agent_health")
            agents = cursor.fetchall()
            
            # Check agent health
            for agent_id, agent_type in agents:
                last_seen = self.agent_last_seen.get(agent_id, None)
                
                if last_seen and (datetime.now() - last_seen).total_seconds() < self.agent_health_threshold:
                    status = 1  # healthy
                else:
                    status = 0  # unhealthy
                    
                self.agent_health_status[agent_id] = {
                    'type': agent_type,
                    'status': status,
                    'last_seen': last_seen,
                    'timestamp': datetime.now().isoformat()
                }
                
            conn.close()
            
        except Exception as e:
            logger.error(f"Failed to collect agent metrics: {e}")
            
    def _update_prometheus_metrics(self):
        """Update Prometheus gauges with collected metrics"""
        try:
            # System metrics
            if hasattr(self, 'system_metrics'):
                metrics = self.system_metrics
                CPU_USAGE.set(metrics['cpu_percent'])
                MEMORY_USAGE.set(metrics['memory_used'])
                DISK_USAGE.set(metrics['disk_used'])
                
            # Agent health
            for agent_id, health in self.agent_health_status.items():
                agent_type = health.get('type', 'unknown')
                status = health.get('status', 0)
                AGENT_HEALTH.labels(agent_id=agent_id, agent_type=agent_type).set(status)
                
        except Exception as e:
            logger.error(f"Failed to update Prometheus metrics: {e}")
            
    def _store_metrics_in_db(self):
        """Store collected metrics in SQLite database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Store system metrics
            if hasattr(self, 'system_metrics'):
                metrics = self.system_metrics
                cursor.execute('''
                    INSERT INTO metrics (metric_name, metric_value, metric_type, tags)
                    VALUES (?, ?, ?, ?)
                ''', ('cpu_percent', metrics['cpu_percent'], 'gauge', json.dumps({'source': 'system'})))
                
                cursor.execute('''
                    INSERT INTO metrics (metric_name, metric_value, metric_type, tags)
                    VALUES (?, ?, ?, ?)
                ''', ('memory_used', metrics['memory_used'], 'gauge', json.dumps({'source': 'system'})))
                
                cursor.execute('''
                    INSERT INTO metrics (metric_name, metric_value, metric_type, tags)
                    VALUES (?, ?, ?, ?)
                ''', ('disk_used', metrics['disk_used'], 'gauge', json.dumps({'source': 'system'})))
            
            # Store agent health metrics
            for agent_id, health in self.agent_health_status.items():
                agent_type = health.get('type', 'unknown')
                status = health.get('status', 0)
                
                cursor.execute('''
                    INSERT INTO metrics (metric_name, metric_value, metric_type, agent_id, tags)
                    VALUES (?, ?, ?, ?, ?)
                ''', (f'agent_{agent_id}_health', status, 'gauge', agent_id, json.dumps({'type': agent_type})))
            
            conn.commit()
            conn.close()
            
        except Exception as e:
            logger.error(f"Failed to store metrics in database: {e}")
            
    def _update_agent_health(self, agent_id: str, agent_type: str, status: int = 1):
        """Update agent health status"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Update or insert agent health
            cursor.execute('''
                INSERT OR REPLACE INTO agent_health 
                (agent_id, agent_type, status, last_seen, last_status_change)
                VALUES (?, ?, ?, ?, ?)
            ''', (
                agent_id, agent_type, status,
                datetime.now(), datetime.now() if status == 1 else datetime.now()
            ))
            
            conn.commit()
            conn.close()
            
            # Update tracking
            self.agent_last_seen[agent_id] = datetime.now()
            self.agent_health_status[agent_id] = {
                'type': agent_type,
                'status': status,
                'last_seen': datetime.now(),
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Failed to update agent health for {agent_id}: {e}")
            
    def _check_throughput(self, request_count: int, interval: float):
        """Check if throughput meets benchmark"""
        throughput = request_count / interval
        if throughput < REAL_WORLD_BENCHMARKS.THROUGHPUT_RPS:
            logger.warning(f"Throughput {throughput:.2f}rps below benchmark {REAL_WORLD_BENCHMARKS.THROUGHPUT_RPS}rps")
            return False
        return True
        
    def start(self):
        """Start the monitoring collector"""
        self.running = True
        
        # Start background collection thread
        self.collection_thread = threading.Thread(target=self._run_collection, daemon=True)
        self.collection_thread.start()
        
        # Start background health check thread
        self.health_check_thread = threading.Thread(target=self._run_health_checks, daemon=True)
        self.health_check_thread.start()
        
        # Start HTTP server
        self._start_http_server()
        
        logger.info(f"Monitoring Collector started on port {self.port}")
        
    def _run_collection(self):
        """Background thread for metrics collection"""
        while self.running:
            try:
                self.collect_metrics()
                
                # Sleep for configured interval
                time.sleep(self.metrics_collection_interval)
                
            except Exception as e:
                logger.error(f"Collection thread error: {e}")
                time.sleep(1)  # Don't crash on errors
                
    def _run_health_checks(self):
        """Background thread for agent health checks"""
        while self.running:
            try:
                # Simulate health checks for registered agents
                # In real implementation, this would query actual agent status
                
                # For now, just update database size and do basic checks
                self._update_database_size()
                
                # Check if database is growing too large
                if os.path.exists(self.db_path):
                    size = os.path.getsize(self.db_path)
                    if size > REAL_WORLD_BENCHMARKS.SQLITE_DB_SIZE_LIMIT_MB * 1024 * 1024:
                        logger.warning(f"Database size {size/(1024*1024):.2f}MB exceeds limit {REAL_WORLD_BENCHMARKS.SQLITE_DB_SIZE_LIMIT_MB}MB")
                        
                time.sleep(30)  # Check every 30 seconds
                
            except Exception as e:
                logger.error(f"Health check thread error: {e}")
                time.sleep(5)
                
    def _start_http_server(self):
        """Start HTTP server for Prometheus metrics"""
        class MonitoringHandler(BaseHttpRequestHandler):
            def do_GET(self):
                """Handle GET requests"""
                start_time = time.time()
                
                try:
                    if self.path == '/metrics':
                        self.send_response(200)
                        self.send_header('Content-Type', prometheus_client.CONTENT_TYPE_LATEST)
                        self.end_headers()
                        
                        # Generate metrics
                        output = prometheus_client.generate_latest(REGISTRY)
                        self.wfile.write(output)
                        
                        # Update request latency
                        duration = time.time() - start_time
                        REQUEST_LATENCY.observe(duration)
                        REQUEST_LATENCY_SUMMARY.observe(duration)
                        
                        # Check throughput
                        if hasattr(self.server, 'request_count'):
                            interval = time.time() - getattr(self.server, 'last_check_time', time.time())
                            if interval >= 1:
                                self.server.last_check_time = time.time()
                                self.server.request_count = 0
                                
                        if not hasattr(self.server, 'request_count'):
                            self.server.request_count = 0
                            self.server.last_check_time = time.time()
                            
                        self.server.request_count += 1
                        
                        # Check throughput every second
                        if time.time() - self.server.last_check_time >= 1:
                            interval = time.time() - self.server.last_check_time
                            if hasattr(self.server, 'collector'):
                                self.server.collector._check_throughput(self.server.request_count, interval)
                                self.server.request_count = 0
                                self.server.last_check_time = time.time()
                                
                    elif self.path == '/health':
                        self._handle_health_check()
                        
                    elif self.path == '/status':
                        self._handle_status()
                        
                    else:
                        self.send_response(404)
                        self.end_headers()
                        self.wfile.write(b'Not Found')
                        
                except Exception as e:
                    self.send_response(500)
                    self.end_headers()
                    self.wfile.write(f'Internal Server Error: {e}'.encode())
                    
            def _handle_health_check(self):
                """Health check endpoint"""
                # Check if collector is running
                if hasattr(self.server, 'collector') and self.server.collector.running:
                    status = 'healthy'
                    code = 200
                else:
                    status = 'unhealthy'
                    code = 503
                    
                self.send_response(code)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                
                response = {
                    'status': status,
                    'timestamp': datetime.now().isoformat(),
                    'metrics': {
                        'cpu_usage': CPU_USAGE._value.get(),
                        'memory_usage': MEMORY_USAGE._value.get(),
                        'disk_usage': DISK_USAGE._value.get(),
                        'database_size': DATABASE_SIZE._value.get()
                    },
                    'circuit_breaker': {
                        'state': getattr(self.server.collector, 'circuit_breaker_state', 'unknown'),
                        'failures': getattr(self.server.collector, 'failure_count', 0)
                    }
                }
                
                self.wfile.write(json.dumps(response).encode())
                
            def _handle_status(self):
                """Status endpoint with detailed information"""
                if not hasattr(self.server, 'collector'):
                    self.send_response(500)
                    self.end_headers()
                    self.wfile.write(b'Collector not initialized')
                    return
                    
                collector = self.server.collector
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                
                status = {
                    'running': collector.running,
                    'db_path': collector.db_path,
                    'port': collector.port,
                    'circuit_breaker': {
                        'state': collector.circuit_breaker_state,
                        'failure_count': collector.failure_count,
                        'failure_threshold': collector.failure_threshold,
                        'last_failure_time': collector.last_failure_time.isoformat() if collector.last_failure_time else None
                    },
                    'agent_health': collector.agent_health_status,
                    'system_metrics': getattr(collector, 'system_metrics', {}),
                    'database_size': os.path.getsize(collector.db_path) if os.path.exists(collector.db_path) else 0,
                    'uptime': time.time() - collector.start_time if hasattr(collector, 'start_time') else 0
                }
                
                self.wfile.write(json.dumps(status).encode())
                
        # Create and start server
        server = ThreadingHTTPServer(('0.0.0.0', self.port), MonitoringHandler)
        server.collector = self
        server.request_count = 0
        server.last_check_time = time.time()
        server.start_time = time.time()
        
        logger.info(f"HTTP server started on port {self.port}")
        
        try:
            server.serve_forever()
        except Exception as e:
            logger.error(f"HTTP server error: {e}")
        
    def _signal_handler(self, signum, frame):
        """Handle shutdown signals"""
        logger.info(f"Received signal {signum}, shutting down...")
        self.stop()
        
    def stop(self):
        """Stop the monitoring collector gracefully"""
        if not self.running:
            return
            
        self.running = False
        
        # Stop collection thread
        if self.collection_thread:
            self.collection_thread.join(timeout=2)
            
        # Stop health check thread
        if self.health_check_thread:
            self.health_check_thread.join(timeout=2)
            
        logger.info("Monitoring Collector stopped gracefully")

# Utility functions

def test_prometheus_endpoint(url: str = "http://localhost:8888/metrics"):
    """Test Prometheus metrics endpoint"""
    try:
        import requests
        response = requests.get(url, timeout=5)
        
        if response.status_code == 200:
            # Check if response contains valid Prometheus metrics
            if b'# HELP' in response.content and b'# TYPE' in response.content:
                logger.info("Prometheus endpoint is working correctly")
                return True
            else:
                logger.warning("Prometheus endpoint returned data but format is invalid")
                return False
        else:
            logger.error(f"Prometheus endpoint returned status {response.status_code}")
            return False
            
    except Exception as e:
        logger.error(f"Failed to test Prometheus endpoint: {e}")
        return False

def get_database_metrics(db_path: str):
    """Get metrics from SQLite database"""
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Get total metrics count
        cursor.execute("SELECT COUNT(*) FROM metrics")
        total_metrics = cursor.fetchone()[0]
        
        # Get metrics by type
        cursor.execute("SELECT metric_type, COUNT(*) FROM metrics GROUP BY metric_type")
        metrics_by_type = dict(cursor.fetchall())
        
        # Get agent health status
        cursor.execute("SELECT COUNT(*) as total, SUM(status) as healthy FROM agent_health")
        health_stats = cursor.fetchone()
        healthy_agents = health_stats[1] if health_stats[1] else 0
        total_agents = health_stats[0] if health_stats[0] else 0
        
        conn.close()
        
        return {
            'total_metrics': total_metrics,
            'metrics_by_type': metrics_by_type,
            'healthy_agents': healthy_agents,
            'total_agents': total_agents,
            'database_size': os.path.getsize(db_path) if os.path.exists(db_path) else 0
        }
        
    except Exception as e:
        logger.error(f"Failed to get database metrics: {e}")
        return None

if __name__ == "__main__":
    """Standalone execution for testing"""
    print("Starting Monitoring Collector...")
    
    collector = MonitoringCollector()
    
    print("Initializing...")
    collector.start()
    
    try:
        print(f"Collector running on http://localhost:{collector.port}")
        print("Press Ctrl+C to stop")
        
        while collector.running:
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("\nShutting down...")
        collector.stop()
        print("Collector stopped")