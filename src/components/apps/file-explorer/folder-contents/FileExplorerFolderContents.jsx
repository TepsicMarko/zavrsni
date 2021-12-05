import "./FileExplorerFolderContents.css";
import ColumnHeading from "./column-heading/ColumnHeading";
import FsoListItem from "./fso-list-item/FsoListItem";
import { useState, useEffect, useContext, useRef } from "react";
import useWatchFolder from "../../../../hooks/useWatchFolder";
import remToPx from "../../../../helpers/remToPx";
import moment from "moment";
import { FileSystemContext } from "../../../../contexts/FileSystemContext";

const FileExplorerFolderContents = ({ changePath, path, width, setWidth }) => {
  const { watch, getFolder } = useContext(FileSystemContext);
  const [folderContent, setWatcherPath] = useWatchFolder(
    path,
    watch,
    getFolder
  );
  const [columnHeadingsWidth, setColumnHeadingsWidth] = useState({
    Name: "4.5rem",
    "Date Modified": "4.5rem",
    Type: "4.5rem",
    Size: "4.5rem",
  });
  const [minWidth, setMinWidth] = useState(remToPx("1rem"));
  const folderContentsRef = useRef(null);

  const setColumnHeadingWidth = (name, width) => {
    setColumnHeadingsWidth({ ...columnHeadingsWidth, [name]: width });
  };

  const handleResizeStart = (e) => {
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  };

  const handleResize = (e) => {
    const { offsetX } = e.nativeEvent;
    const newWidth = width - offsetX;
    setWidth(newWidth >= minWidth ? newWidth : minWidth);
  };

  useEffect(() => {
    setWatcherPath(path);
  }, [path]);

  useEffect(() => {
    setWidth(folderContentsRef.current.clientWidth);
  }, []);

  return (
    <div
      ref={folderContentsRef}
      className='fx-folder-contents'
      style={{ width }}
    >
      <div className='column-headings'>
        {Object.keys(columnHeadingsWidth).map((columnHeading) => (
          <ColumnHeading
            name={columnHeading}
            width={columnHeadingsWidth[columnHeading]}
            setColumnHeadingWidth={setColumnHeadingWidth}
          />
        ))}
      </div>
      <div className='fso-list'>
        {folderContent.map((fso) => {
          return (
            <FsoListItem
              name={fso.name}
              dateModified={moment(fso.ctime).format("DD/MM/YYYY hh:mm a")}
              type={fso.type}
              size={fso.size}
              columnHeadingsWidth={columnHeadingsWidth}
            />
          );
        })}
      </div>
      <div
        draggable
        onDragStart={handleResizeStart}
        onDrag={handleResize}
        onDragEnd={handleResize}
        className='folder-contents-resize'
      ></div>
    </div>
  );
};

export default FileExplorerFolderContents;
