import "./FileExplorerNavigationPane.css";
import { RiComputerFill } from "react-icons/ri";
import FolderNavigationBranch from "./folder-navigation-branch/FolderNavigationBranch";
import { useContext } from "react";
import { WindowDimensionsContext } from "../../../../contexts/WindowDimensionsContext";

const FileExplorerNavigationPane = ({
  changePath,
  basePath,
  currentPath,
  folderContentsWidth,
  expandBranches,
  setExpandBranches,
}) => {
  const { windowDimensions } = useContext(WindowDimensionsContext);
  return (
    <div
      className='fx-navigation-pane'
      style={{ width: windowDimensions.width - folderContentsWidth }}
    >
      <div className='folder-navigation-tree'>
        <FolderNavigationBranch
          branchName='This PC'
          icon={RiComputerFill}
          depth={1}
          basePath={basePath}
          currentPath={currentPath}
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
