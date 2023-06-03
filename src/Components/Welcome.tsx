import { createStyles, Group, Stack, Text, Title } from "@mantine/core";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AppContext } from "../Contexts/AppContextProvider";
import { data } from "../Layout/Navbar";

const useStyles = createStyles((theme) => ({
  pinnedCard: {
    padding: 15,
    cursor: "pointer",
    borderRadius: 5,
    alignSelf: "stretch",
    flex: "1 1 0",
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

  return (
    <Stack
      align={"center"}
      justify="start"
      style={{ height: "100%", width: "100%" }}
      mt="xl"
      px={20}
    >
      <Text transform="uppercase" variant="gradient">
        <Title>DEVTOOLS-X</Title>
      </Text>

      {pinned.length === 0 && (
        <Title order={4} mt="10">
          No pinned cards
        </Title>
      )}
      <br />
      <Group>
        {[...pinned]
          .sort((a, b) => (a > b ? 1 : a < b ? -1 : 0))
          .map((pin: number) => {
            const elem = data.find((e) => e.id === pin);
            return (
              <Stack
                spacing={"xs"}
                align="center"
                justify={"center"}
                className={classes.pinnedCard}
                key={pin}
                onClick={() => {
                  nav(elem?.to || "/"); // TS FIX NOTHING ELSE
                }}
              >
                {elem?.icon}
                <Text size={"sm"} align="center" weight={500}>
                  {elem?.text.toUpperCase()}
                </Text>
              </Stack>
            );
          })}
      </Group>
    </Stack>
  );
};

export default Welcome;
