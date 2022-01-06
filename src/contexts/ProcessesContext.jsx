import { useState, createContext, cloneElement } from "react";
import { FcFolder } from "react-icons/fc";
import FileExplorer from "../components/apps/file-explorer/FileExplorer";
import Notepad from "../components/apps/notepad/Notepad";
import notepad from "../assets/notepad.png";
import Chrome from "../components/apps/chrome/Chrome";
import chrome from "../assets/chrome.png";
import chromeSmall from "../assets/chrome-small.png";
import { DialogsProvider } from "./DialogsContext";

export const ProcessesContext = createContext();

const initialState = {
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
    childProcess: {},
  },
  Chrome: {
    source: <Chrome icon={<img src={chromeSmall} />} />,
    running: false,
    minimised: false,
    icon: <img src={chrome} />,
    pinnedToTaskbar: true,
    childProcess: {},
  },
};

export const ProcessesProvider = ({ children }) => {
  const [processes, setProcesses] = useState({ ...initialState });

  const startProcess = (name, props = {}) => {
    const hasProps = Object.keys(props).length;
    setProcesses({
      ...processes,
      [name]: {
        ...processes[name],
        running: true,
        minimised: false,
        source: hasProps
          ? cloneElement(processes[name].source, { ...props })
          : processes[name].source,
      },
    });
  };

  const startChildProcess = (parent, child, props) => {
    const hasProps = Object.keys(props).length;
    setProcesses({
      ...processes,
      [parent]: {
        ...processes[parent],
        childProcess: {
          ...processes[child],
          name: child,
          running: true,
          source: hasProps
            ? cloneElement(processes[child].source, { ...props })
            : processes[child].source,
        },
      },
    });
  };

  const endProcess = (name, parentProcess) => {
    setProcesses({
      ...processes,
      [parentProcess ? parentProcess : name]: {
        ...processes[parentProcess ? parentProcess : name],
        running: parentProcess ? true : false,
        source: parentProcess
          ? processes[parentProcess].source
          : initialState[name].source,
        childProcess: {},
      },
    });
  };

  const minimiseToTaskbar = (name) => {
    setProcesses({
      ...processes,
      [name]: { ...processes[name], minimised: true },
    });
  };

  return (
    <ProcessesContext.Provider
      value={{
        processes,
        startProcess,
        startChildProcess,
        endProcess,
        minimiseToTaskbar,
      }}
    >
      <DialogsProvider>
        {children}
        {Object.keys(processes).map((process) => {
          const app = processes[process];
          return app.childProcess ? (
            !app.minimised && app.running ? (
              <>
                {cloneElement(app.source, { key: process })}
                {Object.keys(app.childProcess).length
                  ? cloneElement(app.childProcess.source, {
                      key: process + "-" + processes[process].childProcess.name,
                    })
                  : null}
              </>
            ) : null
          ) : !app.minimised && app.running ? (
            cloneElement(app.source, { key: process })
          ) : null;
        })}
      </DialogsProvider>
    </ProcessesContext.Provider>
  );
};
