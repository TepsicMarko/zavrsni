import "./FileExplorerNavigationPane.css";
import remToPx from "../../../../helpers/remToPx";
import { useContext, useState, useEffect } from "react";
import { FileSystemContext } from "../../../../contexts/FileSystemContext";
import { RiComputerFill } from "react-icons/ri";
import FolderNavigationBranch from "./folder-navigation-branch/FolderNavigationBranch";

const FileExplorerNavigationPane = () => {
  const [width, setWidth] = useState(remToPx("5rem"));
  const { getFolder } = useContext(FileSystemContext);

  const handleResizeStart = (e) => {
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  };

  const handleResize = (e) => {
    const { offsetX } = e.nativeEvent;
    const newWidth = width + offsetX;
    setWidth(newWidth > 0 ? newWidth : width);
  };

  useEffect(() => {
    console.log("rerender");
  });

  return (
    <div className='fx-navigation-pane' style={{ width }}>
      <div className='folder-navigation-tree'>
        <FolderNavigationBranch
          branchName='This PC'
          childFolders={getFolder("C\\users\\admin")}
          icon={RiComputerFill}
          depth={1}
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
