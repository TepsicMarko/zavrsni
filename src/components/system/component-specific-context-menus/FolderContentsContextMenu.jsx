import ContextMenuItem from "../context-menu/context-menu-item/ContextMenuItem";
import { useState } from "react";

const FolderContentsContextMenu = ({ path, createFSO, closeMenu }) => {
  const [openSubmenu, setOpenSubmenu] = useState("");
  const [view, setView] = useState("Medium icons");
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
        {[
          { name: "New Folder", type: "directory" },
          { name: "New Shortcut", type: "lnk" },
          { name: "New Text Document", type: "txt" },
        ].map(({ name, type }) => (
          <ContextMenuItem
            name={name}
            onClick={() => {
              createFSO(path, name, type);
            }}
            closeMenu={closeMenu}
          />
        ))}
      </ContextMenuItem>
    </>
  );
};

export default FolderContentsContextMenu;
