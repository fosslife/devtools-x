import { MantineThemeComponents } from "@mantine/core";

export const customComponents: MantineThemeComponents = {
  TextInput: {
    defaultProps: {
      styles: {
        label: {
          marginBlock: 10,
        },
      },
    },
  },
  PasswordInput: {
    defaultProps: {
      styles: {
        label: {
          marginBlock: 10,
        },
      },
    },
  },
  Select: {
    defaultProps: {
      styles: {
        label: {
          marginBottom: 10,
        },
      },
    },
  },
  NativeSelect: {
    defaultProps: {
      styles: {
        label: {
          marginBottom: 10,
        },
      },
    },
  },
  NumberInput: {
    defaultProps: {
      styles: {
        label: {
          marginBottom: 10,
        },
      },
    },
  },
};
