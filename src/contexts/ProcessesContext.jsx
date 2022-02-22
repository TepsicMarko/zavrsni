import { useState, createContext, cloneElement } from 'react';
import processConfigurations from '../utils/constants/processConfigurations';
import { nanoid } from 'nanoid';
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
        isFocused: false,
      }));
  };

  const unfocusProcesses = () => {
    let unfocused = { ...processes };
    Object.entries(unfocused).forEach(([processName, processInstances]) =>
      Object.keys(processInstances).forEach(
        (processInstance) => (processInstances[processInstance].isFocused = false)
      )
    );

    return unfocused;
  };

  const startProcess = (name, props = {}) => {
    const hasProps = Object.keys(props).length;
    const pid = nanoid();
    const focusLevel = (processesFocusLevel.length + 1) * 10;

    setProcesses({
      ...unfocusProcesses(),
      [name]: {
        ...processes[name],
        [pid]: {
          ...processConfigurations[name],
          focusLevel,
          isFocused: true,
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
    console.log('Starting child process' + child);
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
      newProcessesFocusLevel = adjustProcessesFocusLevel(pid, newProcessesFocusLevel);
      const maxFocusLevel = newProcessesFocusLevel.length * 10;
      newProcessesFocusLevel.forEach((processesFocusLevel) => {
        if (processesFocusLevel.focusLevel === maxFocusLevel)
          newProcessesState[processesFocusLevel.name][
            processesFocusLevel.pid
          ].isFocused = true;
      });

      setProcessesFocusLevel(newProcessesFocusLevel);
    }

    setProcesses(newProcessesState);
  };

  const minimizeToTaskbar = (name, pid) => {
    const maxFocusLevel =
      processesFocusLevel.filter(
        (processesFocusLevel) =>
          !processes[processesFocusLevel.name][processesFocusLevel.pid].minimized
      ).length * 10;
    let minimized = { ...processes };
    minimized[name][pid].minimized = true;
    minimized[name][pid].isFocused = false;

    console.log(maxFocusLevel);

    if (
      processesFocusLevel.some(({ name, pid }) => !minimized[name][pid].minimized) &&
      minimized[name][pid].focusLevel >= maxFocusLevel
    ) {
      const toBeFocused = processesFocusLevel.find(
        (process) => process.focusLevel === maxFocusLevel - 10
      );

      console.log(toBeFocused);

      minimized = unfocusProcesses();
      minimized[toBeFocused.name][toBeFocused.pid].isFocused = true;
    }

    setProcesses(minimized);
  };

  const focusProcess = (name, pid, parentProcess) => {
    if (!pid) pid = Object.keys(processes[parentProcess || name])[0];
    const isFocused = processes[parentProcess || name][pid].isFocused;

    if (!isFocused || processes[parentProcess || name][pid].minimized) {
      let newProcessesFocusLevel = [...processesFocusLevel];
      let newProcessesState = { ...processes };

      newProcessesFocusLevel = adjustProcessesFocusLevel(pid, newProcessesFocusLevel);
      newProcessesFocusLevel.push({
        name: parentProcess || name,
        pid,
        focusLevel: (newProcessesFocusLevel.length + 1) * 10,
      });

      newProcessesFocusLevel.forEach(({ name, pid, focusLevel }) => {
        newProcessesState[parentProcess || name][pid].focusLevel = focusLevel;
        newProcessesState[parentProcess || name][pid].isFocused = false;
      });

      newProcessesState[parentProcess || name][pid].minimized = false;
      newProcessesState[parentProcess || name][pid].isFocused = true;

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
        minimizeToTaskbar,
        focusProcess,
      }}
    >
      {children}
    </ProcessesContext.Provider>
  );
};
