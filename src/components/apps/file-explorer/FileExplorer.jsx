import "./FileExplorer.css";
import Window from "../../system/window/Window";
import TitleBar from "../../system/window/title-bar/TitleBar";
import WindowContent from "../../system/window/window-content/WindowContent";
import StatusBar from "../../system/window/status-bar/StatusBar";
import FileExplorerNavbar from "./navbar/FileExplorerNavbar";
import FileExplorerRibbon from "./ribbon/FileExplorerRibbon";
import { FcFolder } from "react-icons/fc";
import { useState } from "react";

const FileExplorer = () => {
  const [activeTab, setActiveTab] = useState("Home");

  const changeTab = (e) => setActiveTab(e.target.textContent);

  return (
    <Window
      app='File Explorer'
      icon={<FcFolder />}
      minWidth='14rem'
      minHeight='16rem'
    >
      <TitleBar backgroundColor='black' color='white' />
      <WindowContent backgroundColor='#202020'>
        <FileExplorerNavbar activeTab={activeTab} changeTab={changeTab} />
        <FileExplorerRibbon activeTab={activeTab} />
      </WindowContent>
      <StatusBar backgroundColor='#2e2e2e'></StatusBar>
    </Window>
  );
};

export default FileExplorer;
