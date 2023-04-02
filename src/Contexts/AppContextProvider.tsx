import { createContext, useState } from "react";
import { type ElementType } from "react";

type AppContextType = {
  pinned: number[];
  handleState: (newPin: number[]) => void;
};

const init = {
  pinned: [],
  handleState: () => {},
};

export const AppContext = createContext<AppContextType>(init);

export const AppContextProvider: ElementType = ({ children }) => {
  const [pinned, setPinned] = useState<number[]>([]);

  const handleState = (newPins: number[]) => {
    setPinned(newPins);
  };
  return (
    <AppContext.Provider value={{ pinned, handleState }}>
      {children}
    </AppContext.Provider>
  );
};
