export type Part = {
  title: string;
  template: string;
};

type ReadmeTemplate =
  | string
  | {
      render: string;
      info?: string;
      module?: string;
      renderTitle?: boolean;
    };

export type ReadmeTemplates = {
  [key: string]: ReadmeTemplate;
};
