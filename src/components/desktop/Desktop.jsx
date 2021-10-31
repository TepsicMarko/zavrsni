import "./Desktop.css";

import { useState, useContext } from "react";
import windows from "../../assets/windows.jpg";
import { RightClickMenuContext } from "../../contexts/RightClickMenuContext";
import { FileSystemContext } from "../../contexts/FileSystemContext";
import DesktopIcon from "./desktop-icon/DesktopIcon";

const Desktop = ({ width, height }) => {
  const [wallpaper, setWallpaper] = useState(windows);
  const { fs, create } = useContext(FileSystemContext);
  const { renderOptions } = useContext(RightClickMenuContext);
  const location = "C.users.default.Desktop";
  const handleRightClick = (e) => {
    e.preventDefault();
    const { clientX, clientY } = e;
    renderOptions({ x: clientX, y: clientY }, [
      {
        name: "New",
        submenu: [
          {
            name: "Folder",
            handler: () => create("Folder", "New Folder", location),
          },
        ],
      },
    ]);
  };

  const renderObj = (obj) => {
    let res = [];
    for (let key in obj) {
      const data = obj[key];
      res.push(<DesktopIcon name={key} isFolder={data.data} />);
    }
    return res;
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
      {renderObj(eval(`fs.${location}`))}
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
