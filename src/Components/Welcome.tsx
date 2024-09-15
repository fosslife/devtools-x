import {
  Group,
  rem,
  Stack,
  Switch,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppContext } from "@/Contexts/AppContextProvider";
import { data } from "@/Layout/Navbar";
import classes from "./styles.module.css";
import { IconSettings } from "@tabler/icons-react";

type WelcomeProps = {
  openSettings: (t: boolean) => void;
};

const Welcome = ({ openSettings }: WelcomeProps) => {
  const nav = useNavigate();
  const { pinned } = useAppContext();
  const [showAll, setShowAll] = useState(false);

  return (
    <Stack className={classes.root}>
      <img
        alt="logo"
        src={"/main-logo.png"}
        style={{
          width: 40,
        }}
      />
      <Text
        component={Title}
        style={{
          color: "#0e72f6",
          marginTop: "-10px",
        }}
      >
        Devtools-X
      </Text>

      <Group>
        <Switch
          label={showAll ? "Showing all" : "Showing pinned"}
          checked={showAll}
          onChange={(e) => setShowAll(e.currentTarget.checked)}
        />
        <ThemeIcon
          size={"lg"}
          onClick={() => {
            openSettings(true);
          }}
        >
          <IconSettings
            style={{
              width: rem(24),
              height: rem(24),
            }}
          />
        </ThemeIcon>
        Settings
      </Group>

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
        <Group grow wrap="wrap">
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
                  <Text fz="28px">{elem?.icon}</Text>
                  <Text size={"sm"} ta="center">
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
