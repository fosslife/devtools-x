import { ActionIcon, Box, Button, Group, Stack, Tooltip } from "@mantine/core";
import { useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { open } from "@tauri-apps/api/dialog";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { SizeMe } from "react-sizeme";

import {
  IconArrowLeft,
  IconArrowRight,
  IconZoomIn,
  IconZoomOut,
} from "@tabler/icons-react";

import classes from "./styles.module.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export default function PdfReader() {
  const [pdf, setPdf] = useState<ArrayBuffer>();
  const [numPages, setNumPages] = useState<number>();
  const [page, setPage] = useState<number>(1);
  const [scale, setScale] = useState(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const openFile = async () => {
    let path = await open({
      directory: false,
      multiple: false,
    });

    if (path) {
      fetch(convertFileSrc(path as string)).then((res) => {
        res.arrayBuffer().then((buffer) => {
          setPdf(buffer);
        });
      });
    }
  };

  if (!pdf) return <Button onClick={openFile}>Open file</Button>;

  return (
    <Stack
      w="100%"
      h={"100%"}
      style={{
        overflow: "auto",
      }}
    >
      <Group
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: "var(--mantine-color-dark-4)",
          boxShadow: "0 0 10px 0 rgba(0, 0, 0)",
          padding: "10px",
          left: 0,
          right: 0,
        }}
      >
        <Button size="xs" onClick={openFile}>
          Open new
        </Button>
        <ActionIcon onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
          <IconArrowLeft />
        </ActionIcon>
        <Box>
          {page} of {numPages}
        </Box>
        <ActionIcon
          onClick={() => setPage((p) => p + 1)}
          disabled={page === numPages}
        >
          <IconArrowRight />
        </ActionIcon>
        <Tooltip label="Zoom in">
          <ActionIcon onClick={() => setScale((scale) => scale + 0.5)}>
            <IconZoomIn />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Zoom out">
          <ActionIcon
            disabled={scale === 1}
            onClick={() => setScale((scale) => scale - 0.5)}
          >
            <IconZoomOut />
          </ActionIcon>
        </Tooltip>
      </Group>
      <SizeMe monitorWidth>
        {({ size }) => (
          <div>
            <Document onLoadSuccess={onDocumentLoadSuccess} file={pdf}>
              {Array.from(new Array(numPages), (el, index) => (
                <Page
                  scale={scale}
                  className={classes.page}
                  pageIndex={index + 1}
                  inputRef={(ref) => {
                    if (ref && page === index + 1)
                      ref.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                  }}
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={size.width || 600}
                  loading={<Box>loading</Box>}
                />
              ))}
            </Document>
          </div>
        )}
      </SizeMe>
    </Stack>
  );
}
