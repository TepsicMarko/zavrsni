import { useState, createContext, cloneElement } from "react";
import processConfigurations from "../utils/constants/processConfigurations";
import { nanoid } from "nanoid";
export const ProcessesContext = createContext();

export const ProcessesProvider = ({ children }) => {
  const [processes, setProcesses] = useState({});
  const [processesFocusLevel, setProcessesFocusLevel] = useState([]);

  const adjustProcessesFocusLevel = (pid, newProcessesFocusLevel) => {
    return newProcessesFocusLevel
      .filter((processFocusLevel) => processFocusLevel.pid !== pid)
      .map((processFocusLevel, i) => ({
        ...processFocusLevel,
        focusLevel: (i + 1) * 10,
      }));
  };

  const startProcess = (name, props = {}) => {
    const hasProps = Object.keys(props).length;
    const pid = nanoid();
    const focusLevel = (processesFocusLevel.length + 1) * 10;

    setProcesses({
      ...processes,
      [name]: {
        ...processes[name],
        [pid]: {
          ...processConfigurations[name],
          focusLevel,
          source: hasProps
            ? cloneElement(processConfigurations[name].source, { ...props })
            : processConfigurations[name].source,
        },
      },
    });

    setProcessesFocusLevel([...processesFocusLevel, { name, pid, focusLevel }]);
  };

  const startChildProcess = (parent, ppid, child, props) => {
    // ppid => parent pid
    console.log("Starting child process" + child);
    // setTimeout(() => {}, 500);
    const hasProps = Object.keys(props).length;
    setProcesses({
      ...processes,
      [parent]: {
        ...processes[parent],
        [ppid]: {
          ...processes[parent][ppid],
          childProcess: {
            ...processConfigurations[child],
            name: child,
            source: hasProps
              ? cloneElement(processConfigurations[child].source, {
                  ...props,
                })
              : processConfigurations[child].source,
          },
        },
      },
    });
  };

  const endProcess = (name, pid, parentProcess) => {
    let newProcessesState = { ...processes };
    let newProcessesFocusLevel = [...processesFocusLevel];

    if (parentProcess) newProcessesState[parentProcess][pid].childProcess = {};
    else {
      delete newProcessesState[name][pid];
      newProcessesFocusLevel = adjustProcessesFocusLevel(
        pid,
        newProcessesFocusLevel
      );

      setProcessesFocusLevel(newProcessesFocusLevel);
    }
    setProcesses(newProcessesState);
  };

  const minimiseToTaskbar = (name, pid) => {
    let minimised = { ...processes };
    minimised[name][pid].minimised = true;

    setProcesses(minimised);
  };

  const focusProcess = (name, pid, parentProcess) => {
    if (!pid) pid = Object.keys(processes[parentProcess || name])[0];
    const isFocused =
      processes[parentProcess || name][pid].focusLevel ===
      processesFocusLevel.length * 10;
    // const isOnlyProcess = processesFocusLevel.length === 1;
    if (!isFocused || processes[parentProcess || name][pid].minimised) {
      let newProcessesFocusLevel = [...processesFocusLevel];
      let newProcessesState = { ...processes };

      newProcessesFocusLevel = adjustProcessesFocusLevel(
        pid,
        newProcessesFocusLevel
      );
      newProcessesFocusLevel.push({
        name: parentProcess || name,
        pid,
        focusLevel: (newProcessesFocusLevel.length + 1) * 10,
      });

      newProcessesFocusLevel.forEach(
        ({ name, pid, focusLevel }) =>
          (newProcessesState[parentProcess || name][pid].focusLevel =
            focusLevel)
      );

      newProcessesState[parentProcess || name][pid].minimised = false;

      setProcesses(newProcessesState);
      setProcessesFocusLevel(newProcessesFocusLevel);
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
      {children}
      {Object.keys(processes).flatMap((process) => {
        return Object.keys(processes[process]).map((processInstance) => {
          const appInstance = processes[process][processInstance];

          return appInstance.childProcess ? (
            <>
              {cloneElement(appInstance.source, {
                key: processInstance,
                pid: processInstance,
              })}
              {Object.keys(appInstance.childProcess).length
                ? cloneElement(appInstance.childProcess.source, {
                    key: processInstance + "-" + appInstance.childProcess.name,
                  })
                : null}
            </>
          ) : (
            cloneElement(appInstance.source, {
              key: processInstance,
              pid: processInstance,
            })
          );
        });
      })}
    </ProcessesContext.Provider>
  );
};
