import {
  ActionIcon,
  Box,
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { invoke } from "@tauri-apps/api";
import { open } from "@tauri-apps/api/dialog";
import { useState } from "react";
import classes from "./styles.module.css";
import { MdInfo } from "react-icons/md";
import { useDisclosure } from "@mantine/hooks";

export default function BulkImageCompressor() {
  const [images, setImages] = useState<string[]>([]);
  const [destination, setDestination] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(50);
  const [output, setOutput] = useState<string>("");
  const [format, setFormat] = useState<string>("Jpeg");

  const [opened, { open: openModal, close }] = useDisclosure(false);

  const selectImages = () => {
    open({
      directory: false,
      multiple: true,
    }).then((result) => {
      if (result) {
        setImages(result as string[]);
      }
    });
  };

  const selectDestination = () => {
    open({
      directory: true,
      multiple: false,
    }).then((result) => {
      if (result) {
        setDestination(result as string);
      }
    });
  };

  const convert = () => {
    if (!destination || !images.length) {
      return;
    }
    if (quality < 0 || quality > 100) {
      return;
    }
    invoke("compress_images", { images, destination, quality }).then(
      (result) => {
        setOutput(result as string);
      }
    );
  };

  return (
    <Stack
      py="sm"
      style={{
        height: "100%",
        overflow: "auto",
      }}
    >
      <Group>
        <Button onClick={selectImages}>Select images</Button>
        <Button onClick={selectDestination}>Select output folder</Button>
        <Button onClick={convert} disabled={!images.length || !destination}>
          Convert{" "}
        </Button>
      </Group>
      {format === "Jpeg" && (
        <NumberInput
          label="Quality"
          step={5}
          value={quality}
          onChange={(e) => setQuality(Number(e))}
          min={0}
          max={100}
          error={quality < 0 || quality > 100}
        />
      )}
      <Group align="end">
        <Select
          label="format"
          data={["Jpeg", "Png", "Webp"]}
          value={format}
          onChange={(e) => setFormat(e as string)}
          allowDeselect={false}
        />
        <ActionIcon onClick={openModal}>
          <MdInfo />
        </ActionIcon>
      </Group>

      <Stack>
        {" "}
        <Text fw="600">Output Folder: {destination}</Text>
        <Text>{output}</Text>
      </Stack>
      <Stack>
        {images.map((image) => (
          <Box p="xs" className={classes.row} key={image}>
            <Text>{image}</Text>
          </Box>
        ))}
      </Stack>
      <Modal
        opened={opened}
        onClose={close}
        title="Info about formats and compression"
      >
        <Modal.Body>
          <Text>
            This module uses{" "}
            <Text c="dimmed" ff="mono" component="span">
              rust
            </Text>{" "}
            for image compression. The{" "}
            <Text c="dimmed" ff="mono" component="span">
              format
            </Text>{" "}
            option is not for changing image format but for enabling compression
            options for specific format. the configuration is for OUTPUT file.
            so make sure you are selecting the correct format for your images.
            for example, quality slider is only visible for Jpeg format and so
            on.
            <br />
            <br />
            using wrong format may work but it will not give you the best
            compression possible.
            <br />
            <br />
            it supports Jpeg, Png, Webp formats for now. and if you are aware of
            rust ecosystem, it uses three different crates for each format (
            <Text c="dimmed" ff="mono" component="span">
              image
            </Text>{" "}
            for jpeg,{" "}
            <Text c="dimmed" ff="mono" component="span">
              oxipng
            </Text>{" "}
            for png and{" "}
            <Text c="dimmed" ff="mono" component="span">
              webp
            </Text>{" "}
            for webp). thus every format has it&apos;s own configuration.
            <br />
            <br />
            it&apos;s important to understand how they work to get the best
            compression possible.
            <br />
            <br />
            the Jpeg format uses{" "}
            <Text c="dimmed" ff="mono" component="span">
              new_with_quality
            </Text>{" "}
            function, so if your images are jpeg family you can use the quality
            slider to adjust the quality of the output image.
            <br />
            <br />
            the Png format uses{" "}
            <Text c="dimmed" ff="mono" component="span">
              oxipng
            </Text>{" "}
            crate, so the quality slider is not visible. play around with other
            options. Same goes for webp
          </Text>
        </Modal.Body>
      </Modal>
    </Stack>
  );
}

// TODO: give more config for png/webp
// TODO: show progress
// TODO: open output folder after conversion
