import { Question } from '../../types';

const questions: Question[] = [
{ id:"dbc1", level:"beginner", q:`Write a SQL query to find the second highest salary from an Employees table.
Table: Employees(id, name, salary)`, a:`-- Method 1: Using LIMIT/OFFSET (PostgreSQL, MySQL)
SELECT DISTINCT salary
FROM Employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1;

-- Method 2: Using subquery (portable)
SELECT MAX(salary) AS second_highest
FROM Employees
WHERE salary < (SELECT MAX(salary) FROM Employees);

-- Method 3: Return NULL if no second highest exists
SELECT (
  SELECT DISTINCT salary
  FROM Employees
  ORDER BY salary DESC
  LIMIT 1 OFFSET 1
) AS SecondHighestSalary;

-- Method 4: Using DENSE_RANK (handles ties correctly)
SELECT salary
FROM (
  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
  FROM Employees
) ranked
WHERE rnk = 2
LIMIT 1;` },
  { id:"dbc2", level:"beginner", q:`Find the Nth highest salary from the Employees table.
Write a query or function that accepts N as a parameter.`, a:`-- PostgreSQL parameterized approach:
-- For N = 3 (third highest)
SELECT DISTINCT salary
FROM Employees
ORDER BY salary DESC
LIMIT 1 OFFSET (3 - 1);  -- OFFSET = N - 1

-- Reusable with DENSE_RANK (handles ties):
SELECT salary
FROM (
  SELECT salary,
         DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
  FROM Employees
) ranked
WHERE rnk = 3;  -- Replace 3 with N

-- SQL Server function:
CREATE FUNCTION GetNthHighest(@N INT)
RETURNS TABLE AS
RETURN (
  SELECT salary FROM (
    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
    FROM Employees
  ) t WHERE rnk = @N
);

-- DENSE_RANK vs RANK for ties:
-- Salaries: 100, 100, 90, 80
-- RANK: 1, 1, 3, 4   (skips 2)
-- DENSE_RANK: 1, 1, 2, 3  (no skip — better for "Nth highest")` },
  { id:"dbc3", level:"beginner", q:`Find all employees who earn more than their manager.
Table: Employee(id, name, salary, managerId)`, a:`-- Self JOIN approach
SELECT e.name AS Employee
FROM Employee e
JOIN Employee m ON e.managerId = m.id
WHERE e.salary > m.salary;

-- Alternative with subquery:
SELECT name
FROM Employee e
WHERE salary > (
  SELECT salary FROM Employee WHERE id = e.managerId
);

-- Sample data:
-- id:1 Joe  salary:70000 managerId:3
-- id:2 Henry salary:80000 managerId:4
-- id:3 Sam  salary:60000 managerId:NULL
-- id:4 Max  salary:90000 managerId:NULL
-- Result: Joe (70000 > 60000 = Sam's salary)` },
  { id:"dbc4", level:"intermediate", q:`Find duplicate emails in a Person table. Return only the duplicated emails.
Table: Person(id, email)`, a:`-- Method 1: GROUP BY + HAVING
SELECT email
FROM Person
GROUP BY email
HAVING COUNT(*) > 1;

-- Method 2: Window function
SELECT DISTINCT email
FROM (
  SELECT email, COUNT(*) OVER (PARTITION BY email) AS cnt
  FROM Person
) t
WHERE cnt > 1;

-- Method 3: Self join
SELECT DISTINCT p1.email
FROM Person p1
JOIN Person p2 ON p1.email = p2.email AND p1.id != p2.id;

-- Find ALL rows that are duplicates (not just the email):
SELECT * FROM Person
WHERE email IN (
  SELECT email FROM Person GROUP BY email HAVING COUNT(*) > 1
);` },
  { id:"dbc5", level:"intermediate", q:`Delete duplicate rows from the Person table, keeping only the row with the smallest id for each email.
Table: Person(id, email)`, a:`-- PostgreSQL / MySQL 8+:
DELETE FROM Person
WHERE id NOT IN (
  SELECT MIN(id) FROM Person GROUP BY email
);

-- Alternative using CTE (PostgreSQL):
WITH duplicates AS (
  SELECT id,
         ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) AS rn
  FROM Person
)
DELETE FROM Person
WHERE id IN (SELECT id FROM duplicates WHERE rn > 1);

-- SQL Server:
WITH CTE AS (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) AS rn
  FROM Person
)
DELETE FROM CTE WHERE rn > 1;

-- Always run SELECT first to verify what will be deleted!
-- Replace DELETE with SELECT * to preview.` },
  { id:"dbc6", level:"intermediate", q:`Write a query to get the highest salary in each department.
Tables: Employee(id, name, salary, departmentId), Department(id, name)`, a:`-- Method 1: JOIN + GROUP BY
SELECT d.name AS Department, MAX(e.salary) AS MaxSalary
FROM Employee e
JOIN Department d ON e.departmentId = d.id
GROUP BY d.name;

-- Method 2: Show the employee name too (with ties handling)
SELECT d.name AS Department, e.name AS Employee, e.salary
FROM Employee e
JOIN Department d ON e.departmentId = d.id
WHERE (e.departmentId, e.salary) IN (
  SELECT departmentId, MAX(salary)
  FROM Employee
  GROUP BY departmentId
);

-- Method 3: Using window function (cleanest)
SELECT Department, Employee, Salary
FROM (
  SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary,
         RANK() OVER (PARTITION BY e.departmentId ORDER BY e.salary DESC) AS rnk
  FROM Employee e JOIN Department d ON e.departmentId = d.id
) ranked
WHERE rnk = 1;` },
  { id:"dbc7", level:"intermediate", q:`Find the top 3 highest-paid employees in each department.
Tables: Employee(id, name, salary, departmentId), Department(id, name)`, a:`-- Using DENSE_RANK window function
SELECT Department, Employee, Salary
FROM (
  SELECT
    d.name AS Department,
    e.name AS Employee,
    e.salary AS Salary,
    DENSE_RANK() OVER (
      PARTITION BY e.departmentId
      ORDER BY e.salary DESC
    ) AS salary_rank
  FROM Employee e
  JOIN Department d ON e.departmentId = d.id
) ranked
WHERE salary_rank <= 3
ORDER BY Department, salary_rank;

-- Why DENSE_RANK over RANK?
-- If two people tie for 2nd, RANK gives them 2 and skips 3 → only 2 people shown.
-- DENSE_RANK gives them both 2, then 3rd gets 3 → correct top 3.

-- Why not ROW_NUMBER?
-- ROW_NUMBER doesn't handle ties — arbitrarily picks one winner.
-- DENSE_RANK is the correct choice for "top N" salary problems.` },
  { id:"dbc8", level:"intermediate", q:`Write a query to find consecutive numbers — numbers that appear at least 3 times consecutively.
Table: Logs(id, num) where id is consecutive (1,2,3...)`, a:`-- Using LAG/LEAD window functions (most readable)
SELECT DISTINCT num AS ConsecutiveNums
FROM (
  SELECT num,
         LAG(num)  OVER (ORDER BY id) AS prev_num,
         LEAD(num) OVER (ORDER BY id) AS next_num
  FROM Logs
) t
WHERE num = prev_num AND num = next_num;

-- Self-join approach (classic):
SELECT DISTINCT l1.num AS ConsecutiveNums
FROM Logs l1
JOIN Logs l2 ON l1.id = l2.id - 1 AND l1.num = l2.num
JOIN Logs l3 ON l1.id = l3.id - 2 AND l1.num = l3.num;

-- Example data:
-- id:1 num:1, id:2 num:1, id:3 num:1, id:4 num:2, id:5 num:1, id:6 num:2, id:7 num:2
-- Result: 1 (appears consecutively at ids 1,2,3)` },
  { id:"dbc9", level:"intermediate", q:`Write a SQL query to find customers who have never ordered anything.
Tables: Customers(id, name), Orders(id, customerId)`, a:`-- Method 1: LEFT JOIN + IS NULL (most common, most efficient)
SELECT c.name AS Customers
FROM Customers c
LEFT JOIN Orders o ON c.id = o.customerId
WHERE o.id IS NULL;

-- Method 2: NOT EXISTS (often fastest, stops at first match)
SELECT name
FROM Customers c
WHERE NOT EXISTS (
  SELECT 1 FROM Orders o WHERE o.customerId = c.id
);

-- Method 3: NOT IN (watch out — fails if Orders has NULL customerId values!)
SELECT name
FROM Customers
WHERE id NOT IN (
  SELECT DISTINCT customerId FROM Orders WHERE customerId IS NOT NULL
);

-- Performance note:
-- LEFT JOIN + IS NULL and NOT EXISTS are typically equivalent.
-- NOT IN can be dangerous with NULLs — use with caution.
-- For large tables, ensure customerId has an index.` },
  { id:"dbc10", level:"intermediate", q:`Calculate the running total (cumulative sum) of sales per day.
Table: Sales(sale_date, amount)`, a:`-- Running total using SUM() window function
SELECT
  sale_date,
  amount,
  SUM(amount) OVER (ORDER BY sale_date) AS running_total
FROM Sales
ORDER BY sale_date;

-- Running total RESET per month:
SELECT
  sale_date,
  amount,
  SUM(amount) OVER (
    PARTITION BY DATE_TRUNC('month', sale_date)
    ORDER BY sale_date
  ) AS monthly_running_total
FROM Sales;

-- With both daily and running total:
SELECT
  sale_date,
  amount,
  SUM(amount) OVER (ORDER BY sale_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative,
  AVG(amount) OVER (ORDER BY sale_date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS moving_avg_7day
FROM Sales;

-- ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW = default for running total
-- ROWS BETWEEN 6 PRECEDING AND CURRENT ROW = 7-day moving average` },
  { id:"dbc11", level:"advanced", q:`Write a query to find employees whose salary is above the average salary of their respective department.
Tables: Employee(id, name, salary, departmentId)`, a:`-- Method 1: Correlated subquery
SELECT e.name, e.salary, e.departmentId
FROM Employee e
WHERE e.salary > (
  SELECT AVG(salary)
  FROM Employee
  WHERE departmentId = e.departmentId
);

-- Method 2: JOIN with aggregation (usually more efficient)
SELECT e.name, e.salary, e.departmentId
FROM Employee e
JOIN (
  SELECT departmentId, AVG(salary) AS avg_sal
  FROM Employee
  GROUP BY departmentId
) dept_avg ON e.departmentId = dept_avg.departmentId
WHERE e.salary > dept_avg.avg_sal;

-- Method 3: Window function (cleanest)
SELECT name, salary, departmentId
FROM (
  SELECT name, salary, departmentId,
         AVG(salary) OVER (PARTITION BY departmentId) AS dept_avg
  FROM Employee
) t
WHERE salary > dept_avg;` },
  { id:"dbc12", level:"advanced", q:`Write a query to pivot data: show each department's total salary by year as columns.
Table: Salaries(employee_id, department, year, salary)
Output: department | 2022 | 2023 | 2024`, a:`-- PostgreSQL using conditional aggregation (most portable):
SELECT
  department,
  SUM(CASE WHEN year = 2022 THEN salary ELSE 0 END) AS "2022",
  SUM(CASE WHEN year = 2023 THEN salary ELSE 0 END) AS "2023",
  SUM(CASE WHEN year = 2024 THEN salary ELSE 0 END) AS "2024"
FROM Salaries
GROUP BY department
ORDER BY department;

-- Using FILTER (PostgreSQL syntax — cleaner):
SELECT
  department,
  SUM(salary) FILTER (WHERE year = 2022) AS "2022",
  SUM(salary) FILTER (WHERE year = 2023) AS "2023",
  SUM(salary) FILTER (WHERE year = 2024) AS "2024"
FROM Salaries
GROUP BY department;

-- SQL Server native PIVOT:
SELECT department, [2022], [2023], [2024]
FROM Salaries
PIVOT (SUM(salary) FOR year IN ([2022],[2023],[2024])) AS pvt;

-- Note: For dynamic years, you need dynamic SQL.` },
  { id:"dbc13", level:"advanced", q:`Find gaps in a sequence of IDs.
Table: Orders(id) — find missing IDs in the sequence from min to max.`, a:`-- Method 1: Generate series + LEFT JOIN (PostgreSQL)
SELECT gs.id AS missing_id
FROM generate_series(
  (SELECT MIN(id) FROM Orders),
  (SELECT MAX(id) FROM Orders)
) AS gs(id)
LEFT JOIN Orders o ON gs.id = o.id
WHERE o.id IS NULL;

-- Method 2: Using LAG to find gaps
SELECT id + 1 AS gap_start,
       next_id - 1 AS gap_end
FROM (
  SELECT id, LEAD(id) OVER (ORDER BY id) AS next_id
  FROM Orders
) t
WHERE next_id - id > 1;

-- Method 3: Self-join (older approach)
SELECT o1.id + 1 AS gap_start
FROM Orders o1
WHERE NOT EXISTS (
  SELECT 1 FROM Orders o2 WHERE o2.id = o1.id + 1
)
AND o1.id < (SELECT MAX(id) FROM Orders);

-- Output example for ids [1,2,4,7,8]:
-- Gap: 3 (between 2 and 4), 5-6 (between 4 and 7)` },
  { id:"dbc14", level:"advanced", q:`Write a query to calculate the median salary from the Employee table.`, a:`-- PostgreSQL has percentile_cont function (cleanest):
SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary) AS median_salary
FROM Employee;

-- Manual approach (works in most databases):
SELECT AVG(salary) AS median_salary
FROM (
  SELECT salary,
         ROW_NUMBER() OVER (ORDER BY salary) AS rn,
         COUNT(*) OVER () AS total_count
  FROM Employee
) t
WHERE rn IN (
  FLOOR((total_count + 1) / 2.0),
  CEIL((total_count + 1) / 2.0)
);

-- Explanation:
-- For odd count (5): median is row 3
-- For even count (6): median is average of rows 3 and 4
-- FLOOR((6+1)/2) = 3, CEIL((6+1)/2) = 4 → AVG of those two rows

-- SQL Server: Use PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary) OVER ()` },
  { id:"dbc15", level:"advanced", q:`Write a query to find the most recent order for each customer.
Tables: Customers(id, name), Orders(id, customer_id, order_date, amount)`, a:`-- Method 1: ROW_NUMBER (most flexible — can get top N)
SELECT customer_id, order_date, amount, id AS order_id
FROM (
  SELECT *,
         ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS rn
  FROM Orders
) ranked
WHERE rn = 1;

-- Method 2: JOIN with subquery aggregation (classic)
SELECT o.*
FROM Orders o
JOIN (
  SELECT customer_id, MAX(order_date) AS latest
  FROM Orders GROUP BY customer_id
) latest ON o.customer_id = latest.customer_id AND o.order_date = latest.latest;
-- Warning: Ties (same date) return multiple rows — ROW_NUMBER avoids this.

-- Method 3: DISTINCT ON (PostgreSQL-specific, elegant)
SELECT DISTINCT ON (customer_id)
  customer_id, order_date, amount
FROM Orders
ORDER BY customer_id, order_date DESC;
-- PostgreSQL keeps the FIRST row per partition after ordering.

-- Join with customer name:
SELECT c.name, o.order_date, o.amount
FROM Customers c
JOIN (
  SELECT DISTINCT ON (customer_id) * FROM Orders ORDER BY customer_id, order_date DESC
) o ON c.id = o.customer_id;` },
  { id:"dbc16", level:"advanced", q:`Write a query to find students who scored above average in every subject they enrolled in.
Tables: Students(id, name), Enrollments(student_id, subject, score)`, a:`-- Find avg score per subject, then find students who beat it in ALL their subjects

-- Using NOT EXISTS (elegant — "no subject where score <= avg"):
SELECT DISTINCT s.name
FROM Students s
JOIN Enrollments e ON s.id = e.student_id
WHERE NOT EXISTS (
  SELECT 1
  FROM Enrollments e2
  WHERE e2.student_id = s.id
    AND e2.score <= (
      SELECT AVG(score) FROM Enrollments WHERE subject = e2.subject
    )
);

-- Using HAVING COUNT comparison:
SELECT s.name
FROM Students s
JOIN Enrollments e ON s.id = e.student_id
JOIN (
  SELECT subject, AVG(score) AS avg_score FROM Enrollments GROUP BY subject
) subj_avg ON e.subject = subj_avg.subject
GROUP BY s.id, s.name
HAVING COUNT(*) = SUM(CASE WHEN e.score > subj_avg.avg_score THEN 1 ELSE 0 END);
-- Count all subjects = count where above average → true for all subjects` },
  { id:"dbc17", level:"advanced", q:`Calculate the 7-day moving average of daily sales.
Table: DailySales(sale_date DATE, revenue DECIMAL)`, a:`-- Using window function with ROWS frame:
SELECT
  sale_date,
  revenue,
  AVG(revenue) OVER (
    ORDER BY sale_date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS moving_avg_7day,
  COUNT(*) OVER (
    ORDER BY sale_date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS days_included  -- shows how many days in window (< 7 at start)
FROM DailySales
ORDER BY sale_date;

-- Handle missing dates (fill gaps first with generate_series):
WITH all_dates AS (
  SELECT gs::date AS sale_date
  FROM generate_series('2024-01-01'::date, '2024-12-31'::date, '1 day') gs
),
filled AS (
  SELECT a.sale_date, COALESCE(d.revenue, 0) AS revenue
  FROM all_dates a LEFT JOIN DailySales d ON a.sale_date = d.sale_date
)
SELECT sale_date, revenue,
       AVG(revenue) OVER (ORDER BY sale_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS moving_avg
FROM filled;` },
  { id:"dbc18", level:"expert", q:`Write a recursive CTE to display an organizational hierarchy (manager → employees tree).
Table: Employee(id, name, manager_id) — manager_id is NULL for CEO.`, a:`WITH RECURSIVE OrgChart AS (
  -- Anchor: Start with the CEO (no manager)
  SELECT
    id,
    name,
    manager_id,
    0 AS level,
    name::TEXT AS path,
    ARRAY[id] AS id_path
  FROM Employee
  WHERE manager_id IS NULL

  UNION ALL

  -- Recursive: Join each employee with their manager
  SELECT
    e.id,
    e.name,
    e.manager_id,
    o.level + 1,
    (o.path || ' > ' || e.name)::TEXT,
    o.id_path || e.id
  FROM Employee e
  JOIN OrgChart o ON e.manager_id = o.id
  WHERE NOT (e.id = ANY(o.id_path))  -- prevent infinite loops on cyclic data
)
SELECT
  REPEAT('  ', level) || name AS hierarchy,
  level,
  path
FROM OrgChart
ORDER BY id_path;

-- Output example:
-- CEO (level 0)
--   VP Engineering (level 1)
--     Senior Dev (level 2)
--       Junior Dev (level 3)
--   VP Sales (level 1)

-- MAX depth guard: Add MAXRECURSION 100 (SQL Server) or check cycle manually.` },
  { id:"dbc19", level:"expert", q:`Write a query to find users who logged in for 3 or more consecutive days.
Table: UserLogins(user_id, login_date) — one row per login, no duplicates per day.`, a:`-- Step 1: Assign row numbers per user ordered by date
-- Step 2: Subtract row number from date — creates same "group date" for consecutive days

WITH consecutive AS (
  SELECT
    user_id,
    login_date,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) AS rn,
    login_date - (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date))::INT AS grp
    -- If consecutive: login_date - rn is constant for each consecutive streak
  FROM UserLogins
),
streaks AS (
  SELECT
    user_id,
    grp,
    MIN(login_date) AS streak_start,
    MAX(login_date) AS streak_end,
    COUNT(*) AS streak_length
  FROM consecutive
  GROUP BY user_id, grp
)
SELECT DISTINCT user_id, streak_start, streak_end, streak_length
FROM streaks
WHERE streak_length >= 3
ORDER BY user_id, streak_start;

-- Key insight: For consecutive dates, (date - row_number) is constant.
-- [Jan 1, Jan 2, Jan 3] with rn [1,2,3] → grp [Dec 31, Dec 31, Dec 31] — all same!
-- Gap breaks the pattern.` },
  { id:"dbc20", level:"expert", q:`Design and write a query for a leaderboard: rank users by total score, show their rank, percentile, and how far they are from the next rank.
Table: UserScores(user_id, username, score)`, a:`SELECT
  user_id,
  username,
  score,
  RANK()          OVER (ORDER BY score DESC) AS rank,
  DENSE_RANK()    OVER (ORDER BY score DESC) AS dense_rank,
  ROW_NUMBER()    OVER (ORDER BY score DESC) AS position,

  -- Percentile: what % of users score <= this user
  ROUND(
    PERCENT_RANK() OVER (ORDER BY score) * 100, 1
  ) AS percentile,

  -- Gap to next rank above (how many points needed to overtake)
  COALESCE(
    LAG(score) OVER (ORDER BY score DESC) - score,
    0
  ) AS points_to_next_rank,

  -- Gap to leader
  FIRST_VALUE(score) OVER (ORDER BY score DESC) - score AS points_behind_leader,

  -- Total users
  COUNT(*) OVER () AS total_users

FROM UserScores
ORDER BY score DESC;

-- RANK: 1,1,3 (skips on ties)
-- DENSE_RANK: 1,1,2 (no skips)
-- ROW_NUMBER: 1,2,3 (always unique — arbitrary tie-breaking)
-- PERCENT_RANK: 0 = lowest, 1 = highest. (rank-1)/(count-1)
-- Use DENSE_RANK for leaderboards to avoid confusion with gaps.` }
];

export default questions;
