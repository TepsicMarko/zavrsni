import { useState, createContext, cloneElement } from "react";
import { FcFolder } from "react-icons/fc";
import FileExplorer from "../components/apps/file-explorer/FileExplorer";
import Notepad from "../components/apps/notepad/Notepad";
import notepad from "../assets/notepad.png";
import Chrome from "../components/apps/chrome/Chrome";
import chrome from "../assets/chrome.png";
import chromeSmall from "../assets/chrome-small.png";
import { DialogsProvider } from "./DialogsContext";
import TaskManager from "../components/apps/task-manager/TaskManager";
import taskManager from "../assets/task-manager.png";

export const ProcessesContext = createContext();

const initialState = {
  "File Explorer": {
    source: <FileExplorer icon={<FcFolder />} />,
    running: false,
    minimised: false,
    icon: <FcFolder />,
    pinnedToTaskbar: true,
    isFocused: false,
  },
  Notepad: {
    source: <Notepad icon={<img src={notepad} width='20rem' />} />,
    running: false,
    minimised: false,
    icon: <img src={notepad} width='30rem' />,
    pinnedToTaskbar: true,
    isFocused: false,
    childProcess: {},
  },
  Chrome: {
    source: <Chrome icon={<img src={chromeSmall} />} />,
    running: false,
    minimised: false,
    icon: <img src={chrome} />,
    pinnedToTaskbar: true,
    isFocused: false,
    childProcess: {},
  },
  TaskManager: {
    source: <TaskManager icon={<img src={taskManager} height='20px' />} />,
    running: false,
    minimised: false,
    icon: <img src={taskManager} height='30px' />,
    pinnedToTaskbar: true,
    isFocused: false,
  },
};

export const ProcessesProvider = ({ children }) => {
  const [processes, setProcesses] = useState({ ...initialState });

  const unfocuseProcesses = () => {
    const unfocusedProcesses = { ...processes };
    for (let process in unfocusedProcesses) {
      unfocusedProcesses[process].isFocused = false;
    }
    return unfocusedProcesses;
  };

  const startProcess = (name, props = {}) => {
    const hasProps = Object.keys(props).length;
    setProcesses({
      ...unfocuseProcesses(),
      [name]: {
        ...processes[name],
        running: true,
        minimised: false,
        isFocused: true,
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

  const focusProcess = (name, parentProcess) => {
    if (!processes[parentProcess || name].isFocused) {
      const newState = { ...processes };
      for (let process in newState) {
        if (process === (parentProcess || name))
          newState[process].isFocused = true;
        else newState[process].isFocused = false;
      }
      setProcesses(newState);
    }
  };

  return (
    <ProcessesContext.Provider
      value={{
        processes,
        startProcess,
        startChildProcess,
        endProcess,
        minimiseToTaskbar,
        focusProcess,
      }}
    >
      <DialogsProvider>
        {children}
        {Object.keys(processes).map((process) => {
          const app = processes[process];
          return app.running ? (
            app.childProcess ? (
              <>
                {cloneElement(app.source, {
                  key: process,
                })}
                {Object.keys(app.childProcess).length
                  ? cloneElement(app.childProcess.source, {
                      key: process + "-" + processes[process].childProcess.name,
                    })
                  : null}
              </>
            ) : (
              cloneElement(app.source, {
                key: process,
              })
            )
          ) : null;
        })}
      </DialogsProvider>
    </ProcessesContext.Provider>
  );
};
