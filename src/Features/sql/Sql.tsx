import { Box, Group, Select, Stack, Text } from "@mantine/core";
import sqlFormatter from "@sqltools/formatter";
import { useEffect, useState } from "react";

import { Copy } from "@/Components/Copy";
import { Monaco } from "@/Components/MonacoWrapper";

const firstQuery = `
WITH SubQuery1 AS (    SELECT         EmployeeID,         DepartmentID,        COUNT(*) OVER(PARTITION BY DepartmentID) AS DepartmentSize,
ROW_NUMBER() OVER(PARTITION BY DepartmentID ORDER BY Salary DESC) AS SalaryRank    FROM Employees),SubQuery2 AS (    SELECT         DepartmentID,        
  MAX(Salary) as MaxSalary    FROM Employees    GROUP BY DepartmentID    HAVING COUNT(EmployeeID) > 5)SELECT     e.EmployeeName,    e.JobTitle,   
   CASE         WHEN e.Salary > 100000 THEN 'High'        WHEN e.Salary BETWEEN 50000 AND 100000 THEN 'Medium'        ELSE 'Low'    END AS SalaryRange,    
   d.DepartmentName,    s1.DepartmentSize,    s1.SalaryRank,    s2.MaxSalaryFROM     Employees e    INNER JOIN SubQuery1 s1 ON e.EmployeeID = s1.EmployeeID    
   INNER JOIN SubQuery2 s2 ON e.DepartmentID = s2.DepartmentID    LEFT JOIN Departments d ON e.DepartmentID = d.DepartmentIDWHERE    
    e.HireDate BETWEEN '2020-01-01' AND '2020-12-31'    AND e.JobTitle LIKE '%Manager%'    AND EXISTS (        SELECT 1         
      FROM EmployeeProjects ep         WHERE ep.EmployeeID = e.EmployeeID             AND ep.ProjectID = 'P123'    )ORDER BY   
        e.DepartmentID,     e.Salary DESCLIMIT 50;
`;

type Query = {
  preFormatted: string;
  formatted: string;
};
const Sql = () => {
  const [indent, setIndent] = useState<string>("\t");
  const [history, setHistory] = useState<Query[]>([]);
  const [preFormatted, setPreFormatted] = useState(firstQuery);
  const [formatted, setFormatted] = useState("");
  const [showCopy, setShowCopy] = useState(false);

  useEffect(() => {
    setFormatted(
      sqlFormatter.format(firstQuery, {
        language: "sql",
        indent,
        reservedWordCase: "upper",
      })
    );
  }, [indent]);

  return (
    <Stack
      style={{
        height: "100%",
      }}
    >
      <Group>
        <Select
          label="Indentation"
          value={indent}
          onChange={(e) => setIndent(e as string)}
          data={[
            { value: "\t", label: "Tab" },
            { value: "  ", label: "2 spaces" },
            { value: "    ", label: "4 spaces" },
          ]}
        />
        {history?.length > 0 ? (
          <Select
            label="History"
            value={null}
            placeholder="Click to select"
            onChange={(e) => {
              const query = history.find((q) => q.preFormatted === e);
              if (query) {
                setPreFormatted(query.preFormatted);
                setFormatted(query.formatted);
              }
            }}
            data={history.map((q) => ({
              value: q.preFormatted,
              label: q.preFormatted.slice(0, 20),
            }))}
          />
        ) : (
          <Text c="dimmed" size="sm" mt={28}>
            When you copy a formatted query, it will be saved here.
          </Text>
        )}
      </Group>
      <Box style={{ height: "40%" }}>
        <Monaco
          language="sql"
          value={preFormatted}
          setValue={(e) => {
            setPreFormatted(e as string);
            setFormatted(
              sqlFormatter.format(e || "", {
                language: "sql",
                indent: indent,
                reservedWordCase: "upper",
              })
            );
          }}
        />
      </Box>
      <Box
        style={{ height: "50%", position: "relative" }}
        onMouseEnter={() => setShowCopy(true)}
        onMouseLeave={() => setShowCopy(false)}
      >
        <Monaco
          language="sql"
          value={formatted}
          extraOptions={{ readOnly: true }}
        />
        {showCopy && (
          <Box
            style={{
              position: "absolute",
              top: 10,
              right: 20,
            }}
            onClick={() => {
              setHistory([
                ...history,
                {
                  preFormatted,
                  formatted,
                },
              ]);
            }}
          >
            <Copy value={formatted} label="Copy" />
          </Box>
        )}
      </Box>
    </Stack>
  );
};

export default Sql;
