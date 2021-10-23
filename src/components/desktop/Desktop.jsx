import "./Desktop.css";

import { useState } from "react";
import windows from "../../assets/windows.jpg";

const Desktop = ({ width, height }) => {
  const [wallpaper, setWallpaper] = useState(windows);
  return (
    <div
      className='desktop'
      style={{
        backgroundImage: `url(${wallpaper})`,
        width: `calc(${width})`,
        height: `calc(${height})`,
      }}
    ></div>
  );
};

export default Desktop;

/* trebam napravit useWindowsSettings context tak da mogu
 * u postavkama mijenjat stvari koje se odnose na vise
 * komponenata. npr sta ak korinisk promjeni boju za taskbar
 * ta boja onda treba bit primjenjena i na drugim djelovima
 * aplikacije
 */
