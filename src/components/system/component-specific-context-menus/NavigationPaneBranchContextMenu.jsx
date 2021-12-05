import ContextMenuItem from "../context-menu/context-menu-item/ContextMenuItem";
import { useState } from "react";

const NavigationPaneBranchContextMenu = ({
  name,
  createPath,
  deletePath,
  deleteFSO,
  createFSO,
  isOpen,
  toggleOpen,
  closeMenu,
  focusInput,
}) => {
  const [openSubmenu, setOpenSubmenu] = useState("");
  const handleClick = (name) => setOpenSubmenu(name);

  const createNewFolder = () => {
    createFSO(createPath, "New Folder", "directory");
  };

  const deleteFolder = () => {
    deleteFSO(deletePath, name, "directory");
  };

  return (
    <>
      <ContextMenuItem
        name={isOpen ? "Collapse" : "Expand"}
        onClick={toggleOpen}
        closeMenu={closeMenu}
      />
      <ContextMenuItem
        name='Delete'
        onClick={deleteFolder}
        closeMenu={closeMenu}
      />
      <ContextMenuItem
        name='Rename'
        onClick={focusInput}
        closeMenu={closeMenu}
      />
      <ContextMenuItem
        name='New'
        openSubmenu={openSubmenu === "New"}
        onClick={handleClick}
      >
        <ContextMenuItem
          name='Folder'
          onClick={createNewFolder}
          closeMenu={closeMenu}
        />
      </ContextMenuItem>
    </>
  );
};

export default NavigationPaneBranchContextMenu;
