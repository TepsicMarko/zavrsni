import { useState, createContext, cloneElement } from "react";
import { DialogsProvider } from "./DialogsContext";
import appConfigurations from "../utils/constants/appConfigurations";
import { nanoid } from "nanoid";
export const ProcessesContext = createContext();

export const ProcessesProvider = ({ children }) => {
  const [processes, setProcesses] = useState({});
  const [lastFocusedProcess, setLastFocusedProcess] = useState({
    name: "",
    pid: "",
  });

  const unfocuseProcesses = () => {
    let unfocusedProcesses = { ...processes };
    for (let process in unfocusedProcesses) {
      for (let processInstance in unfocusedProcesses[process]) {
        unfocusedProcesses[process][processInstance].isFocused = false;
        setLastFocusedProcess({ name: process, pid: processInstance });
      }
    }
    return unfocusedProcesses;
  };

  const startProcess = (name, props = {}) => {
    const hasProps = Object.keys(props).length;
    const unfocusedProcesses = unfocuseProcesses();

    setProcesses({
      ...unfocusedProcesses,
      [name]: {
        ...unfocusedProcesses[name],
        [nanoid()]: {
          ...appConfigurations[name],
          running: true,
          isFocused: true,
          source: hasProps
            ? cloneElement(appConfigurations[name].source, { ...props })
            : appConfigurations[name].source,
        },
      },
    });
  };

  const startChildProcess = (parent, ppid, child, props) => {
    // ppid => parent pid
    const hasProps = Object.keys(props).length;
    setProcesses({
      ...processes,
      [parent]: {
        ...processes[parent],
        [ppid]: {
          ...processes[parent][ppid],
          childProcess: {
            ...appConfigurations[child],
            name: child,
            running: true,
            source: hasProps
              ? cloneElement(appConfigurations[child].source, { ...props })
              : appConfigurations[child].source,
          },
        },
      },
    });
  };

  // const endProcess = (name, parentProcess) => {
  //   setProcesses({
  //     ...processes,
  //     [parentProcess ? parentProcess : name]: {
  //       ...processes[parentProcess ? parentProcess : name],
  //       running: parentProcess ? true : false,
  //       source: parentProcess
  //         ? processes[parentProcess].source
  //         : initialState[name].source,
  //       childProcess: {},
  //     },
  //   });
  // };

  const endProcess = (name, pid, parentProcess) => {
    let newProcessesState = { ...processes };

    delete newProcessesState[name][pid];
    newProcessesState[lastFocusedProcess.name][
      lastFocusedProcess.pid
    ].isFocused = true;

    setProcesses(newProcessesState);
  };

  const minimiseToTaskbar = (name, pid) => {
    setProcesses({
      ...processes,
      [name]: {
        ...processes[name],
        [pid]: { ...processes[name][pid], minimised: true },
      },
    });
  };

  // const focusProcess = (name, parentProcess) => {
  //   if (!processes[parentProcess || name].isFocused) {
  //     const newState = { ...processes };
  //     for (let process in newState) {
  //       if (process === (parentProcess || name))
  //         newState[process].isFocused = true;
  //       else newState[process].isFocused = false;
  //     }
  //     setProcesses(newState);
  //   }
  // };

  const focusProcess = (name, pid, parentProcess) => {
    if (!processes[parentProcess || name][pid].isFocused) {
      const newState = { ...processes };
      for (let process in newState) {
        if (process === (parentProcess || name))
          newState[process][pid].isFocused = true;
        else newState[process][pid].isFocused = false;
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
