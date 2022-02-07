import ContextMenuItem from "../context-menu/context-menu-item/ContextMenuItem";
import { path as Path } from "filer";
import openWithDefaultApp from "../../../utils/helpers/openWithDefaultApp";

const FsoListItemContextMenu = ({
  name,
  path,
  handleDelete,
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

  const openFSO = () => {
    if (type === "DIRECTORY") {
      changePath(Path.join(path, name));
    } else openWithDefaultApp(type, path, name, startProcess);
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
        onClick={handleDelete}
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
