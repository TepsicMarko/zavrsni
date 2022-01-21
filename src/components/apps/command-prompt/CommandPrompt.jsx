import "./CommandPrompt.css";
import Window from "../../system/window/Window";
import WindowContent from "../../system/window/window-content/WindowContent";
import { useRef, useState, useEffect, useContext } from "react";
import { FileSystemContext } from "../../../contexts/FileSystemContext";
import { ProcessesContext } from "../../../contexts/ProcessesContext";
import Terminal from "react-console-emulator";
import commands from "./commands";
import { path as Path } from "filer";
import DirectoryContentOutput from "./command-outputs/DirectoryContentOutput";
import FileContentsOutput from "./command-outputs/FileContentsOutput";
import formatCommandLineArguments from "../../../utils/helpers/formatCommandLineArgumnets";

const CommandPrompt = ({ icon, pid }) => {
  const {
    doesPathExist,
    getFolder,
    mkdirAsync,
    deleteFSO,
    writeFileAsync,
    readFileContent,
    renameFSO,
    moveFSO,
  } = useContext(FileSystemContext);
  const { endProcess, processes } = useContext(ProcessesContext);
  const [currentPath, setCurrentPath] = useState("/C/users/admin");
  const terminal = useRef(null);

  const changePath = async (path) => {
    if (!path.includes('"') && path.includes(" "))
      return "cd: too many arguments";

    const toManyArgs = path.slice(path.lastIndexOf('"')).includes(" ");
    if (toManyArgs) return "cd: too many arguments";

    const newPath = Path.join(currentPath, path.replaceAll('"', ""));
    const exists = await doesPathExist(newPath);
    if (exists) {
      setCurrentPath(newPath);
    } else {
      return "The system cannot find the path specified.";
    }
  };

  const listFolderContents = async (command, path, ...args) => {
    return (
      <DirectoryContentOutput
        currentPath={currentPath}
        command={command}
        path={path}
        args={args}
        getFolder={getFolder}
      />
    );
  };

  const createNewFolders = async (command, ...args) => {
    if (args.length === 1) {
      try {
        await mkdirAsync(Path.join(currentPath, args[0]));
        return null;
      } catch (err) {
        return command === "mkdir"
          ? `mkdir: cannot create directory '${args[0]}': File exists`
          : `A subdirectory or file ${args[0]} already exists.`;
      }
    }
    if (args.length > 1) {
      const folderPaths = formatCommandLineArguments(...args);

      const failedFolderPaths = await Promise.all(
        folderPaths.map(async (folderPath) => {
          try {
            await mkdirAsync(Path.join(currentPath, folderPath));
          } catch (err) {
            return command === "mkdir"
              ? `mkdir: cannot create directory '${folderPath}': File exists`
              : `A subdirectory or file ${folderPath} already exists.`;
          }
        })
      );

      return failedFolderPaths.filter((el) => el);
    }
  };

  const deleteFolders = async (command, recusive, ...args) => {
    if (args.every((arg) => arg === ""))
      return command === "rm"
        ? "rm: missing operand"
        : "The syntax of the command is incorrect.";
    if (args.length === 1) {
      try {
        await deleteFSO(currentPath, args[0], "directory", recusive);
      } catch (err) {
        return err.errno == 53
          ? command === "rm"
            ? `rm: cannot remove '${args[0]}': Is a directory`
            : "The directory is not empty."
          : command === "rm"
          ? `rm: cannot remove '${args[0]}': No such file or directory`
          : "The system cannot find the file specified.";
      }
    }
    if (args.length > 1) {
      const folderPaths = formatCommandLineArguments(...args);

      console.log(folderPaths);

      const failedFolderPaths = await Promise.all(
        folderPaths.map(async (folderPath) => {
          try {
            await deleteFSO(currentPath, folderPath, "directory", recusive);
          } catch (err) {
            console.log(err);
            return err.errno == 53
              ? command === "rm"
                ? `rm: cannot remove '${folderPath}': Is a directory`
                : "The directory is not empty."
              : command === "rm"
              ? `rm: cannot remove '${folderPath}': No such file or directory`
              : "The system cannot find the file specified.";
          }
        })
      );

      return failedFolderPaths.filter((el) => el);
    }
  };

  const createNewFiles = async (...args) => {
    const filePaths = formatCommandLineArguments(...args);

    const failedFilePaths = await Promise.all(
      filePaths.map(async (filePath) => {
        try {
          await writeFileAsync(Path.join(currentPath, filePath));
        } catch (err) {
          return ``;
        }
      })
    );

    return failedFilePaths.filter((el) => el);
  };

  const readFiles = async (command, ...args) => {
    // this component only exist because terminal for some reason
    // won't render html elements except when they are returned from
    // a react component
    return (
      <FileContentsOutput
        command={command}
        currentPath={currentPath}
        args={args}
        readFileContent={readFileContent}
      />
    );
  };

  const killTasks = (...args) => {
    const tasks = formatCommandLineArguments(...args);

    return tasks
      .map((task) => {
        if (processes[task] && processes[task].running) {
          endProcess(task);
          return null;
        } else return `ERROR: The process ${task} not found.`;
      })
      .filter((el) => el);
  };

  const renameFiles = async (command, ...args) => {
    if (command === "rename") {
      const allNames = formatCommandLineArguments(...args);
      const oldNames = allNames.filter((el, i) => i % 2 === 0);
      const newNames = allNames.filter((el, i) => i % 2 !== 0);
      const failedRenames = await Promise.all(
        oldNames.map(async (oldName, i) => {
          const newName = newNames[i];
          if (newName) {
            try {
              await renameFSO(currentPath, { old: oldName, new: newName });
              return null;
            } catch (err) {
              console.log(err);
              return `The system cannot find the file specified.`;
            }
          } else {
            return `The syntax of the command is incorrect.`;
          }
        })
      );

      return failedRenames.filter((el) => el).map((el) => <div>{el}</div>);
    }

    const [oldPath, newPath] = formatCommandLineArguments(...args);

    try {
      await renameFSO(currentPath, { old: oldPath, new: newPath });
    } catch (err) {
      return `The system cannot find the file specified.`;
    }
  };

  const moveFiles = async (...args) => {
    const [origin, destination, ...rest] = formatCommandLineArguments(...args);
    if (rest.length)
      return "The system cannot find the file specified. Too many arguments.";
    if (origin && destination) {
      let destinationExists = false;
      try {
        destinationExists = await doesPathExist(
          Path.join(currentPath, destination)
        );
      } catch (err) {
        //do nothing
      }
      try {
        console.log(
          Path.join(currentPath, origin),
          Path.join(
            currentPath,
            destinationExists
              ? Path.join(destination, Path.basename(origin))
              : destination
          )
        );
        await moveFSO(
          Path.join(currentPath, origin),
          Path.join(
            currentPath,
            destinationExists
              ? Path.join(destination, Path.basename(origin))
              : destination
          )
        );
      } catch (err) {
        console.log(err);
        return err.errno === 34
          ? "The system cannot find the file specified."
          : "File already exists at destination";
      }
    } else return "The syntax of the command is incorrect.";
  };

  return (
    <Window
      process='Command Prompt'
      pid={pid}
      icon={icon}
      minWindowWidth='15rem'
      minWindowHeight='5rem'
      titleBar={{ color: "white", backgroundColor: "black" }}
    >
      <WindowContent flex flexDirection='column'>
        <div className='command-prompt-container'>
          <Terminal
            ref={terminal}
            commands={commands(
              terminal,
              currentPath,
              changePath,
              listFolderContents,
              endProcess,
              createNewFolders,
              deleteFolders,
              createNewFiles,
              readFiles,
              Object.keys(processes).filter(
                (process) => processes[process].running
              ),
              killTasks,
              renameFiles,
              moveFiles
            )}
            autofocus
            className='command-prompt'
            contentClassName='command-prompt-content'
            promptLabelClassName='command-prompt-label'
            inputClassName='command-prompt-input'
            messageClassName='command-prompt-message'
            welcomeMessage={`Microsoft Windows [Version 10.0.19044.1466]
          (c) Microsoft Corporation. All rights reserved.`}
            promptLabel={currentPath + ">"}
            errorText='[command] is not recognized as an internal or external command,
            operable program or batch file.'
          />
        </div>
      </WindowContent>
    </Window>
  );
};

export default CommandPrompt;
