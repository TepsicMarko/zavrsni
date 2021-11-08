import "./Desktop.css";

import { useState, useContext } from "react";
import windows from "../../assets/windows.jpg";
import { RightClickMenuContext } from "../../contexts/RightClickMenuContext";
import { FileSystemContext } from "../../contexts/FileSystemContext";
import DesktopIcon from "./desktop-icon/DesktopIcon";

const Desktop = ({ width, height }) => {
  const wallpaper = windows;
  const { createFSO, getFSO } = useContext(FileSystemContext);
  const { renderOptions } = useContext(RightClickMenuContext);
  const origin = "C\\users\\admin\\Desktop";
  const handleRightClick = (e) => {
    e.preventDefault();
    const { clientX, clientY } = e;
    renderOptions({ x: clientX, y: clientY }, [
      {
        name: "New",
        submenu: [
          {
            name: "Folder",
            handler: () => createFSO("Folder", "New Folder", origin),
          },
          ...["Shortcut", "Text Document"].map((option) => {
            return {
              name: option,
              handler: () => createFSO(option, "New " + option, origin),
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
        />
      );
    }
    return fsoArray;
  };

  return (
    <div
      className='desktop'
      onContextMenu={handleRightClick}
      style={{
        backgroundImage: `url(${wallpaper})`,
        width: `calc(${width})`,
        height: `calc(${height})`,
      }}
    >
      {renderFSO()}
    </div>
  );
};

export default Desktop;

/* trebam napravit useWindowsSettings context tak da mogu
 * u postavkama mijenjat stvari koje se odnose na vise
 * komponenata. npr sta ak korinisk promjeni boju za taskbar
 * ta boja onda treba bit primjenjena i na drugim djelovima
 * aplikacije
 */
