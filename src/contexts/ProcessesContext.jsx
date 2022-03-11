import { useState, createContext, cloneElement } from 'react';
import processConfigurations from '../utils/constants/processConfigurations';
import { nanoid } from 'nanoid';
export const ProcessesContext = createContext();

export const ProcessesProvider = ({ children }) => {
  const [processes, setProcesses] = useState({});
  const [processesFocusLevel, setProcessesFocusLevel] = useState([]);

  const deepCloneProcesses = (obj) => {
    const clonedProcesses = JSON.parse(JSON.stringify(obj || processes));

    Object.entries(clonedProcesses).forEach(([processName, processInstances]) => {
      Object.entries(processInstances).forEach(([processInstanceId, processInstance]) => {
        clonedProcesses[processName][processInstanceId].source =
          processes[processName][processInstanceId].source;
        clonedProcesses[processName][processInstanceId].icon =
          processes[processName][processInstanceId].icon;
      });
    });

    return clonedProcesses;
  };

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
    let unfocused = deepCloneProcesses();
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
    const pid = nanoid();
    const hasProps = Object.keys(props).length;
    const focusLevel = (processesFocusLevel.length + 1) * 10;

    setProcesses((processes) => {
      const newProcessesState = {
        ...processes,
        [parent]: {
          ...processes[parent],
          [ppid]: {
            ...processes[parent][ppid],
            childProcess: {
              name: child,
              pid,
            },
          },
        },
        [child]: {
          ...processes[child],
          [pid]: {
            ...processConfigurations[child],
            focusLevel,
            source: hasProps
              ? cloneElement(processConfigurations[child].source, { ...props })
              : processConfigurations[child].source,
            isChildProcess: true,
          },
        },
      };

      return newProcessesState;
    });

    setProcessesFocusLevel((prev) => {
      return [...prev, { name: child, pid, focusLevel }];
    });
  };

  const endAllChildProcesses = (newProcessesFocusLevel, newProcessesState, name, pid) => {
    const { name: childProcess, pid: cpid } = processes[name][pid].childProcess;
    delete newProcessesState[childProcess][cpid];

    if (Object.keys(processes[childProcess][cpid].childProcess || {}).length)
      return adjustProcessesFocusLevel(
        cpid,
        endAllChildProcesses(
          newProcessesFocusLevel,
          newProcessesState,
          childProcess,
          cpid
        )
      );

    return adjustProcessesFocusLevel(cpid, newProcessesFocusLevel);
  };

  const endProcess = (name, pid, parentProcess, ppid) => {
    let newProcessesState = deepCloneProcesses();
    let newProcessesFocusLevel = [...processesFocusLevel];
    const isChildProcess = newProcessesState[name][pid].isChildProcess;
    const hasChildProcess =
      Object.keys(newProcessesState[name][pid].childProcess || {}).length > 0;

    if (hasChildProcess) {
      newProcessesFocusLevel = endAllChildProcesses(
        newProcessesFocusLevel,
        newProcessesState,
        name,
        pid
      );
    }

    delete newProcessesState[name][pid];
    newProcessesFocusLevel = adjustProcessesFocusLevel(pid, newProcessesFocusLevel);

    const maxFocusLevel = newProcessesFocusLevel.length * 10;

    newProcessesFocusLevel.forEach((processesFocusLevel) => {
      if (processesFocusLevel.focusLevel === maxFocusLevel)
        newProcessesState[processesFocusLevel.name][
          processesFocusLevel.pid
        ].isFocused = true;
    });

    if (isChildProcess) {
      newProcessesState[parentProcess][ppid].childProcess = {};
    }

    setProcessesFocusLevel(newProcessesFocusLevel);
    setProcesses(newProcessesState);
  };

  const minimizeToTaskbar = (name, pid) => {
    const maxFocusLevel =
      processesFocusLevel.filter(
        (processesFocusLevel) =>
          !processes[processesFocusLevel.name][processesFocusLevel.pid].minimized
      ).length * 10;
    let minimized = deepCloneProcesses();
    minimized[name][pid].minimized = true;
    minimized[name][pid].isFocused = false;

    if (
      processesFocusLevel.some(({ name, pid }) => !minimized[name][pid].minimized) &&
      minimized[name][pid].focusLevel >= maxFocusLevel
    ) {
      const toBeFocused = processesFocusLevel.find(
        (process) => process.focusLevel === maxFocusLevel - 10
      );

      minimized = unfocusProcesses();
      minimized[toBeFocused.name][toBeFocused.pid].isFocused = true;
    }

    setProcesses(minimized);
  };

  const focusProcess = (name, pid) => {
    console.log(name, pid);
    if (!pid) pid = Object.keys(processes[name])[0];
    const isFocused = processes[name][pid].isFocused;

    if (!isFocused || processes[name][pid].minimized) {
      let newProcessesFocusLevel = [...processesFocusLevel];
      let newProcessesState = deepCloneProcesses();

      newProcessesFocusLevel = adjustProcessesFocusLevel(pid, newProcessesFocusLevel);
      newProcessesFocusLevel.push({
        name: name,
        pid,
        focusLevel: (newProcessesFocusLevel.length + 1) * 10,
      });

      newProcessesFocusLevel.forEach(({ name, pid, focusLevel }) => {
        newProcessesState[name][pid].focusLevel = focusLevel;
        newProcessesState[name][pid].isFocused = false;
      });

      newProcessesState[name][pid].minimized = false;
      newProcessesState[name][pid].isFocused = true;

      setProcessesFocusLevel(newProcessesFocusLevel);
      setProcesses(newProcessesState);
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
