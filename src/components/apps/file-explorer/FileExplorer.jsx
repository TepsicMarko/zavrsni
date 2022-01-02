import "./FileExplorer.css";
import Window from "../../system/window/Window";
import WindowContent from "../../system/window/window-content/WindowContent";
import StatusBar from "../../system/window/status-bar/StatusBar";
import FileExplorerNavbar from "./navbar/FileExplorerNavbar";
import FileExplorerRibbon from "./ribbon/FileExplorerRibbon";
import { FcFolder } from "react-icons/fc";
import { useState, useCallback, useEffect } from "react";
import FileExplorerNavigationBar from "./navigation-bar/FileExplorerNavigationBar";
import FileExplorerNavigationPane from "./navigation-pane/FileExplorerNavigationPane";
import FileExplorerFolderContents from "./folder-contents/FileExplorerFolderContents";
import { WindowWidthProvider } from "../../../contexts/WindowWidthContext";

const FileExplorer = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [path, setPath] = useState("/C/users/admin");
  const [width, setWidth] = useState();
  const [searchResults, setSearchResults] = useState([]);
  const [itemCount, setItemCount] = useState("");
  const [expandBranches, setExpandBranches] = useState(false);

  const changeTab = (e) => setActiveTab(e.target.textContent);

  const changePath = useCallback(
    (path) => {
      setPath(path);
    },
    [path]
  );

  return (
    <WindowWidthProvider>
      <Window
        app='File Explorer'
        icon={<FcFolder />}
        minWindowWidth='14rem'
        minWindowHeight='16rem'
        titleBar={{ color: "white", backgroundColor: "black" }}
      >
        <WindowContent backgroundColor='#202020' flex flexDirection='row'>
          <FileExplorerNavbar activeTab={activeTab} changeTab={changeTab} />
          <FileExplorerRibbon activeTab={activeTab} />
          <FileExplorerNavigationBar
            path={path}
            setPath={changePath}
            changePath={changePath}
            setSearchResults={setSearchResults}
            setExpandBranches={setExpandBranches}
          />
          <div className='navigation-pane-and-folder-contents-container'>
            <FileExplorerNavigationPane
              changePath={changePath}
              basePath='/C/users/admin'
              currentPath={path}
              folderContentsWidth={width}
              expandBranches={expandBranches}
              setExpandBranches={setExpandBranches}
            />
            <FileExplorerFolderContents
              changePath={changePath}
              path={path}
              width={width}
              setWidth={setWidth}
              searchResults={searchResults}
              setItemCount={setItemCount}
              setExpandBranches={setExpandBranches}
            />
          </div>
        </WindowContent>
        <StatusBar backgroundColor='#2e2e2e' color='#DEDEDE' flex>
          <div className='item-count'>{itemCount}</div>
        </StatusBar>
      </Window>
    </WindowWidthProvider>
  );
};

export default FileExplorer;
