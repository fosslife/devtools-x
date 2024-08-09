import classes from "./styles.module.css";

import { Group, Stack, Text } from "@mantine/core";
import { Fragment, useMemo } from "react";
import CustomPicker from "./CustomPicker";
import { clipboard } from "@tauri-apps/api";
import {
  checkContrast,
  formatRatio,
  meetsMinimumRequirements,
} from "./contrast";

import { RenderShades } from "./RenderShades";
import { blindnessStats, simulateColorBlindness } from "./blindness";
import { useColorRandomizer } from "./hooks";

const Colors = () => {
  const [color, setColor] = useColorRandomizer();

  const copy = async (color: string) => {
    await clipboard.writeText(color.startsWith("#") ? color : `#${color}`);
  };

  const stats = useMemo(
    () =>
      blindnessStats.map((info) => ({
        data: simulateColorBlindness(color, info.name),
        info,
      })),
    [color]
  );

  return (
    <Stack
      align="center"
      style={{ height: "100%", width: "100%", overflowY: "scroll" }}
    >
      <CustomPicker
        hexCode={color.startsWith("#") ? color.slice(1) : color}
        onChange={(color) => setColor(color.hex)}
      />

      <Group
        gap={10}
        grow
        style={{ marginTop: 14, marginBottom: 14, width: "95%" }}
      >
        <Stack align="center" style={{ width: "100%" }}>
          <div className={classes.grid} style={{ width: "100%" }}>
            {stats.map(({ data, info }) => (
              <div key={info.name} style={{ width: "100%" }}>
                <Text
                  size="sm"
                  fw="lighter"
                  style={{ marginBottom: 10 }}
                  className={classes.simulation_heading}
                >
                  {info.name}

                  {/*    tag */}
                  <span
                    style={{
                      background: data.percentage >= 90 ? "green" : "red",
                      color: "white",
                      fontWeight: "bold",
                      padding: "0 5px",
                      borderRadius: "5px",
                      marginLeft: "auto",
                      fontSize: "0.8rem",
                    }}
                  >
                    {data.percentage.toFixed(2)}% Similar
                  </span>
                </Text>

                <RenderShades
                  colors={[color, data.simulation]}
                  setColor={copy}
                  label=""
                />
              </div>
            ))}
          </div>
        </Stack>

        <Group style={{ width: "100%", justifyContent: "center" }}>
          <ContrastContent color={color} background={"#ffffff"} />
          <ContrastContent color={color} background={"#000000"} />
        </Group>
      </Group>
    </Stack>
  );
};

export const ContrastContent = ({
  color,
  background = "#000000",
  toggle,
}: {
  toggle?: () => void;
  background: string;
  color: string;
}) => {
  const contrast = checkContrast(color, background);
  const result = meetsMinimumRequirements(contrast);

  return (
    <div className={classes.wcagBox}>
      <Text size={"xl"}>WCAG contrast</Text>
      <div style={{ display: "flex", width: "100%" }}>
        <span
          onClick={() => (toggle ? toggle() : null)}
          className={`${classes.box} ${background === "#ffffff" ? "dark" : "light"}`}
          style={{ color: color, background }}
        >
          Aa
        </span>
        <Text size={"xl"}>{formatRatio(contrast)}</Text>
      </div>
      <div className={classes.grid}>
        {result.map(({ level, label, pass }) => (
          <Fragment key={level}>
            <div className="flex flex-col items-start justify-center">
              {label}
            </div>
            <div className={pass ? classes.ok : classes.fail}>{level}</div>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default Colors;
