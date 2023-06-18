import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  navbar: {
    height: "100%",
    padding: "10px",
    paddingTop: 0,
    paddingLeft: 0,
    paddingInline: 5,
    paddingRight: 5,
    boxShadow: `${
      theme.colorScheme === "light"
        ? "rgba(0, 0, 0, 0.15)"
        : "rgba(0, 0, 0, 0.15)"
    } 1.95px 1.95px 2.6px`,
    fontSize: "15px",
    background:
      theme.colorScheme === "dark"
        ? theme.colors.dark[8]
        : theme.colors.gray[1],
  },
  topSection: {
    gap: 10,
    position: "sticky",
    top: 0,
    zIndex: 2,
    background:
      theme.colorScheme === "dark"
        ? theme.colors.dark[8]
        : theme.colors.gray[1],
  },
  row: {
    fontSize: 18,
    cursor: "pointer",
    padding: 4,
    paddingLeft: 10,
    borderRadius: 4,
    display: "flex",
    gap: 20,
    justifyContent: "space-between",
    alignItems: "center",
    ":hover": {
      color:
        theme.colorScheme === "dark"
          ? theme.colors.blue[0]
          : theme.colors.gray[1],
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.blue[9]
          : theme.colors.blue[6],
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
    gap: 5,
    paddingInline: 5,
    overflow: "auto",
  },
  homeWrapper: {
    display: "flex",
    justifyContent: "space-between",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.dark[8],
  },
  home: {
    marginInline: 5,
    padding: 5,
    cursor: "pointer",
    paddingInlineEnd: 35,
    paddingLeft: 5,
    borderRadius: 4,
    ":hover": {
      color: theme.colorScheme === "dark" ? theme.colors.blue[0] : "black",
      background:
        theme.colorScheme === "dark"
          ? theme.colors.blue[9]
          : theme.colors.blue[6],
    },
  },
  textInput: { width: "100%", alignSelf: "center", marginTop: "15px" },
  active: {
    fontStyle: "normal",
    fontWeight: "bold",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.blue[0]
        : theme.colors.gray[1],
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.blue[9]
        : theme.colors.blue[6],
  },
  iconsBarWrapper: {
    // marginTop: 10,
    padding: 5,
    overflow: "auto",
  },
  iconsBarRow: {
    fontSize: 18,
    cursor: "pointer",
    display: "flex",
    justifyContent: "start",
    padding: 5,
    borderRadius: 5,
  },
  iconsTopSection: {
    marginTop: 10,
    marginBottom: -10,
    marginLeft: 5,
  },
}));
