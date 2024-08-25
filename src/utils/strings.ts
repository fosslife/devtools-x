export const titleCase = (pascalCase: string) => {
  return pascalCase
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};
