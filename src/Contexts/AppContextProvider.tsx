import { createContext, useContext, useState } from "react";
import { type ElementType } from "react";

export type AppConfigType = {
  editorThemeDark: string;
  editorThemeLight: string;
};

type AppContextType = {
  pinned: string[];
  handleState: (newPin: string[]) => void;
  config: AppConfigType;
  handleConfig: (newConfig: Partial<AppConfigType>) => void;
};

export const defaultConfig = {
  editorThemeDark: "tomorrow-night",
  editorThemeLight: "dawn",
};
const init = {
  pinned: [],
  handleState: () => {},
  config: defaultConfig,
  handleConfig: () => {},
};

export const AppContext = createContext<AppContextType>(init);

export const AppContextProvider: ElementType = ({ children }) => {
  const [pinned, setPinned] = useState<string[]>([]);
  const [config, setConfig] = useState<AppConfigType>(defaultConfig);

  const handleState = (newPins: string[]) => {
    setPinned(newPins);
  };

  const handleConfig = (newConfig: Partial<AppConfigType>) => {
    setConfig({ ...config, ...newConfig } as AppConfigType);
  };
  return (
    <AppContext.Provider value={{ pinned, handleState, config, handleConfig }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
