import { useState, createContext } from "react";
export const DialogsContext = createContext();

export const DialogsProvider = ({ children }) => {
  const [dialogs, setDialogs] = useState([]);

  const openDialog = (id, dialog) => {
    setDialogs([...dialogs, { id, source: dialog }]);
  };

  const closeDialog = (id) => {
    setDialogs([...dialogs.filter((dialog) => dialog.id !== id)]);
  };

  return (
    <DialogsContext.Provider
      value={{
        openDialog,
        closeDialog,
      }}
    >
      {children}
      {dialogs.map((dialog) => dialog.source)}
    </DialogsContext.Provider>
  );
};
