import { Group, Stack, Switch, Text, Title } from "@mantine/core";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AppContext } from "../Contexts/AppContextProvider";
import { data } from "../Layout/Navbar";
import classes from "./styles.module.css";

const Welcome = () => {
  const nav = useNavigate();
  const { pinned } = useContext(AppContext);
  const [showAll, setShowAll] = useState(false);

  return (
    <Stack className={classes.root}>
      <Text tt="uppercase" variant="gradient" component={Title}>
        DEVTOOLS-X
      </Text>
      <Switch
        label={showAll ? "Showing all" : "Showing pinned"}
        checked={showAll}
        onChange={(e) => setShowAll(e.currentTarget.checked)}
      />

      {pinned.length === 0 && (
        <Title order={4} mt="10">
          No pinned cards
        </Title>
      )}
      <br />
      {showAll ? (
        <Group>
          {data.map((elem) => (
            <Stack
              gap={"xs"}
              align="center"
              justify={"center"}
              className={classes.pinnedCard}
              key={elem.id}
              onClick={() => {
                nav(elem.to || "/"); // TS FIX NOTHING ELSE
              }}
            >
              {elem.icon}
              <Text size={"sm"} ta="center" tt="uppercase" fw={400}>
                {elem.text}
              </Text>
            </Stack>
          ))}
        </Group>
      ) : (
        <Group>
          {[...pinned]
            .sort((a, b) => (a > b ? 1 : a < b ? -1 : 0))
            .map((pin) => {
              const elem = data.find((e) => e.id === pin);
              return (
                <Stack
                  gap={"xs"}
                  align="center"
                  justify={"center"}
                  className={classes.pinnedCard}
                  key={pin}
                  onClick={() => {
                    nav(elem?.to || "/"); // TS FIX NOTHING ELSE
                  }}
                >
                  {elem?.icon}
                  <Text size={"sm"} ta="center" fw={500}>
                    {elem?.text.toUpperCase()}
                  </Text>
                </Stack>
              );
            })}
        </Group>
      )}
    </Stack>
  );
};

export default Welcome;
