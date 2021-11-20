import { useState, createContext } from "react";
import FileExplorer from "../components/apps/file-explorer/FileExplorer";
import { FcFolder } from "react-icons/fc";

const availableProcesses = {
  "File Explorer": <FileExplorer />,
};

export const ProcessesContext = createContext();

export const ProcessesProvider = ({ children }) => {
  const [processes, setProcesses] = useState({
    "File Explorer": {
      running: false,
      minimised: false,
      icon: <FcFolder />,
      pinnedToTaskbar: true,
    },
  });

  const startProcess = (name) => {
    setProcesses({
      ...processes,
      [name]: { ...processes[name], running: true, minimised: false },
    });
  };

  const endProcess = (name) => {
    setProcesses({
      ...processes,
      [name]: { ...processes[name], running: false },
    });
  };

  const minimiseToTaskbar = (name) => {
    setProcesses({
      ...processes,
      [name]: { ...processes[name], minimised: true },
    });
  };

  const renderProcesses = () => {
    let openProcesses = [];

    for (let Process in processes) {
      const app = processes[Process];
      if (!app.minimised && app.running) {
        openProcesses.push(availableProcesses[Process]);
      }
    }

    return openProcesses;
  };

  return (
    <ProcessesContext.Provider
      value={{ processes, startProcess, endProcess, minimiseToTaskbar }}
    >
      {children}
      {renderProcesses()}
    </ProcessesContext.Provider>
  );
};
