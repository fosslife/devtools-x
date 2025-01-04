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
import { invoke } from "@tauri-apps/api/core";
import { save, open } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";
import { convertFileSrc } from "@tauri-apps/api/core";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

type ImageType = "Jpeg" | "Png" | "Webp";

export default function Image2() {
  const [imageSrc, setImageSrc] = useState("");
  const [converted, setConverted] = useState<string | null>(null);
  const [quality, setQuality] = useState(50);
  const [doubouncedQuality] = useDebouncedValue(quality, 500);
  const [imageType, setImageType] = useState<ImageType>("Jpeg");
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(1);

  const [sizes, setSizes] = useState({
    og: "0",
    conv: "0",
  });

  const boxRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * -0.005;
      const newZoom = Math.min(Math.max(zoom + delta, 0.5), 5);
      setZoom(newZoom);
    },
    [zoom]
  );

  const selectImage = () => {
    console.debug("selecting image");
    open({
      multiple: false,
      title: "Select an Image",
      directory: false,
      filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg", "webp"] }],
    })
      .then(async (p) => {
        if (!p) return;
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
    console.log("resize", imageSrc);

    setLoading(true);
    console.time("resize");
    invoke<any>("compress_images_to_buffer", {
      imagePath: imageSrc,
      quality: quality,
      format: imageType,
    })
      .then((buff) => {
        const blob = new Blob([new Uint8Array(buff)], {
          type: "image/jpeg",
        });
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
    writeFile(downloadPath, new Uint8Array(buffer));
  };

  useEffect(() => {
    const element = boxRef.current;
    if (!element) return;

    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => element.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  useEffect(() => {
    resize();
  }, [imageSrc, doubouncedQuality, imageType]);

  return (
    <Stack
      style={{
        height: "100%",
        overflow: "auto",
      }}
    >
      <Group align={"center"} justify="center">
        <Button onClick={selectImage}>Select image</Button>
        {converted ? <Button onClick={download}>Save</Button> : null}
        {zoom !== 1 && (
          <Button variant="light" onClick={() => setZoom(1)}>
            Fit to width
          </Button>
        )}
      </Group>
      <LoadingOverlay
        visible={loading}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      {converted && (
        <Box onWheel={handleWheel} style={{ touchAction: "none" }}>
          <ReactCompareSlider
            transition="0.25s cubic-bezier(0.645, 0.045, 0.355, 1)"
            style={{
              width: "100%",
              height: "70vh",
            }}
            onlyHandleDraggable={true}
            itemOne={
              <ReactCompareSliderImage
                style={{
                  objectFit: "contain",
                  transform: `scale(${zoom})`,
                  transition: "transform 0.2s ease-out",
                }}
                src={convertFileSrc(imageSrc)}
                alt="Left"
              />
            }
            itemTwo={
              <ReactCompareSliderImage
                style={{
                  objectFit: "contain",
                  transform: `scale(${zoom})`,
                  transition: "transform 0.2s ease-out",
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
              NOTE: Large images may take a while to load, instead try
              squoosh.app/
            </Text>
          )}
        </Box>
      ) : null}
    </Stack>
  );
}
