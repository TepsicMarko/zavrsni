import "./FileExplorerNavigationPane.css";
import remToPx from "../../../../helpers/remToPx";
import { useState } from "react";
import { RiComputerFill } from "react-icons/ri";
import FolderNavigationBranch from "./folder-navigation-branch/FolderNavigationBranch";

const FileExplorerNavigationPane = ({ changePath, childFolders, path }) => {
  const [width, setWidth] = useState(remToPx("5rem"));
  const handleResizeStart = (e) => {
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  };

  const handleResize = (e) => {
    const { offsetX } = e.nativeEvent;
    const newWidth = width + offsetX;
    setWidth(newWidth > 0 ? newWidth : width);
  };

  return (
    <div className='fx-navigation-pane' style={{ width }}>
      <div className='folder-navigation-tree'>
        <FolderNavigationBranch
          branchName='This PC'
          childFolders={childFolders}
          changePath={changePath}
          icon={RiComputerFill}
          depth={1}
          path={path}
          open
        />
      </div>
      <div
        draggable
        onDragStart={handleResizeStart}
        onDrag={handleResize}
        onDragEnd={handleResize}
        className='navigation-pane-resize'
      ></div>
    </div>
  );
};

export default FileExplorerNavigationPane;
