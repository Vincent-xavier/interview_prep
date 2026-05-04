import { Question } from '../../types';

const questions: Question[] = [
{ id:"db1", level:"beginner", q:'Explain the difference between INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN.', a:`INNER JOIN: Returns rows where there is a match in BOTH tables.
  SELECT * FROM Orders o INNER JOIN Customers c ON o.CustomerId = c.Id
  -- Only orders that have a matching customer.

LEFT JOIN: All rows from the LEFT table, matched rows from RIGHT (NULLs for no match).
  -- All orders, even those without a customer record.

RIGHT JOIN: All rows from RIGHT, matched from LEFT. (Rarely used; prefer LEFT JOIN by swapping tables.)

FULL OUTER JOIN: All rows from BOTH tables. NULLs where no match.
  -- All orders AND all customers, even unmatched.

CROSS JOIN: Cartesian product — every row from A × every row from B. No ON condition.

NULL check for unmatched: WHERE c.Id IS NULL (find orders with no customer).` },
  { id:"db2", level:"beginner", q:'What is the difference between WHERE and HAVING?', a:`WHERE: Filters rows BEFORE grouping (cannot reference aggregate functions).
  SELECT dept, COUNT(*) FROM employees WHERE salary > 50000 GROUP BY dept;
  -- Filters individual employees first, then groups.

HAVING: Filters groups AFTER GROUP BY (can reference aggregate functions).
  SELECT dept, COUNT(*) as cnt FROM employees GROUP BY dept HAVING COUNT(*) > 5;
  -- Filters departments that have more than 5 employees.

Order of execution:
  FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT

You can use both:
  SELECT dept, AVG(salary) FROM employees
  WHERE active = true
  GROUP BY dept
  HAVING AVG(salary) > 60000;` },
  { id:"db3", level:"intermediate", q:'What are window functions? Explain ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD.', a:`Window functions compute values across a set of rows related to the current row (the "window"), without collapsing them like GROUP BY.

  SELECT name, dept, salary,
    ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC) as row_num,
    RANK() OVER (PARTITION BY dept ORDER BY salary DESC) as rnk,
    DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) as dense_rnk,
    LAG(salary)  OVER (ORDER BY hire_date) as prev_salary,
    LEAD(salary) OVER (ORDER BY hire_date) as next_salary
  FROM employees;

ROW_NUMBER: Unique sequential number, no ties (1,2,3,4).
RANK:        Ties get same rank, next rank skips (1,1,3,4).
DENSE_RANK:  Ties get same rank, no gaps (1,1,2,3).
LAG(col, n): Value from n rows BEFORE current row.
LEAD(col, n): Value from n rows AFTER current row.

Use case: Ranking top-N per group, running totals (SUM() OVER), moving averages.` },
  { id:"db4", level:"intermediate", q:'What are CTEs and recursive CTEs? When would you use them?', a:`CTE (Common Table Expression): Named temporary result set for the duration of one query.
  WITH RecentOrders AS (
    SELECT * FROM orders WHERE created_at > NOW() - INTERVAL '7 days'
  )
  SELECT customer_id, COUNT(*) FROM RecentOrders GROUP BY customer_id;

Benefits: Readability, reuse within query, alternative to subqueries.

Recursive CTE: References itself to traverse hierarchical data (org charts, tree structures).
  WITH RECURSIVE OrgTree AS (
    SELECT id, name, manager_id, 0 AS level
    FROM employees WHERE manager_id IS NULL  -- anchor: root
    UNION ALL
    SELECT e.id, e.name, e.manager_id, o.level + 1
    FROM employees e JOIN OrgTree o ON e.manager_id = o.id  -- recursive
  )
  SELECT * FROM OrgTree ORDER BY level;

Use cases: Hierarchy traversal, graph paths, generating date series.` },
  { id:"db5", level:"intermediate", q:'Explain database indexes — types and query optimization strategy.', a:`Index: A data structure (B-tree by default) that speeds up data retrieval at the cost of storage and write performance.

Index types in PostgreSQL:
- B-tree (default): Equality and range queries. Most common.
- Hash: Only equality checks — no range.
- GiST/GIN: Full-text search, JSONB, array contains.
- BRIN: Large, sequentially ordered data (timestamps in time-series).
- Partial: Index only rows matching a condition.

  CREATE INDEX idx_orders_customer ON orders(customer_id); -- B-tree
  CREATE INDEX idx_active ON users(email) WHERE active = true; -- partial
  CREATE INDEX idx_name_age ON users(last_name, first_name); -- composite

Composite index rule: Most selective column first; queries must use leading columns (prefix rule).

EXPLAIN ANALYZE: Always check the query plan:
  EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 42;
  -- Look for: Seq Scan (no index) vs Index Scan vs Bitmap Heap Scan` },
  { id:"db6", level:"advanced", q:'What is MVCC in PostgreSQL and how does it affect vacuum?', a:`MVCC (Multi-Version Concurrency Control): PostgreSQL never overwrites rows in place. Instead:
- UPDATE: Inserts a new version of the row with a new xmax/xmin.
- DELETE: Marks the old row as dead (sets xmax).
- Each transaction sees a snapshot of the DB at a point in time → no read locks needed.

Problem: Dead row versions ("dead tuples") accumulate on disk → table bloat, slower scans.

VACUUM:
- Reclaims dead tuple space so it can be reused.
- Does NOT shrink table file (VACUUM FULL does, but locks the table).
- autovacuum: Background worker runs VACUUM automatically.

ANALYZE:
- Updates statistics used by the query planner to choose optimal plans.
- VACUUM ANALYZE: Both in one.

Monitoring:
  SELECT relname, n_dead_tup, last_autovacuum FROM pg_stat_user_tables;

bloat: Use pg_bloat_check or pgstattuple for diagnosis.` },
  { id:"db7", level:"advanced", q:'Explain PostgreSQL table partitioning — when and how to use it.', a:`Partitioning: Splitting a large table into smaller sub-tables (partitions) by a partition key.

Types:
- Range: By range of values (e.g., date).
- List: By discrete values (e.g., region).
- Hash: By hash of key (for even distribution).

Example (range by year):
  CREATE TABLE orders (
    id BIGINT, order_date DATE, total DECIMAL
  ) PARTITION BY RANGE (order_date);

  CREATE TABLE orders_2023 PARTITION OF orders
    FOR VALUES FROM ('2023-01-01') TO ('2024-01-01');
  CREATE TABLE orders_2024 PARTITION OF orders
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

Benefits:
- Partition pruning: Queries filtered by partition key only scan relevant partitions.
- Faster data archiving: DROP TABLE orders_2020 (instant).
- Parallel query support across partitions.

When to use: Tables with 10M+ rows, time-series data, multi-tenant systems.` },
  { id:"db8", level:"advanced", q:'What is query optimization? How do you diagnose and fix a slow query?', a:`Step 1: EXPLAIN ANALYZE
  EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT) SELECT ...;
  - Look for: Seq Scan on large tables, Nested Loop with many rows, sort on disk.

Step 2: Identify bottlenecks:
- No index → Add appropriate index.
- Index not used → Column cast/function prevents index use (WHERE LOWER(email) = '...' needs functional index).
- N+1 queries → Use JOIN or batch loading.
- SELECT * → Select only needed columns.

Step 3: Fix strategies:
- Add/fix indexes (partial, composite, covering indexes).
  CREATE INDEX ON orders(customer_id, created_at) INCLUDE (total); -- covering
- Rewrite correlated subqueries as JOINs.
- Use CTEs for readability; inline for performance.
- Increase work_mem for complex sorts/joins.
- Use connection pooling (PgBouncer) to reduce connection overhead.
- Denormalize hot read paths if necessary.

Step 4: pg_stat_statements:
  SELECT query, calls, mean_exec_time FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;` },
  { id:"db9", level:"expert", q:'How do you prevent deadlocks in PostgreSQL?', a:`Deadlock: Two transactions each waiting for a lock the other holds.
  TX1: Lock A → wait for B
  TX2: Lock B → wait for A → DEADLOCK

PostgreSQL detects and resolves deadlocks by killing one transaction.

Prevention strategies:
1. Consistent lock ordering: Always acquire locks in the same order across all transactions.
   -- Always update User before Order, never the reverse.

2. Keep transactions short: Minimize time locks are held.

3. Use SELECT ... FOR UPDATE NOWAIT or SKIP LOCKED:
   SELECT * FROM jobs WHERE status = 'pending' LIMIT 1 FOR UPDATE SKIP LOCKED;
   -- Skip locked rows (job queue pattern) — avoids waiting.

4. Avoid user interaction within transactions.

5. Use advisory locks for application-level locking:
   SELECT pg_advisory_lock(12345); -- named, explicit lock

6. Monitor:
   SELECT * FROM pg_locks WHERE NOT granted;
   SELECT * FROM pg_stat_activity WHERE wait_event_type = 'Lock';` }
];

export default questions;
