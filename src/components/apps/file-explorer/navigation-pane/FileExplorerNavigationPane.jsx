import "./FileExplorerNavigationPane.css";
import { RiComputerFill } from "react-icons/ri";
import FolderNavigationBranch from "./folder-navigation-branch/FolderNavigationBranch";
import { useContext } from "react";
import { WindowWidthContext } from "../../../../contexts/WindowWidthContext";

const FileExplorerNavigationPane = ({
  changePath,
  basePath,
  currentPath,
  folderContentsWidth,
  expandBranches,
  setExpandBranches,
}) => {
  const { windowWidth } = useContext(WindowWidthContext);
  return (
    <div
      className='fx-navigation-pane'
      style={{ width: windowWidth - folderContentsWidth }}
    >
      <div className='folder-navigation-tree'>
        <FolderNavigationBranch
          branchName='This PC'
          icon={RiComputerFill}
          depth={1}
          basePath={basePath}
          currentPath={currentPath}
          width={windowWidth - folderContentsWidth}
          changePath={changePath}
          expandBranches={expandBranches}
          setExpandBranches={setExpandBranches}
          open
        />
      </div>
    </div>
  );
};

export default FileExplorerNavigationPane;
