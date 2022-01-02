import "./FileExplorerFolderContents.css";
import ColumnHeading from "./column-heading/ColumnHeading";
import FsoListItem from "./fso-list-item/FsoListItem";
import { useState, useEffect, useContext, useRef, useCallback } from "react";
import useWatchFolder from "../../../../hooks/useWatchFolder";
import remToPx from "../../../../helpers/remToPx";
import moment from "moment";
import { FileSystemContext } from "../../../../contexts/FileSystemContext";
import { WindowWidthContext } from "../../../../contexts/WindowWidthContext";
import { RightClickMenuContext } from "../../../../contexts/RightClickMenuContext";
import FolderContentsContextMenu from "../../../system/component-specific-context-menus/FolderContentsContextMenu";
import { path as Path } from "filer";

const FileExplorerFolderContents = ({
  changePath,
  path,
  width,
  setWidth,
  searchResults,
  setItemCount,
  setExpandBranches,
}) => {
  const { watch, getFolder, updateFSO, deleteFSO, createFSO, moveFSO } =
    useContext(FileSystemContext);
  const { windowWidth } = useContext(WindowWidthContext);
  const { renderOptions } = useContext(RightClickMenuContext);
  const windowWidthOnFirstRender = useRef(windowWidth);
  const [folderContent, setWatcherPath] = useWatchFolder(
    path,
    watch,
    getFolder,
    setItemCount
  );

  const [columnHeadingsWidth, setColumnHeadingsWidth] = useState({
    Name: "4.5rem",
    Location: "4.5rem",
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

  const handleRightClick = (e) =>
    renderOptions(
      e,
      <FolderContentsContextMenu path={path} createFSO={createFSO} />
    );

  const preventDefault = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    const dataTransfer = JSON.parse(e.dataTransfer.getData("json"));
    const dragObject = dataTransfer.dragObject;
    if (dataTransfer.origin === "Desktop") {
      moveFSO(
        Path.join(dragObject.path, dragObject.name),
        Path.join(path, dragObject.name)
      );
    }
  };

  const calcWidth = () => {
    let sum = 0;
    for (let [key, value] of Object.entries(columnHeadingsWidth)) {
      if (!searchResults.length && key === "Location");
      else typeof value !== "number" ? (sum += remToPx(value)) : (sum += value);
    }
    return sum;
  };

  useEffect(() => {
    setWatcherPath(path);
  }, [path]);

  useEffect(() => {
    if (windowWidthOnFirstRender.current === undefined) {
      setWidth(windowWidth - 150);
      windowWidthOnFirstRender.current = windowWidth;
    }
  }, [windowWidth]);

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
      onContextMenu={handleRightClick}
      onDragEnter={preventDefault}
      onDragOver={preventDefault}
      onDrop={handleDrop}
    >
      <div className='column-headings'>
        {Object.keys(columnHeadingsWidth).map((columnHeading) => (
          <ColumnHeading
            name={columnHeading}
            width={columnHeadingsWidth[columnHeading]}
            setColumnHeadingWidth={setColumnHeadingWidth}
            visible={
              columnHeading === "Location"
                ? searchResults.length > 0 && columnHeading === "Location"
                : true
            }
          />
        ))}
      </div>
      <div
        className='fso-list'
        style={{
          width: calcWidth(),
        }}
      >
        {[searchResults.length ? searchResults : folderContent][0].map(
          (fso, i) => {
            return (
              <FsoListItem
                key={fso.node}
                name={fso.name}
                dateModified={moment(fso.ctime).format("DD/MM/YYYY hh:mm a")}
                type={fso.type}
                size={fso.size}
                columnHeadingsWidth={columnHeadingsWidth}
                path={path}
                updateFSO={updateFSO}
                deleteFSO={deleteFSO}
                changePath={changePath}
                location={fso.path}
                moveFSO={moveFSO}
                setExpandBranches={setExpandBranches}
              />
            );
          }
        )}
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
