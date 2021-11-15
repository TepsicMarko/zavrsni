import ContextMenuItem from "../components/context-menu/context-menu-item/ContextMenuItem";

const DesktopIconContextMenu = ({
  name,
  path,
  closeMenu,
  deleteFSO,
  deleteFromGrid,
  inputRef,
}) => {
  const handleClick = () => {
    alert("not yet implemented");
  };

  const handleDelete = () => {
    deleteFSO(name, path);
    deleteFromGrid(name);
  };

  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <>
      <ContextMenuItem
        name='Open'
        onClick={handleClick}
        closeMenu={closeMenu}
      />
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
