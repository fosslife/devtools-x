import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  navbar: {
    height: "100%",
    padding: "10px",
    paddingTop: 0,
    borderRight: "thin solid white",
    fontSize: "15px",
    background:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[1],
  },
  topSection: {
    position: "sticky",
    top: 0,
    zIndex: 2,
    background:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[1],
  },
  row: {
    cursor: "pointer",
    padding: 4,
    paddingLeft: 5,
    borderRadius: 4,
    display: "flex",
    gap: 20,
    justifyContent: "space-between",
    ":hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.gray[8]
          : theme.colors.gray[6],
    },
  },
  listTitle: {
    display: "flex",
    gap: 15,
    alignItems: "center",
    flexDirection: "row",
    textAlign: "center",
  },
  bottomSection: {
    width: "max-content",
    overflowY: "auto",
    gap: 5,
  },
  home: {
    padding: 5,
    cursor: "pointer",
    paddingInlineEnd: 35,
    borderRadius: 4,
    ":hover": {
      background:
        theme.colorScheme === "dark"
          ? theme.colors.gray[8]
          : theme.colors.gray[6],
    },
  },

  active: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.gray[8]
        : theme.colors.gray[6],
  },
}));
