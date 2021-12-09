import { createContext, useState } from "react";

export const WindowWidthContext = createContext();

export const WindowWidthProvider = ({ children }) => {
  const [windowWidth, setWindowWidth] = useState();
  const handleWindowWidthChange = (newWindowWidth) =>
    setWindowWidth(newWindowWidth);

  return (
    <WindowWidthContext.Provider
      value={{ windowWidth, handleWindowWidthChange }}
    >
      {children}
    </WindowWidthContext.Provider>
  );
};
