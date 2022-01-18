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
import formatCommandLineArguments from "../../../helpers/formatCommandLineArgumnets";

const CommandPrompt = ({ icon }) => {
  const {
    doesPathExist,
    getFolder,
    mkdirAsync,
    deleteFSO,
    writeFileAsync,
    readFileContent,
  } = useContext(FileSystemContext);
  const { endProcess } = useContext(ProcessesContext);
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

  const readFiles = async (...args) => {
    // this component only exist because terminal for some reason
    // won't render html elements except when they are returned from
    // a react component
    return (
      <FileContentsOutput
        currentPath={currentPath}
        args={args}
        readFileContent={readFileContent}
      />
    );
  };

  return (
    <Window
      app='Command Prompt'
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
              readFiles
            )}
            autofocus
            className='command-prompt'
            contentClassName='command-prompt-content'
            promptLabelClassName='command-prompt-label'
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
