import classes from "./styles.module.css";

import { ActionIcon, Box, Tooltip } from "@mantine/core";
import {
  type MouseEventHandler,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import {
  BsArrowReturnLeft,
  BsTextIndentLeft,
  BsTextParagraph,
} from "react-icons/bs";

import { Monaco } from "@/Components/MonacoWrapper";

export const SingleTab = ({
  tabid,
  tabdata,
  onChange,
}: {
  tabid: number;
  tabdata: string;
  onChange: (str: string, t: number) => void;
}) => {
  const [code, setCode] = useState(tabdata);
  useEffect(() => {
    setCode(tabdata);
  }, [tabdata]);

  const [options, setOptions] = useState<{ wordWrap: "on" | "off" }>({
    wordWrap: "on",
  }); // FIX types?

  return (
    <Box style={{ height: "100%" }}>
      <Box className={classes.controls}>
        <ControlIcon
          label="Format JSON"
          onClick={() => {
            setCode(JSON.stringify(JSON.parse(code), null, 2));
          }}
        >
          <BsTextIndentLeft />
        </ControlIcon>
        <ControlIcon
          label="Minify JSON"
          onClick={() => {
            setCode(JSON.stringify(JSON.parse(code)));
          }}
        >
          <BsTextParagraph />
        </ControlIcon>
        <ControlIcon
          label="Word Wrap"
          onClick={() =>
            setOptions({
              ...options,
              wordWrap: options.wordWrap === "on" ? "off" : "on",
            })
          }
        >
          <BsArrowReturnLeft />
        </ControlIcon>
      </Box>
      <Monaco
        language="json"
        value={code}
        extraOptions={{ wordWrap: options.wordWrap }}
        setValue={(e = "") => {
          setCode(e);
          onChange(e, tabid);
        }}
      />
    </Box>
  );
};

type ControlIconProps = {
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
};

function ControlIcon({ label, onClick, children }: ControlIconProps) {
  return (
    <Tooltip label={label} position="bottom">
      <ActionIcon color={"dark"} variant="default" onClick={onClick}>
        {children}
      </ActionIcon>
    </Tooltip>
  );
}
