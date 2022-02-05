import "./Desktop.css";
import { useContext, useState } from "react";
import windowsDefault from "../../../assets/windowsDefault.jpg";
import { RightClickMenuContext } from "../../../contexts/RightClickMenuContext";
import { FileSystemContext } from "../../../contexts/FileSystemContext";
import { ProcessesContext } from "../../../contexts/ProcessesContext";
import useDesktopGrid from "../../../hooks/useDesktopGrid";
import DesktopIcon from "./desktop-icon/DesktopIcon";
import DesktopContextMenu from "../component-specific-context-menus/DesktopContextMenu";
import useWatchFolder from "../../../hooks/useWatchFolder";
import { path as Path } from "filer";

const Desktop = ({ width, height, taskbarHeight }) => {
  const origin = "/C/users/admin/Desktop";
  const { createFSO, watch, getFolder, moveFSO } =
    useContext(FileSystemContext);
  const [view, setView] = useState("Medium icons");
  const [folderContent] = useWatchFolder(origin, watch, getFolder);
  const folderName = "Desktop";
  const wallpaper = windowsDefault;
  const { renderOptions } = useContext(RightClickMenuContext);
  const { startProcess } = useContext(ProcessesContext);

  const evalTaskbarHeight = () =>
    typeof taskbarHeight !== "number"
      ? parseInt(taskbarHeight) * 16
      : taskbarHeight < 48
      ? 48
      : taskbarHeight;

  const {
    grid,
    addToGrid,
    updateGridItemName,
    deleteFromGrid,
    calculateGridPosition,
  } = useDesktopGrid({
    maxRows: Math.floor(
      (document.documentElement.clientHeight - evalTaskbarHeight()) / 80 - 1
    ),
    maxColumns: Math.floor(document.documentElement.clientWidth / 68),
  });

  const handleRightClick = (e) => {
    const { clientX, clientY } = e;
    const mousePosition = { x: clientX, y: clientY };
    renderOptions(
      e,
      <DesktopContextMenu
        path={origin}
        createFSO={createFSO}
        addToGrid={addToGrid}
        calculateGridPosition={calculateGridPosition}
        mousePosition={mousePosition}
        view={view}
        setView={setView}
      />
    );
  };

  const getEntries = (items) => {
    let entries = [];
    for (let i = 0; i < items.length; i++) {
      entries.push(items[i].webkitGetAsEntry());
    }

    return entries;
  };

  const handleDrop = (e) => {
    if (!e.dataTransfer.files.length) {
      e.preventDefault();
      const dataTransfer = JSON.parse(e.dataTransfer.getData("json"));
      console.log(dataTransfer);
      const { name, type, path } = dataTransfer.dragObject;
      if (dataTransfer.origin === "Desktop") {
        addToGrid(
          name,
          calculateGridPosition({ x: e.clientX, y: e.clientY }),
          true
        );
      } else {
        moveFSO(Path.join(path, name), Path.join(origin, name));
      }
    } else {
      e.preventDefault();
      console.log(e.dataTransfer.items);
      startProcess("File Transfer Dialog", {
        entries: getEntries(e.dataTransfer.items),
        dropPath: origin,
      });
    }
  };
  const preventDefault = (e) => e.preventDefault();

  return (
    <div
      className='desktop'
      onContextMenu={handleRightClick}
      style={{
        backgroundImage: `url(${wallpaper})`,
        width: `calc(${width})`,
        height: `calc(${height})`,
        gridTemplateColumns: `repeat(${Math.floor(
          document.documentElement.clientWidth / 68
        )}, 4.25rem)`,
        gridTemplateRows: `repeat(${Math.floor(
          (document.documentElement.clientHeight - evalTaskbarHeight()) / 80 - 1
        )}, 5rem)`,
      }}
      onDragEnter={preventDefault}
      onDragOver={preventDefault}
      onDrop={handleDrop}
    >
      {folderContent.map(({ name, type }) => (
        <DesktopIcon
          name={name}
          path={origin}
          type={type.toLowerCase()}
          gridPosition={grid[name]}
          updateGridItemName={updateGridItemName}
          deleteFromGrid={deleteFromGrid}
          startProcess={startProcess}
        />
      ))}
    </div>
  );
};

export default Desktop;
