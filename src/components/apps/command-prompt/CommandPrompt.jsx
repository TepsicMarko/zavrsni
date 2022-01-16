import "./CommandPrompt.css";
import Window from "../../system/window/Window";
import WindowContent from "../../system/window/window-content/WindowContent";
import { useRef, useState, useEffect, useContext } from "react";
import { FileSystemContext } from "../../../contexts/FileSystemContext";
import Terminal from "react-console-emulator";
import commands from "./commands";
import { path as Path } from "filer";
import moment from "moment";

const CommandPrompt = ({ icon }) => {
  const { doesPathExist, getFolder } = useContext(FileSystemContext);
  const [path, setPath] = useState("/C/users/admin");
  const terminal = useRef(null);

  const changePath = async (folder) => {
    const newPath = Path.join(path, folder);
    const exists = await doesPathExist(newPath);
    if (exists) {
      setPath(newPath);
    } else {
      return "The system cannot find the path specified.";
    }
  };

  const listFolderContents = async () => {
    const folderContent = await getFolder(path);
    return (
      <div>
        {folderContent.map((fso) => (
          <div key={fso.node}>
            <span>{moment(fso.mtime).format("MM/DD/yy")}</span>
            <span> {moment(fso.mtime).format("hh:mm A")}</span>
            <span>
              {" "}
              {fso.type === "DIRECTORY"
                ? "<" + fso.type.substring(0, 3) + ">"
                : fso.size}
            </span>
            <span> {fso.name}</span>
          </div>
        ))}
      </div>
    );
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
