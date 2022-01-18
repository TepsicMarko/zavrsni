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

const CommandPrompt = ({ icon }) => {
  const { doesPathExist, getFolder, mkdirAsync } =
    useContext(FileSystemContext);
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

  const createNewFolders = async (...args) => {
    if (args.length === 1) {
      try {
        await mkdirAsync(Path.join(currentPath, args[0]));
        return null;
      } catch (err) {
        return `mkdir: cannot create directory '${args[0]}': File exists`;
      }
    }
    if (args.length > 1) {
      let folderPaths = [];

      for (let i = 0; i < args.length; i++) {
        if (args[i].includes('"')) {
          const folderPath = `${args[i]} ${args[i + 1]}`;
          folderPaths.push(folderPath.replaceAll('"', ""));
          i++;
        } else {
          folderPaths.push(args[i]);
        }
      }

      const failedFolderPaths = await Promise.all(
        folderPaths.map(async (folderPath) => {
          try {
            await mkdirAsync(Path.join(currentPath, folderPath));
          } catch (err) {
            console.log(err);
            return `mkdir: cannot create directory '${folderPath}': File exists`;
          }
        })
      );

      console.log(
        failedFolderPaths,
        failedFolderPaths.filter((el) => el)
      );
      return failedFolderPaths.filter((el) => el);
    }
  };

  useEffect(() => {
    console.log(terminal.current);
  }, [terminal]);
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
              createNewFolders
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
