import ContextMenuItem from "../context-menu/context-menu-item/ContextMenuItem";
import { path as Path } from "filer";

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
  startProcess,
}) => {
  // const [openSubmenu, setOpenSubmenu] = useState("");
  // const handleClick = (name) => setOpenSubmenu(name);

  const deleteFolder = () => {
    deleteFSO(path, name, type);
  };

  const openFSO = () => {
    if (type === "DIRECTORY") {
      changePath(Path.join(path, name));
    }
    if (type === "FILE") {
      startProcess("Notepad", { path: Path.join(path, name) });
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
