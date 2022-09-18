import { createStyles, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AppContext } from "../Contexts/AppContextProvider";
import { data } from "../Layout/Navbar";
import { db } from "../utils";

const useStyles = createStyles((theme) => ({
  pinnedCard: {
    padding: 15,
    cursor: "pointer",
    borderRadius: 5,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.dark[1],
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.dark[8],
    ":hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[1]
          : theme.colors.dark[2],
    },
  },
}));

const Welcome = () => {
  const { classes } = useStyles();
  const nav = useNavigate();
  const { pinned } = useContext(AppContext);

  // for the first time read from db.data.
  let actualRows = pinned.length > 0 ? pinned : db.data.pinned;

  return (
    <Stack
      align={"center"}
      justify="start"
      style={{ height: "100%", width: "100%" }}
      mt="xl"
    >
      <Text transform="uppercase" variant="gradient">
        <Title>DEVTOOLS-X</Title>
      </Text>

      {actualRows.length === 0 && (
        <Title order={4} mt="10">
          No pinned cards
        </Title>
      )}
      <br />
      <SimpleGrid mt="4" spacing={"xl"} cols={5}>
        {actualRows.map((pin: number) => {
          return (
            <Stack
              spacing={"xs"}
              align="center"
              justify={"center"}
              className={classes.pinnedCard}
              key={pin}
              onClick={() => {
                const clickedCard = data.find((e) => e.id === pin);
                nav(clickedCard?.to || "/"); // TS FIX NOTHING ELSE
              }}
            >
              {data.find((e) => e.id === pin)?.icon}
              <Text size={"sm"}>
                {data.find((e) => e.id === pin)?.text.toUpperCase()}
              </Text>
            </Stack>
          );
        })}
      </SimpleGrid>
    </Stack>
  );
};

export default Welcome;
