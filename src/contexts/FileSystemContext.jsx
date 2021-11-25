import { createContext, useState } from "react";

export const FileSystemContext = createContext();

export const FileSystemProvider = ({ children }) => {
  const [fs, setFs] = useState({
    C: {
      users: {
        admin: {
          Desktop: {},
          Documents: {},
          Pictures: {},
          Videos: {},
          "test.txt": {
            content: "hello world",
          },
        },
      },
    },
  });

  const doesFsoExist = (obj, fsoName, i) => {
    if (obj.hasOwnProperty(i > 0 ? `${fsoName} (${i})` : fsoName))
      return doesFsoExist(obj, fsoName, i === 0 ? i + 2 : i + 1);
    return i > 0 ? `${fsoName} (${i})` : fsoName;
  };

  const createFSOAtPath = (path, obj, step, fsoName, fileType) => {
    if (step === path.length - 1) {
      switch (fileType) {
        case "Folder":
          return (obj[path[step]][doesFsoExist(obj[path[step]], fsoName, 0)] =
            {});
        case "Shortcut":
          doesFsoExist(obj, fsoName, 0);
          return (obj[path[step]][doesFsoExist(obj[path[step]], fsoName, 0)] = {
            pathTo: "",
          });
        case "Text Document":
          doesFsoExist(obj, fsoName, 0);
          return (obj[path[step]][doesFsoExist(obj[path[step]], fsoName, 0)] = {
            content: "",
          });
      }
    } else createFSOAtPath(path, obj[path[step]], step + 1, fsoName, fileType);
  };

  const convertPathToSteps = (fsoPath) => {
    let step = "";
    let steps = [];
    [...fsoPath].forEach((c, i) => {
      if (c === "\\") {
        steps.push(step);
        step = "";
      } else if (i === fsoPath.length - 1) {
        steps.push(step + c);
      } else step += c;
    });
    return steps;
  };

  const createFSO = (fileType, fsoName, fsoPath) => {
    let temp = JSON.parse(JSON.stringify(fs));
    const steps = convertPathToSteps(fsoPath);
    createFSOAtPath(steps, temp, 0, fsoName, fileType);
    setFs(temp);
  };

  const updateFSOAtPath = (tempFs, fsoName, steps, step) => {
    if (steps.length - 1 === step) {
      tempFs[steps[step]][fsoName.new] = tempFs[steps[step]][fsoName.old];
      delete tempFs[steps[step]][fsoName.old];
    } else updateFSOAtPath(tempFs[steps[step]], fsoName, steps, step + 1);
  };

  const updateFSO = (fsoName, fsoPath) => {
    const tempFs = JSON.parse(JSON.stringify(fs));
    const steps = convertPathToSteps(fsoPath);
    updateFSOAtPath(tempFs, fsoName, steps, 0);
    setFs(tempFs);
  };

  const getFolderAtPath = (steps, step, tempFs) => {
    if (steps.length - 1 === step) {
      return tempFs[steps[step]];
    }
    return getFolderAtPath(steps, step + 1, tempFs[steps[step]]);
  };

  const getFolder = (fsoPath) => {
    const steps = convertPathToSteps(fsoPath);
    return getFolderAtPath(steps, 0, fs);
  };

  const deleteFSO = (fsoName, fsoPath) => {
    let temp = JSON.parse(JSON.stringify(fs));
    const steps = convertPathToSteps(fsoPath);
    delete getFolderAtPath(steps, 0, temp)[fsoName];
    setFs(temp);
  };

  return (
    <FileSystemContext.Provider
      value={{ createFSO, getFolder, updateFSO, deleteFSO, fs }}
    >
      {children}
    </FileSystemContext.Provider>
  );
};
