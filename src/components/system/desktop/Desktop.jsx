import "./Desktop.css";
import { useContext, useState, useEffect } from "react";
import windows from "../../../assets/windows.jpg";
import { RightClickMenuContext } from "../../../contexts/RightClickMenuContext";
import { FileSystemContext } from "../../../contexts/FileSystemContext";
import useDesktopGrid from "../../../hooks/useDesktopGrid";
import DesktopIcon from "./desktop-icon/DesktopIcon";
import DesktopContextMenu from "../component-specific-context-menus/DesktopContextMenu";

const Desktop = ({ width, height, taskbarHeight }) => {
  const [view, setView] = useState("Medium icons");
  const [folderContent, setFolderContent] = useState([]);
  const origin = "/C/users/admin/Desktop/";
  const folderName = "Desktop";
  const wallpaper = windows;
  const { createFSO, getFolder } = useContext(FileSystemContext);
  const { renderOptions, closeMenu } = useContext(RightClickMenuContext);

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
        closeMenu={closeMenu}
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

  useEffect(() => {
    getFolder(origin, setFolderContent);
  }, [getFolder]);

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
      {folderContent?.map(({ name, type }) => (
        <DesktopIcon
          name={name}
          path={origin}
          type={type}
          gridPosition={grid[name]}
          updateGridItemName={updateGridItemName}
          deleteFromGrid={deleteFromGrid}
        />
      ))}
    </div>
  );
};

export default Desktop;
