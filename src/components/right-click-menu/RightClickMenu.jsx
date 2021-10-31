import "./RightClickMenu.css";
import { useContext } from "react";

import { RightClickMenuContext } from "../../contexts/RightClickMenuContext";
import { FileSystemContext } from "../../contexts/FileSystemContext";
import RightClickMenuOption from "./right-click-menu-option/RightClickMenuOption";

const RightClickMenu = ({ width, height }) => {
  const { menuPosition, menuOptions, isMenuOpen, closeMenu } = useContext(
    RightClickMenuContext
  );
  const { x, y } = menuPosition;
  if (!isMenuOpen) return null;
  return (
    <div className='right-click-menu' style={{ top: y, left: x }}>
      {menuOptions.map((option) => (
        <RightClickMenuOption option={option} closeMenu={closeMenu} />
      ))}
    </div>
  );
};

export default RightClickMenu;
