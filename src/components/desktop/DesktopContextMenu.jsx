import ContextMenuItem from "../context-menu/context-menu-item/ContextMenuItem";
import { useState } from "react";

const DesktopContextMenu = ({
  path,
  createFSO,
  addToGrid,
  calculateGridPosition,
  mousePosition,
  closeMenu,
  view,
  setView,
}) => {
  const [openSubmenu, setOpenSubmenu] = useState("");
  const handleClick = (name) => setOpenSubmenu(name);
  return (
    <>
      <ContextMenuItem
        name='View'
        openSubmenu={openSubmenu === "View"}
        onClick={handleClick}
      >
        {["Large", "Medium", "Small"].map((el) => (
          <ContextMenuItem
            name={el + " icons"}
            onClick={() => {
              setView(el + " icons");
            }}
            radio
            active={view === el + " icons"}
            closeMenu={closeMenu}
          />
        ))}
      </ContextMenuItem>
      <ContextMenuItem
        name='New'
        openSubmenu={openSubmenu === "New"}
        onClick={handleClick}
      >
        {["Folder", "Shortcut", "Text Document"].map((el) => (
          <ContextMenuItem
            name={el}
            onClick={() => {
              createFSO(el, `New ${el}`, path);
              addToGrid(`New ${el}`, calculateGridPosition(mousePosition));
            }}
            closeMenu={closeMenu}
          />
        ))}
      </ContextMenuItem>
    </>
  );
};

export default DesktopContextMenu;
