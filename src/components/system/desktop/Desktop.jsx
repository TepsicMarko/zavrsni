import "./Desktop.css";
import { useContext, useState } from "react";
import windows from "../../../assets/windows.jpg";
import { RightClickMenuContext } from "../../../contexts/RightClickMenuContext";
import { FileSystemContext } from "../../../contexts/FileSystemContext";
import useDesktopGrid from "../../../hooks/useDesktopGrid";
import DesktopIcon from "./desktop-icon/DesktopIcon";
import DesktopContextMenu from "../component-specific-context-menus/DesktopContextMenu";
import useWatchFolder from "../../../hooks/useWatchFolder";

const Desktop = ({ width, height, taskbarHeight }) => {
  const origin = "/C/users/admin/Desktop";
  const { createFSO, watch, getFolder } = useContext(FileSystemContext);
  const [view, setView] = useState("Medium icons");
  const [folderContent] = useWatchFolder(origin, watch, getFolder);
  const folderName = "Desktop";
  const wallpaper = windows;
  const { renderOptions } = useContext(RightClickMenuContext);

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
    e.preventDefault();
    const { clientX, clientY } = e;
    const mousePosition = { x: clientX, y: clientY };
    renderOptions(
      mousePosition,
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

  const handleDrop = (e) => {
    e.preventDefault();
    const name = e.dataTransfer.getData("text");
    addToGrid(
      name,
      calculateGridPosition({ x: e.clientX, y: e.clientY }),
      true
    );
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
        />
      ))}
    </div>
  );
};

export default Desktop;
