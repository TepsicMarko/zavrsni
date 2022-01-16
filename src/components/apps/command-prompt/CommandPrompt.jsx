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

  const listFolderContents = async (command, folder) => {
    const folderContent = await getFolder(
      folder ? Path.join(path, folder) : path
    );
    return <DirectoryContentOutput folderContent={folderContent} />;
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
