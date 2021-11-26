import "./FileExplorer.css";
import Window from "../../system/window/Window";
import TitleBar from "../../system/window/title-bar/TitleBar";
import WindowContent from "../../system/window/window-content/WindowContent";
import StatusBar from "../../system/window/status-bar/StatusBar";
import FileExplorerNavbar from "./navbar/FileExplorerNavbar";
import FileExplorerRibbon from "./ribbon/FileExplorerRibbon";
import { FcFolder } from "react-icons/fc";
import { useState, useContext } from "react";
import FileExplorerNavigationBar from "./navigation-bar/FileExplorerNavigationBar";
import FileExplorerNavigationPane from "./navigation-pane/FileExplorerNavigationPane";
import FileExplorerFolderContents from "./folder-contents/FileExplorerFolderContents";
import { FileSystemContext } from "../../../contexts/FileSystemContext";
import { VscDebugConsole } from "react-icons/vsc";

const FileExplorer = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [path, setPath] = useState("C\\users\\admin");
  const { getFolder } = useContext(FileSystemContext);
  const changeTab = (e) => setActiveTab(e.target.textContent);

  const changePath = (folderPath, folderName) => {
    setPath(
      `${folderPath}${folderName === "This PC" ? "\\admin" : `\\${folderName}`}`
    );
  };

  return (
    <Window
      app='File Explorer'
      icon={<FcFolder />}
      minWidth='14rem'
      minHeight='16rem'
    >
      <TitleBar backgroundColor='black' color='white' />
      <WindowContent backgroundColor='#202020' flex flexDirection='row'>
        <FileExplorerNavbar activeTab={activeTab} changeTab={changeTab} />
        <FileExplorerRibbon activeTab={activeTab} />
        <FileExplorerNavigationBar />
        <FileExplorerNavigationPane
          changePath={changePath}
          childFolders={getFolder("C\\users\\admin")}
          path={"C\\users"}
        />
        <FileExplorerFolderContents
          changePath={changePath}
          folderContent={getFolder(path)}
          path={path}
        />
      </WindowContent>
      <StatusBar backgroundColor='#2e2e2e'></StatusBar>
    </Window>
  );
};

export default FileExplorer;
