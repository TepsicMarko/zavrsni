import ContextMenuItem from "../context-menu/context-menu-item/ContextMenuItem";

const DesktopIconContextMenu = ({
  name,
  path,
  type,
  closeMenu,
  deleteFSO,
  deleteFromGrid,
  inputRef,
  openWithDefaultApp,
  startProcess,
}) => {
  const handleClick = () => {
    alert("not yet implemented");
  };

  const handleDelete = () => {
    deleteFSO(path, name, type.toLowerCase());
    deleteFromGrid(name);
  };

  const handleOpen = () => openWithDefaultApp(type, path, name, startProcess);

  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <>
      <ContextMenuItem name='Open' onClick={handleOpen} closeMenu={closeMenu} />
      <ContextMenuItem name='Cut' onClick={handleClick} closeMenu={closeMenu} />
      <ContextMenuItem
        name='Copy'
        onClick={handleClick}
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

export default DesktopIconContextMenu;
