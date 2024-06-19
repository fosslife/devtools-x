import {
  Box,
  Button,
  Divider,
  Group,
  LoadingOverlay,
  NativeSelect,
  Slider,
  Stack,
  Text,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { dialog, fs, invoke } from "@tauri-apps/api";
import { save } from "@tauri-apps/api/dialog";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { useEffect, useRef, useState } from "react";
import { ReactCompareSlider } from "react-compare-slider";

type ImageType = "Jpeg" | "Png" | "Webp";

export default function Image2() {
  const [imageSrc, setImageSrc] = useState("");
  const [converted, setConverted] = useState<string | null>(null);
  const [quality, setQuality] = useState(50);
  const [doubouncedQuality] = useDebouncedValue(quality, 500);
  const [imageType, setImageType] = useState<ImageType>("Jpeg");
  const [loading, setLoading] = useState(false);

  const [sizes, setSizes] = useState({
    og: "0",
    conv: "0",
  });

  const selectImage = () => {
    console.debug("selecting image");
    dialog
      .open({
        multiple: false,
        title: "Select an Image",
        directory: false,
      })
      .then(async (p) => {
        if (!p) return; // no path

        let path = p as string;
        const sizeInBytes =
          (await (await (await fetch(convertFileSrc(path))).blob()).size) /
          1024;

        setSizes({
          og: sizeInBytes.toFixed(2),
          conv: "0",
        });
        setImageSrc(path);
      })
      .catch((e) => {
        console.debug("Something went wrong, while selecting image", e);
      });
  };

  const resize = async () => {
    if (!imageSrc) return;
    setLoading(true);
    console.time("resize");
    invoke<any>("compress_images_to_buffer", {
      imagePath: imageSrc,
      quality: quality,
      format: imageType,
    })
      .then((buff) => {
        const blob = new Blob([new Uint8Array(buff)], { type: "image/jpeg" });
        const url = URL.createObjectURL(blob);
        console.timeEnd("resize");
        setSizes({
          ...sizes,
          conv: (blob.size / 1024).toFixed(2),
        });
        setLoading(false);
        setConverted(url);
      })
      .catch((e) => {
        setLoading(false);
        console.error("Error while resizing image", e);
        console.timeEnd("resize");
      });
  };

  const download = async () => {
    if (!converted) return;
    const downloadPath = await save({
      defaultPath: `compressed.${quality}.${imageType.toLowerCase()}`,
      filters: [{ name: "images", extensions: [imageType.toLowerCase()] }],
      title: "Select location",
    });

    if (!downloadPath) return;

    const blob = await fetch(converted).then((x) => x.blob());

    const buffer = await blob.arrayBuffer();
    fs.writeBinaryFile({
      path: downloadPath,
      contents: new Uint8Array(buffer),
    });
  };

  useEffect(() => {
    resize();
  }, [imageSrc, doubouncedQuality, imageType]);

  return (
    <Stack>
      <Group align={"center"} justify="center">
        <Button onClick={selectImage}>Select image</Button>
        {converted ? <Button onClick={download}>Save</Button> : null}
      </Group>
      <LoadingOverlay
        visible={loading}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      {converted && (
        <Box>
          <ReactCompareSlider
            style={{
              width: "100%",
              height: "100%",
            }}
            onlyHandleDraggable={true}
            itemOne={
              <img
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
                src={convertFileSrc(imageSrc)}
                alt="Left"
              />
            }
            itemTwo={
              <img
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
                src={converted}
                alt="Right"
              />
            }
          />
        </Box>
      )}
      {converted ? (
        <Box style={{ position: "relative" }}>
          <Stack
            align={"left"}
            gap="sm"
            style={{
              position: "absolute",
              right: 10,
              bottom: 40,
              backgroundColor: "var(--mantine-color-dark-8)",
              padding: 15,
              borderRadius: 9,
              width: 250,
            }}
          >
            <NativeSelect
              value={imageType}
              data={["Jpeg", "Png", "Webp"]}
              onChange={(e) => {
                setImageType(e.currentTarget.value as ImageType);
              }}
            ></NativeSelect>
            <Divider />

            <Slider
              min={0}
              max={100}
              value={quality}
              onChange={(e) => {
                setQuality(e);
              }}
              label={quality + "%"}
              aria-label="slider-ex-1"
              labelTransitionProps={{
                transition: "skew-down",
                duration: 150,
                timingFunction: "ease",
              }}
            ></Slider>
            <Box>
              <Text c={"blue"}>Original: {sizes.og}kb</Text>{" "}
              <Text c={Number(sizes.conv) > Number(sizes.og) ? "red" : "green"}>
                Converted: {sizes.conv}kb
              </Text>
            </Box>
          </Stack>
          {converted && (
            <Text c={"dimmed"} size="xs">
              NOTE: extremly large images may take a while to load.
            </Text>
          )}
        </Box>
      ) : null}
    </Stack>
  );
}
