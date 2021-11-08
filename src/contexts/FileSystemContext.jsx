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
  const createFSOAtPath = (path, obj, step, fsoName, fileType) => {
    if (step === path.length - 1) {
      switch (fileType) {
        case "Folder":
          return (obj[path[step]][fsoName] = {});
        case "Shortcut":
          return (obj[path[step]][fsoName] = { pathTo: "" });
        case "Text Document":
          return (obj[path[step]][fsoName] = { content: "" });
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

  const getFSOAtPath = (steps, step, tempFs) => {
    if (steps.length - 1 === step) {
      return tempFs[steps[step]];
    }
    return getFSOAtPath(steps, step + 1, tempFs[steps[step]]);
  };

  const getFSO = (fsoPath) => {
    const steps = convertPathToSteps(fsoPath);
    return getFSOAtPath(steps, 0, fs);
  };

  return (
    <FileSystemContext.Provider value={{ createFSO, updateFSO, getFSO }}>
      {children}
    </FileSystemContext.Provider>
  );
};
