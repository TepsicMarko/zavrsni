import "./CommandPrompt.css";
import Window from "../../system/window/Window";
import WindowContent from "../../system/window/window-content/WindowContent";
import { useRef, useState, useEffect, useContext } from "react";
import { FileSystemContext } from "../../../contexts/FileSystemContext";
import Terminal from "react-console-emulator";
import commands from "./commands";
import { path as Path } from "filer";
import DirectoryContentOutput from "./command-outputs/DirectoryContentOutput";

const CommandPrompt = ({ icon }) => {
  const { doesPathExist, getFolder } = useContext(FileSystemContext);
  const [path, setPath] = useState("/C/users/admin");
  const terminal = useRef(null);

  const changePath = async (folder) => {
    console.log(folder);
    if (!folder.includes('"') && folder.includes(" "))
      return "cd: too many arguments";

    const toManyArgs = folder.slice(folder.lastIndexOf('"')).includes(" ");
    if (toManyArgs) return "cd: too many arguments";

    const newPath = Path.join(path, folder.replaceAll('"', ""));
    const exists = await doesPathExist(newPath);
    if (exists) {
      setPath(newPath);
    } else {
      return "The system cannot find the path specified.";
    }
  };

  const listFolderContents = async (command, folder, ...args) => {
    if (command === "dir") {
      if (folder) {
        const toManyArgs = folder.slice(folder.lastIndexOf('"')).includes(" ");
        if (toManyArgs) return "too many arguments";
      }

      try {
        const folderContent = await getFolder(
          Path.join(path, folder ? folder.replaceAll('"', "") : "")
        );

        return (
          <DirectoryContentOutput
            command={command}
            folderContent={folderContent}
            folderName={Path.join(
              path,
              folder ? folder.replaceAll('"', "") : ""
            )}
          />
        );
      } catch (err) {
        console.log(err);
        return "File not found";
      }
    } else {
      if (folder) {
        args = [folder, ...args];
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
        console.log(folderPaths);

        let foldersContent = await Promise.all(
          folderPaths.map(async (folderPath) => {
            try {
              return await getFolder(Path.join(path, folderPath));
            } catch (err) {
              return `ls: cannot access ${folderPath}: No such file or directory`;
            }
          })
        );
        console.log(foldersContent);

        return foldersContent.map((folderContent, i) => (
          <DirectoryContentOutput
            command={command}
            folderName={Path.basename(folderPaths[i])}
            folderContent={folderContent}
          />
        ));
      } else {
        const folderContent = await getFolder(path);

        return (
          <DirectoryContentOutput
            command={command}
            folderContent={folderContent}
            folderName=''
          />
        );
      }
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
            commands={commands(path, changePath, listFolderContents)}
            autofocus
            className='command-prompt'
            contentClassName='command-prompt-content'
            promptLabelClassName='command-prompt-label'
            messageClassName='command-prompt-message'
            welcomeMessage={`Microsoft Windows [Version 10.0.19044.1466]
          (c) Microsoft Corporation. All rights reserved.`}
            promptLabel={path + ">"}
            errorText='[command] is not recognized as an internal or external command,
            operable program or batch file.'
          />
        </div>
      </WindowContent>
    </Window>
  );
};

export default CommandPrompt;
