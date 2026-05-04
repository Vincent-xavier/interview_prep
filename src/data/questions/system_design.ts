import { Question } from '../../types';

const questions: Question[] = [
{ id:"sd1", level:"intermediate", q:'Design a URL shortener (like bit.ly). Cover key components.', a:`Requirements: Shorten long URL → short code, redirect, handle millions of URLs.

1. Short code generation:
   Base62 (a-zA-Z0-9) encoding of a counter. 7 chars = 62^7 ≈ 3.5 trillion unique codes.
   Or MD5 hash → first 7 chars (collision risk); or Snowflake ID → base62.

2. Database: short_code → { original_url, user_id, created_at, expires_at }
   Redis for hot URLs (cache read-through) + PostgreSQL for persistence.

3. Read path (high traffic):
   Short URL → API Gateway → Redis cache → if miss → DB → 301/302 redirect.
   301: Permanent (browser caches → fewer server hits, less analytics).
   302: Temporary (every redirect hits server → better analytics).

4. Scale:
   Read replicas, distributed counter with pre-allocated ID ranges, CDN for redirect caching.

5. Analytics: Async event (click, UA, timestamp) → Kafka → ClickHouse for aggregation.

6. Features: Custom aliases, expiration TTL, rate limiting per user.` },
  { id:"sd2", level:"intermediate", q:'Design a rate limiter. What algorithms are commonly used?', a:`Algorithms:

1. Fixed Window Counter: Count requests per window. Simple but burst at boundary (200 req in 2s spanning two 1-min windows).
   Redis: INCR key → EXPIRE 60 → if > limit, reject.

2. Sliding Window Log: Store timestamps in sorted set, remove old, count remaining. Accurate but memory-heavy.

3. Sliding Window Counter: Interpolate between prev/curr window counts. Most practical.
   count = prev × (1 - elapsed/window) + current

4. Token Bucket: Bucket holds N tokens, refills at rate R/sec. Allows controlled bursting.

5. Leaky Bucket: Queue requests, process at fixed rate. Smooths output — no bursting.

Redis implementation:
  ZADD user:{id}:window {timestamp} {requestId}
  ZREMRANGEBYSCORE ... 0 {timestamp - windowMs}
  ZCARD ... → compare to limit

Distributed: Centralized Redis (consistent) or per-node with sync (eventual consistency).` },
  { id:"sd3", level:"advanced", q:'How would you design a real-time chat application (like Slack)?', a:`1. WebSocket Gateway:
   Persistent WebSocket per user session.
   Scale-out: Redis Pub/Sub backplane — server A receives message → publish to Redis → all servers push to clients.

2. Message Service: POST /channels/{id}/messages → validate → persist → publish to queue.

3. Storage:
   PostgreSQL: Channel metadata, memberships.
   Cassandra or TimescaleDB: Message history (time-series, append-heavy).
   Schema: (channel_id, message_id UUID, sender_id, content, created_at)

4. Fan-out: Notify all online channel members via WebSocket. Offline → store unread count in Redis.

5. Presence: User heartbeat every 30s → Redis TTL key. Presence server broadcasts online/offline.

6. Delivery guarantees: Client acks message receipt. Server persists before ack. Retry on reconnect.

7. Search: Elasticsearch for full-text message search.

8. Scale: 1M concurrent WebSocket connections → multiple gateway servers + Redis backplane.` },
  { id:"sd4", level:"advanced", q:'Explain the CAP theorem, BASE vs ACID, and how they affect distributed system design.', a:`CAP: In a distributed system, guarantee at most 2 of:
  C (Consistency): All nodes see same data simultaneously.
  A (Availability): Every request gets a response.
  P (Partition Tolerance): Works despite network partitions.

Since partitions are a given → choose CP or AP:
  CP: Consistent but may be unavailable during partition. ZooKeeper, MongoDB (strong mode).
  AP: Available but may return stale data. Cassandra, DynamoDB.

ACID (traditional RDBMS):
  Atomicity, Consistency, Isolation, Durability — strong guarantees.

BASE (NoSQL/distributed):
  Basically Available, Soft state, Eventually Consistent — relaxed guarantees for availability.

Design decisions:
  Financial transactions → CP/ACID (strong consistency required).
  Social media feeds → AP/BASE (slight staleness acceptable).
  Inventory → CP (prevent overselling).
  Shopping cart → AP (merge conflicts on reconciliation).` },
  { id:"sd5", level:"advanced", q:'Design a distributed job scheduler (like Hangfire at scale).', a:`Components:

1. Job Store (PostgreSQL):
   jobs(id, type, payload, status, run_at, attempts, max_attempts, worker_id, locked_until)

2. Worker pickup using SKIP LOCKED (prevents duplicate processing):
   SELECT * FROM jobs WHERE status='pending' AND run_at<=now()
   FOR UPDATE SKIP LOCKED LIMIT 10;

3. Heartbeat: Worker updates locked_until every 30s. Expired locks → reassigned.

4. Retry: On failure, increment attempts. If < max: status='pending', run_at = now + exponential_backoff.

5. Recurring jobs: Cron expression table. Scheduler calculates next_run_at, inserts job record.

6. Scale-out: Multiple schedulers use SKIP LOCKED (DB deduplication — no leader election needed).

7. Outbox pattern: Ensure job creation is atomic with business transaction.

8. Dashboard: Job status, failure rates, dead-letter queue, retry control.` },
  { id:"sd6", level:"advanced", q:'Design a leaderboard with real-time rankings for millions of players.', a:`Redis Sorted Set (perfect data structure):
  ZADD leaderboard {score} {player_id}    // O(log N)
  ZREVRANK leaderboard {player_id}         // rank from top O(log N)
  ZREVRANGE leaderboard 0 9 WITHSCORES    // top 10

Architecture:
1. Score updates: API → Kafka → Worker → ZADD Redis + UPDATE PostgreSQL.
   Kafka handles burst writes; worker processes serially per player.

2. Sharding for billions:
   Sample-based rank (approximate global rank, accurate enough).
   Or partition by score range: shard_A handles 0-1M score, etc.

3. Persistence: Redis primary for reads; PostgreSQL source of truth.
   Scheduled job reconciles daily.

4. Friends leaderboard: Per-user sorted set (ZADD user_{id}_friends_lb).
   Updated when any friend's score changes.

5. Real-time: Push rank changes via WebSocket/SSE to active players.

6. Historical: Cron job snapshots Redis sorted set → DB for season/weekly leaderboards.` },
  { id:"sd7", level:"advanced", q:'What is the Outbox Pattern? Why is it needed for reliable event publishing?', a:`Problem (dual-write): When a service needs to update the DB AND publish an event, both must happen atomically. If the service crashes between the two operations, they become inconsistent.

  // WRONG — not atomic:
  await db.SaveChangesAsync();   // succeeds
  await bus.PublishAsync(event); // crashes → event never published!

Outbox Pattern:
  // Write to outbox table IN THE SAME DB TRANSACTION as business data:
  BEGIN;
    UPDATE orders SET status = 'confirmed';
    INSERT INTO outbox (id, type, payload, created_at, sent) VALUES (..., false);
  COMMIT; // atomic — either both succeed or neither does

  // Separate Outbox Poller (background service):
  SELECT * FROM outbox WHERE sent = false ORDER BY created_at LIMIT 100;
  // For each: publish to message bus → mark sent = true.

Benefits:
  - At-least-once delivery guaranteed (idempotent consumers handle duplicates).
  - No distributed transaction needed.
  - Business logic and event publishing are decoupled.

Implementations: Debezium (CDC), MassTransit Outbox, NServiceBus, custom Hangfire poller.` },
  { id:"sd8", level:"expert", q:'Design a system to process 1 million payment transactions per day reliably.', a:`1M/day = ~12/sec avg, ~100/sec peak.

Requirements: Exactly-once processing, ACID, idempotency, audit trail.

1. API: POST /payments → validate → generate idempotency_key → publish to Kafka → return 202.

2. Kafka: Partitioned by merchant_id (ordered per merchant, parallel across merchants).

3. Payment Processor Worker:
   - Consume Kafka.
   - Idempotency: INSERT INTO processed_events(key) ON CONFLICT DO NOTHING.
   - Call payment gateway with idempotency key.
   - DB transaction: UPDATE payment + INSERT ledger_entry + INSERT outbox_event.

4. Outbox: Publish PaymentCompleted event after successful DB commit.

5. Compensating transactions: If gateway times out, query gateway for status before retrying.

6. Reconciliation: Daily job compares Kafka events vs gateway records vs DB.

7. Monitoring: Processing lag, error rate, p99 latency, failed payment alerts.

8. Disaster recovery: Multi-region PostgreSQL (Patroni), Kafka MirrorMaker.` },
  { id:"sd9", level:"expert", q:'How do you design for 99.99% (four nines) availability?', a:`99.99% = 52.6 minutes downtime per YEAR.

Pillars:

1. No single points of failure:
   Multiple API instances + load balancer. DB primary + replicas + auto-failover. Redis Sentinel/Cluster.

2. Geographic redundancy:
   Deploy in 2+ regions. Active-active or active-passive. Global load balancer (Cloudflare, Azure Front Door).

3. Circuit breakers (Polly): Detect failing dependencies fast → fail-fast → fallback.

4. Graceful degradation: Recommendation fails → serve generic. Payment slow → show queue message.

5. Health checks + auto-healing: Kubernetes liveness/readiness probes. Auto-scaling groups replace failed instances.

6. Zero-downtime deployments: Blue-green or canary. DB migrations backward-compatible (expand/contract).

7. Chaos engineering: Kill instances proactively (Chaos Monkey) to validate resilience.

8. Monitoring + alerting: SLO tracking, p99 latency alerts, error rate alerts, on-call runbooks.

9. RTO/RPO: Define Recovery Time Objective and Recovery Point Objective. Test failover regularly.` },
  { id:"sd10", level:"advanced", q:'Explain distributed caching strategies and cache eviction policies.', a:`Caching patterns:

Cache-aside (most common): App checks cache → miss → load from DB → write cache.
Write-through: Write to cache AND DB synchronously. Always fresh, higher write latency.
Write-behind: Write cache → async write to DB. Fast writes, risk of data loss.
Read-through: Cache fetches from DB on miss automatically.

Eviction Policies:
- LRU (Least Recently Used): Evict not-accessed-longest. Redis default.
- LFU (Least Frequently Used): Evict lowest access frequency. Good for Zipfian distribution.
- TTL: Items expire after set time.

Cache stampede (thundering herd):
  Many requests miss cache simultaneously → all hit DB.
  Fix: Probabilistic early expiration, mutex lock on miss, request coalescing.

Cache invalidation strategies:
  Event-driven: DB change → publish event → invalidate cache key.
  TTL-based: Accept eventual consistency with short TTL.
  Version key: Include version in cache key — increment version → old keys expire naturally.

Redis Cluster: Horizontal scaling. 16384 hash slots distributed across nodes. Keys mapped by CRC16(key) % 16384.` }
];

export default questions;
