import ContextMenuItem from "../context-menu/context-menu-item/ContextMenuItem";

const DesktopIconContextMenu = ({
  closeMenu,
  inputRef,
  handleOpen,
  handleDelete,
}) => {
  const handleClick = () => {
    alert("not yet implemented");
  };

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
