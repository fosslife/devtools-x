import { Box, Button, CopyButton, Stack } from "@mantine/core";
import sqlFormatter from "@sqltools/formatter";
import { clipboard } from "@tauri-apps/api";
import { useEffect, useState } from "react";
import { FaCopy } from "react-icons/fa";

import { Monaco } from "../../Components/MonacoWrapper";

const firstQuery = `
SELECT country.country_name_eng, SUM(CASE WHEN call.id IS NOT NULL THEN 1 ELSE 0 END) AS calls, 
AVG(ISNULL(DATEDIFF(SECOND, call.start_time, call.end_time),0)) AS avg_difference
FROM country LEFT JOIN city ON city.country_id = country.id LEFT JOIN customer ON city.id = customer.city_id
LEFT JOIN call ON call.customer_id = customer.id GROUP BY  country.id, country.country_name_eng
HAVING AVG(ISNULL(DATEDIFF(SECOND, call.start_time, call.end_time),0)) > (SELECT AVG(DATEDIFF(SECOND, call.start_time, call.end_time)) FROM call)
ORDER BY calls DESC, country.id ASC; 
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
    <Stack style={{ height: "100%", width: "100%" }}>
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
            sx={() => ({
              position: "absolute",
              top: 10,
              right: 20,
            })}
          >
            <CopyButton value={formatted}>
              {({ copied, copy }) => (
                <Button
                  leftIcon={<FaCopy />}
                  size="xs"
                  fullWidth={true}
                  color={copied ? "teal" : "blue"}
                  onClick={() => {
                    copy(); //  copy doesn't work but need this function for animation.
                    clipboard.writeText(formatted);
                  }}
                >
                  {copied ? "Copied" : `Copy`}
                </Button>
              )}
            </CopyButton>
          </Box>
        )}
      </Box>
    </Stack>
  );
};

export default Sql;
