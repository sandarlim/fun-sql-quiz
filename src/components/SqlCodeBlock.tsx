import React from "react";

const SQL_KEYWORDS = [
  "SELECT", "FROM", "WHERE", "GROUP BY", "HAVING", "ORDER BY", "JOIN",
  "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "ON", "AS",
  "AND", "OR", "NOT", "IN", "EXISTS", "BETWEEN", "LIKE", "IS", "NULL",
  "UNION", "UNION ALL", "DISTINCT", "INSERT", "UPDATE", "DELETE", "CREATE",
  "ALTER", "DROP", "SET", "INTO", "VALUES", "WITH", "OVER", "PARTITION BY",
  "ASC", "DESC", "LIMIT", "OFFSET", "CASE", "WHEN", "THEN", "ELSE", "END",
  "FOR", "ALL",
];

const SQL_FUNCTIONS = [
  "COUNT", "SUM", "AVG", "MIN", "MAX", "COALESCE", "NULLIF",
  "ROW_NUMBER", "RANK", "DENSE_RANK", "LAG", "LEAD",
];

function highlightSQL(sql: string): React.ReactNode[] {
  const lines = sql.split("\n");
  return lines.map((line, lineIdx) => {
    // Handle comments
    if (line.trim().startsWith("--")) {
      return (
        <div key={lineIdx}>
          <span className="sql-comment">{line}</span>
        </div>
      );
    }

    const tokens: React.ReactNode[] = [];
    // Split while keeping separators
    const parts = line.split(/(\s+|[(),;=<>!]+|'[^']*')/g);

    parts.forEach((part, i) => {
      if (!part) return;

      // String literals
      if (part.startsWith("'") && part.endsWith("'")) {
        tokens.push(<span key={i} className="sql-string">{part}</span>);
        return;
      }

      // Numbers
      if (/^\d+(\.\d+)?$/.test(part.trim())) {
        tokens.push(<span key={i} className="sql-number">{part}</span>);
        return;
      }

      // Operators
      if (/^[=<>!]+$/.test(part.trim())) {
        tokens.push(<span key={i} className="sql-operator">{part}</span>);
        return;
      }

      const upper = part.trim().toUpperCase();

      // Functions
      if (SQL_FUNCTIONS.includes(upper)) {
        tokens.push(<span key={i} className="sql-function">{part}</span>);
        return;
      }

      // Keywords (check multi-word first via simple match)
      if (SQL_KEYWORDS.includes(upper)) {
        tokens.push(<span key={i} className="sql-keyword">{part}</span>);
        return;
      }

      tokens.push(<span key={i}>{part}</span>);
    });

    return <div key={lineIdx}>{tokens}</div>;
  });
}

interface SqlCodeBlockProps {
  sql: string;
  label: string;
}

const SqlCodeBlock: React.FC<SqlCodeBlockProps> = ({ sql, label }) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
        {label}
      </span>
      <div className="code-panel min-h-[120px]">
        <pre className="whitespace-pre-wrap">
          <code>{highlightSQL(sql)}</code>
        </pre>
      </div>
    </div>
  );
};

export default SqlCodeBlock;
