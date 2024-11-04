import { Box, Button, Group, Stack } from "@mantine/core";
import { open, save } from "@tauri-apps/plugin-dialog";
import { convertFileSrc } from "@tauri-apps/api/core";
import { useRef, useState } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.min.css";

import { writeFile } from "@tauri-apps/plugin-fs";

export default function ImageCrop() {
  const [imageSrc, setImageSrc] = useState("");

  const cropperRef = useRef<ReactCropperElement>(null);

  const onSelectImage = async () => {
    const path = await open({
      directory: false,
      filters: [{ name: "Images", extensions: ["jpg", "png", "gif"] }],
      multiple: false,
      title: "Select Image",
    });
    if (path) {
      const asset = convertFileSrc(path as string);
      console.log(asset);
      setImageSrc(asset);
    }
  };

  const saveImage = async () => {
    if (!cropperRef.current) {
      return;
    }

    cropperRef.current.cropper.getCroppedCanvas().toBlob(async (blob) => {
      console.log(blob);
      if (!blob) {
        return;
      }
      const path = await save({
        defaultPath: "iamage.png",
        filters: [{ name: "Images", extensions: ["png"] }],
        title: "Save Image",
      });

      if (path) {
        writeFile(path, new Uint8Array(await blob.arrayBuffer()));
      }
    });
  };

  return (
    <Stack
      h="100%"
      pb="xl"
      mb="xl"
      style={{
        overflow: "auto",
      }}
    >
      <Group>
        <Button w="fit-content" onClick={onSelectImage}>
          Select Image
        </Button>
        <Button
          display={imageSrc ? "block" : "none"}
          w="fit-content"
          onClick={saveImage}
        >
          Save
        </Button>
      </Group>
      <Group w="100%" align="start" grow wrap="nowrap">
        {imageSrc && (
          <Box pos={"relative"} w={"50%"}>
            <Cropper
              src={imageSrc}
              zoomTo={0.5}
              preview=".img-preview"
              rotatable={true}
              movable={true}
              scalable={true}
              //   TODO: slow down when ctrl is held
              wheelZoomRatio={0.5}
              ref={cropperRef}
              style={{
                width: "100%",
              }}
              viewMode={1}
              dragMode="move"
            />
          </Box>
        )}
      </Group>
      <Group h="100%">
        {" "}
        <Box
          className="img-preview"
          style={{
            overflow: "hidden",
            height: "100%",
            width: "50%",
          }}
        ></Box>
      </Group>
    </Stack>
  );
}
