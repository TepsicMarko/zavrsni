import { createContext, useState } from "react";

export const DragAndDropContext = createContext();

export const DragAndDropProvider = ({ children }) => {
  const [windowWidth, setWindowWidth] = useState();

  return (
    <DragAndDropContext.Provider value={{}}>
      {children}
    </DragAndDropContext.Provider>
  );
};
