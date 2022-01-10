import { createContext, useState } from "react";

export const WindowDimensionsContext = createContext();

export const WindowDimensionsProvider = ({ children }) => {
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });
  const handleWindowDimensionsChange = (newWindowDimensions) =>
    setWindowDimensions(newWindowDimensions);

  return (
    <WindowDimensionsContext.Provider
      value={{ windowDimensions, handleWindowDimensionsChange }}
    >
      {children}
    </WindowDimensionsContext.Provider>
  );
};
