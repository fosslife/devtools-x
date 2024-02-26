import { createContext, useState } from "react";
import { type ElementType } from "react";

type AppContextType = {
  pinned: string[];
  handleState: (newPin: string[]) => void;
};

const init = {
  pinned: [],
  handleState: () => {},
};

export const AppContext = createContext<AppContextType>(init);

export const AppContextProvider: ElementType = ({ children }) => {
  const [pinned, setPinned] = useState<string[]>([]);

  const handleState = (newPins: string[]) => {
    setPinned(newPins);
  };
  return (
    <AppContext.Provider value={{ pinned, handleState }}>
      {children}
    </AppContext.Provider>
  );
};
