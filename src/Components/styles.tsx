const useStyles = (theme) => ({
  pinnedCard: {
    padding: 15,
    cursor: "pointer",
    borderRadius: 5,
    boxShadow: theme.shadows.md,
    alignSelf: "stretch",
    flex: "1 1 0",
    minWidth: 150,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.blue[9]
        : theme.colors.blue[8],
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[1],
    ":hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.blue[8]
          : theme.colors.blue[9],
    },
  },
});

export const pinnedCard = `
  cursor: pointer;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  align-self: stretch;
  flex: 1 1 0;
  min-width: 150px;
  background-color: #1e3a8a;
  color: #fff;
  &:hover {
    background-color: #1e3a8a;
  }
`;
