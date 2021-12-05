import "./FileExplorerNavigationPane.css";
import { RiComputerFill } from "react-icons/ri";
import FolderNavigationBranch from "./folder-navigation-branch/FolderNavigationBranch";

const FileExplorerNavigationPane = ({
  changePath,
  path,
  folderContentsWidth,
  windowWidth,
}) => {
  return (
    <div
      className='fx-navigation-pane'
      style={{ width: `calc(100% - ${folderContentsWidth})` }}
    >
      <div className='folder-navigation-tree'>
        <FolderNavigationBranch
          branchName='This PC'
          icon={RiComputerFill}
          depth={1}
          path={path}
          width={windowWidth - folderContentsWidth}
          changePath={changePath}
          open
        />
      </div>
    </div>
  );
};

export default FileExplorerNavigationPane;
