export interface SqlQuestion {
  id: number;
  title: string;
  queryA: string;
  queryB: string;
  answer: "same" | "different";
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
}

export const sqlQuestions: SqlQuestion[] = [
  {
    id: 1,
    title: "WHERE vs HAVING",
    queryA: `SELECT department, COUNT(employee_id) AS cnt
FROM employees
WHERE salary > 50000
GROUP BY department;`,
    queryB: `SELECT department, COUNT(employee_id) AS cnt
FROM employees
GROUP BY department
HAVING salary > 50000;`,
    answer: "different",
    explanation: "Query B will error in most databases. HAVING filters on aggregated results, but 'salary' is not aggregated — it's a row-level column. WHERE filters rows before grouping, HAVING filters groups after aggregation.",
    difficulty: "easy",
    topic: "Filtering",
  },
  {
    id: 2,
    title: "INNER JOIN order",
    queryA: `SELECT a.name, b.order_id
FROM customers a
INNER JOIN orders b
  ON a.customer_id = b.customer_id;`,
    queryB: `SELECT a.name, b.order_id
FROM orders b
INNER JOIN customers a
  ON a.customer_id = b.customer_id;`,
    answer: "same",
    explanation: "INNER JOIN is commutative — the order of tables does not affect the result set, only potentially the execution plan. Both produce the same rows.",
    difficulty: "easy",
    topic: "Joins",
  },
  {
    id: 3,
    title: "UNION vs UNION ALL",
    queryA: `SELECT name FROM employees
UNION
SELECT name FROM contractors;`,
    queryB: `SELECT name FROM employees
UNION ALL
SELECT name FROM contractors;`,
    answer: "different",
    explanation: "UNION removes duplicate rows from the combined result, while UNION ALL keeps all rows including duplicates. If there are any overlapping names, the results will differ.",
    difficulty: "easy",
    topic: "Set Operations",
  },
  {
    id: 4,
    title: "COUNT(*) vs COUNT(column)",
    queryA: `SELECT department,
       COUNT(*) AS total
FROM employees
GROUP BY department;`,
    queryB: `SELECT department,
       COUNT(manager_id) AS total
FROM employees
GROUP BY department;`,
    answer: "different",
    explanation: "COUNT(*) counts all rows including NULLs, while COUNT(manager_id) only counts rows where manager_id is NOT NULL. If any employee has a NULL manager_id, results will differ.",
    difficulty: "medium",
    topic: "Aggregation",
  },
  {
    id: 5,
    title: "LEFT JOIN with WHERE vs ON filter",
    queryA: `SELECT a.name, b.order_id
FROM customers a
LEFT JOIN orders b
  ON a.customer_id = b.customer_id
  AND b.status = 'active';`,
    queryB: `SELECT a.name, b.order_id
FROM customers a
LEFT JOIN orders b
  ON a.customer_id = b.customer_id
WHERE b.status = 'active';`,
    answer: "different",
    explanation: "In Query A, the filter on status is in the ON clause — customers without active orders still appear (with NULLs). In Query B, the WHERE clause filters after the join, eliminating customers with no active orders, effectively turning it into an INNER JOIN.",
    difficulty: "medium",
    topic: "Joins",
  },
  {
    id: 6,
    title: "NOT IN with NULLs",
    queryA: `SELECT name
FROM employees
WHERE department_id NOT IN (
  SELECT department_id
  FROM closed_departments
);`,
    queryB: `SELECT name
FROM employees
WHERE NOT EXISTS (
  SELECT 1
  FROM closed_departments
  WHERE closed_departments.department_id
      = employees.department_id
);`,
    answer: "different",
    explanation: "If closed_departments contains any NULL department_id, NOT IN returns no rows at all (because NULL comparisons yield UNKNOWN). NOT EXISTS handles NULLs correctly and returns the expected rows.",
    difficulty: "hard",
    topic: "Subqueries",
  },
  {
    id: 7,
    title: "DISTINCT on SELECT vs GROUP BY",
    queryA: `SELECT DISTINCT department, city
FROM employees;`,
    queryB: `SELECT department, city
FROM employees
GROUP BY department, city;`,
    answer: "same",
    explanation: "Both queries return unique combinations of department and city. DISTINCT and GROUP BY (without aggregation) produce the same result set, though the optimizer may handle them differently.",
    difficulty: "easy",
    topic: "Deduplication",
  },
  {
    id: 8,
    title: "COALESCE in ORDER BY",
    queryA: `SELECT name, bonus
FROM employees
ORDER BY bonus ASC;`,
    queryB: `SELECT name, bonus
FROM employees
ORDER BY COALESCE(bonus, 0) ASC;`,
    answer: "different",
    explanation: "NULL values sort differently than 0. In Query A, NULLs are placed first or last depending on the database. In Query B, NULLs are treated as 0, changing their position in the sort order.",
    difficulty: "medium",
    topic: "Sorting",
  },
  {
    id: 9,
    title: "Subquery vs JOIN for existence",
    queryA: `SELECT name
FROM employees e
WHERE EXISTS (
  SELECT 1 FROM departments d
  WHERE d.department_id = e.department_id
);`,
    queryB: `SELECT DISTINCT e.name
FROM employees e
INNER JOIN departments d
  ON e.department_id = d.department_id;`,
    answer: "same",
    explanation: "Both return employee names that have a matching department. EXISTS stops at the first match (no duplicates), while INNER JOIN may produce duplicates if departments has duplicate IDs — but DISTINCT removes them, making results equivalent.",
    difficulty: "medium",
    topic: "Subqueries",
  },
  {
    id: 10,
    title: "Window function vs GROUP BY",
    queryA: `SELECT department,
       AVG(salary) AS avg_salary
FROM employees
GROUP BY department;`,
    queryB: `SELECT DISTINCT department,
       AVG(salary) OVER (
         PARTITION BY department
       ) AS avg_salary
FROM employees;`,
    answer: "same",
    explanation: "Both compute the average salary per department. The GROUP BY version collapses rows; the window function version retains all rows but DISTINCT deduplicates them to the same result.",
    difficulty: "hard",
    topic: "Window Functions",
  },
  {
    id: 11,
    title: "BETWEEN inclusive boundaries",
    queryA: `SELECT name FROM employees
WHERE hire_date >= '2023-01-01'
  AND hire_date <= '2023-12-31';`,
    queryB: `SELECT name FROM employees
WHERE hire_date
  BETWEEN '2023-01-01' AND '2023-12-31';`,
    answer: "same",
    explanation: "BETWEEN is inclusive on both ends, which is exactly equivalent to using >= and <= with the same boundaries.",
    difficulty: "easy",
    topic: "Filtering",
  },
  {
    id: 12,
    title: "NULL equality",
    queryA: `SELECT name FROM employees
WHERE commission = NULL;`,
    queryB: `SELECT name FROM employees
WHERE commission IS NULL;`,
    answer: "different",
    explanation: "In SQL, nothing equals NULL — not even NULL itself. 'commission = NULL' always evaluates to UNKNOWN, returning zero rows. 'IS NULL' is the correct syntax and returns rows where commission is NULL.",
    difficulty: "medium",
    topic: "NULL Handling",
  },
];
