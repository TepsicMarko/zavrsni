import ContextMenuItem from "../context-menu/context-menu-item/ContextMenuItem";
import { useState } from "react";

const FsoListItemContextMenu = ({
  name,
  path,
  deleteFSO,
  toggleOpen,
  closeMenu,
  focusInput,
  changePath,
  type,
  Path,
}) => {
  // const [openSubmenu, setOpenSubmenu] = useState("");
  // const handleClick = (name) => setOpenSubmenu(name);

  const deleteFolder = () => {
    deleteFSO(path, name, type);
  };

  const openFSO = () => {
    if (type === "directory") {
      changePath(Path.join(path, name));
    }
  };

  return (
    <>
      <ContextMenuItem name='Open' onClick={openFSO} closeMenu={closeMenu} />
      <ContextMenuItem
        name='Open in new window'
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
    </>
  );
};

export default FsoListItemContextMenu;
