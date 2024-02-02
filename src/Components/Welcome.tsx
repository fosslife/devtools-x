import { Group, Stack, Text, Title } from "@mantine/core";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AppContext } from "../Contexts/AppContextProvider";
import { data } from "../Layout/Navbar";
import { pinnedCard } from "./styles";

const Welcome = () => {
  const { classes } = {
    classes: {},
  };
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
      <Text tt="uppercase" variant="gradient">
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
                className={pinnedCard}
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
