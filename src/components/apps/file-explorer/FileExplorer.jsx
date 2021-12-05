import "./FileExplorer.css";
import Window from "../../system/window/Window";
import TitleBar from "../../system/window/title-bar/TitleBar";
import WindowContent from "../../system/window/window-content/WindowContent";
import StatusBar from "../../system/window/status-bar/StatusBar";
import FileExplorerNavbar from "./navbar/FileExplorerNavbar";
import FileExplorerRibbon from "./ribbon/FileExplorerRibbon";
import { FcFolder } from "react-icons/fc";
import { useState } from "react";
import FileExplorerNavigationBar from "./navigation-bar/FileExplorerNavigationBar";
import FileExplorerNavigationPane from "./navigation-pane/FileExplorerNavigationPane";
import FileExplorerFolderContents from "./folder-contents/FileExplorerFolderContents";

const NavigationPaneAndFoldercontentsContaioner = ({
  windowWidth,
  path,
  changePath,
  width,
  setWidth,
}) => (
  <div className='navigation-pane-and-folder-contents-container'>
    <FileExplorerNavigationPane
      changePath={changePath}
      path={"/C/users/admin"}
      windowWidth={windowWidth}
      folderContentsWidth={width}
    />
    <FileExplorerFolderContents
      windowWidth={windowWidth}
      changePath={changePath}
      path={path}
      width={width}
      setWidth={setWidth}
    />
  </div>
);

const FileExplorer = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [path, setPath] = useState("/C/users/admin");
  const changeTab = (e) => setActiveTab(e.target.textContent);
  const [width, setWidth] = useState();

  const changePath = (path) => {
    setPath(path);
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
        <NavigationPaneAndFoldercontentsContaioner
          changePath={changePath}
          path={path}
          width={width}
          setWidth={setWidth}
        />
      </WindowContent>
      <StatusBar backgroundColor='#2e2e2e'></StatusBar>
    </Window>
  );
};

export default FileExplorer;
