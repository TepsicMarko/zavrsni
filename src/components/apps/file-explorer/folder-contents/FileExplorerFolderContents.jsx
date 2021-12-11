import "./FileExplorerFolderContents.css";
import ColumnHeading from "./column-heading/ColumnHeading";
import FsoListItem from "./fso-list-item/FsoListItem";
import { useState, useEffect, useContext, useRef, useCallback } from "react";
import useWatchFolder from "../../../../hooks/useWatchFolder";
import remToPx from "../../../../helpers/remToPx";
import moment from "moment";
import { FileSystemContext } from "../../../../contexts/FileSystemContext";
import { WindowWidthContext } from "../../../../contexts/WindowWidthContext";

const FileExplorerFolderContents = ({ changePath, path, width, setWidth }) => {
  const { watch, getFolder } = useContext(FileSystemContext);
  const { windowWidth } = useContext(WindowWidthContext);

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
  const [minWidth, setMinWidth] = useState(remToPx("6rem"));

  const folderContentsRef = useRef(null);
  const previousWindowWidthRef = useRef(windowWidth);

  const setColumnHeadingWidth = useCallback(
    (name, width) => {
      setColumnHeadingsWidth({ ...columnHeadingsWidth, [name]: width });
    },
    [columnHeadingsWidth]
  );

  const handleResizeStart = (e) => {
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  };

  const handleResize = (e) => {
    const { offsetX } = e.nativeEvent;
    const newWidth = width - offsetX;
    const maxWidth = windowWidth - remToPx("3.5rem");

    setWidth(
      newWidth >= maxWidth
        ? maxWidth
        : newWidth >= minWidth
        ? newWidth
        : minWidth
    );
  };

  useEffect(() => {
    setWatcherPath(path);
  }, [path]);

  useEffect(() => {
    setWidth(folderContentsRef.current.clientWidth);
  }, []);

  useEffect(() => {
    const maxWidth = windowWidth - remToPx("3.5rem");
    const windowWidthDiff = windowWidth - previousWindowWidthRef.current;
    const newWidth = width + windowWidthDiff;
    if (width + windowWidthDiff > minWidth && newWidth <= maxWidth)
      setWidth(width + windowWidthDiff);
    previousWindowWidthRef.current = windowWidth;
  }, [windowWidth]);

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
