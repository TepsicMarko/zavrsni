import { useState, createContext } from "react";
import { FcFolder } from "react-icons/fc";
import FileExplorer from "../components/apps/file-explorer/FileExplorer";
import Notepad from "../components/apps/notepad/Notepad";
import notepad from "../assets/notepad.png";

export const ProcessesContext = createContext();

export const ProcessesProvider = ({ children }) => {
  const [processes, setProcesses] = useState({
    "File Explorer": {
      source: <FileExplorer icon={<FcFolder />} />,
      running: false,
      minimised: false,
      icon: <FcFolder />,
      pinnedToTaskbar: true,
    },
    Notepad: {
      source: <Notepad icon={<img src={notepad} width='20rem' />} />,
      running: false,
      minimised: false,
      icon: <img src={notepad} width='30rem' />,
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
        openProcesses.push(app.source);
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
