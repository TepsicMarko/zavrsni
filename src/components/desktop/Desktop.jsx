import "./Desktop.css";
import { useContext } from "react";
import windows from "../../assets/windows.jpg";
import { RightClickMenuContext } from "../../contexts/RightClickMenuContext";
import { FileSystemContext } from "../../contexts/FileSystemContext";
import useDesktopGrid from "../../hooks/useDesktopGrid";
import DesktopIcon from "./desktop-icon/DesktopIcon";

const Desktop = ({ width, height, taskbarHeight }) => {
  const origin = "C\\users\\admin\\Desktop";
  const wallpaper = windows;
  const { createFSO, getFSO } = useContext(FileSystemContext);
  const { renderOptions } = useContext(RightClickMenuContext);

  const evalTaskbarHeight = () =>
    typeof taskbarHeight !== "number"
      ? parseInt(taskbarHeight) * 16
      : taskbarHeight < 48
      ? 48
      : taskbarHeight;

  const { grid, addToGrid, calculateGridPosition } = useDesktopGrid({
    maxRows: Math.floor(
      (document.documentElement.clientHeight - evalTaskbarHeight()) / 80 - 1
    ),
    maxColumns: Math.floor(document.documentElement.clientWidth / 68),
  });

  const handleRightClick = (e) => {
    e.preventDefault();
    const { clientX, clientY } = e;
    const mousePosition = { x: clientX, y: clientY };
    renderOptions(mousePosition, [
      {
        name: "New",
        submenu: [
          {
            name: "Folder",
            handler: () => {
              createFSO("Folder", "New Folder", origin);
              addToGrid("New Folder", calculateGridPosition(mousePosition));
            },
          },
          ...["Shortcut", "Text Document"].map((option) => {
            return {
              name: option,
              handler: () => {
                createFSO(option, "New " + option, origin);
                addToGrid(
                  "New " + option,
                  calculateGridPosition(mousePosition)
                );
              },
            };
          }),
        ],
      },
    ]);
  };

  const renderFSO = () => {
    const fileSystemObjects = getFSO(origin);
    let fsoArray = [];
    for (let fso in fileSystemObjects) {
      const fsoData = fileSystemObjects[fso];
      fsoArray.push(
        <DesktopIcon
          name={fso}
          path={origin}
          isTextDocument={fsoData.content !== undefined}
          isShortcut={fsoData.pathTo !== undefined}
          gridPosition={grid[fso]}
        />
      );
    }
    return fsoArray;
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
      {renderFSO()}
    </div>
  );
};

export default Desktop;
