import "./ContextMenu.css";
import { useContext, useEffect } from "react";
import { RightClickMenuContext } from "../../../contexts/RightClickMenuContext";
import { cloneElement } from "react";

const ContextMenu = ({ width, height }) => {
  const { menuPosition, menuOptions, isMenuOpen, closeMenu } = useContext(
    RightClickMenuContext
  );
  const { x, y } = menuPosition;
  const stopPropagation = (e) => e.stopPropagation();

  useEffect(() => {
    const eventHandler = () => closeMenu();
    document.addEventListener("mousedown", eventHandler);
    return () => document.removeEventListener("mousedown", eventHandler);
  }, []);

  return (
    isMenuOpen && (
      <div
        className='context-menu'
        style={{ top: y, left: x }}
        onMouseDown={stopPropagation}
      >
        {cloneElement(menuOptions, { closeMenu })}
      </div>
    )
  );
};

export default ContextMenu;
