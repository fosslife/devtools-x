import { Box, Stack } from "@mantine/core";
import sqlFormatter from "@sqltools/formatter";
import { useEffect, useState } from "react";

import { Copy } from "../../Components/Copy";
import { Monaco } from "../../Components/MonacoWrapper";

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

const Sql = () => {
  const [formatted, setFormatted] = useState("");
  const [showCopy, setShowCopy] = useState(false);

  useEffect(() => {
    setFormatted(
      sqlFormatter.format(firstQuery, {
        language: "sql",
        indent: "\t", // TODO: take this from user?
        reservedWordCase: "upper",
      })
    );
  }, []);

  return (
    <Stack
      style={{
        height: "100%",
      }}
    >
      <Box style={{ height: "50%" }}>
        <Monaco
          language="sql"
          value={firstQuery}
          setValue={(e) => {
            setFormatted(
              sqlFormatter.format(e || "", {
                language: "sql",
                indent: "\t", // TODO: take this from user?
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
          >
            <Copy value={formatted} label="Copy" />
          </Box>
        )}
      </Box>
    </Stack>
  );
};

export default Sql;

// TODO: Save previous query
