import ContextMenuItem from '../context-menu/context-menu-item/ContextMenuItem';

const DesktopIconContextMenu = ({
  closeMenu,
  inputRef,
  handleOpen,
  handleDelete,
  selectDivText,
  handleCopy,
  handleCut,
  handleFileDownload,
}) => {
  const focusInput = () => {
    inputRef.current.focus();
    selectDivText(inputRef.current);
  };

  return (
    <>
      <ContextMenuItem name='Open' onClick={handleOpen} closeMenu={closeMenu} />
      <ContextMenuItem
        name='Download'
        onClick={handleFileDownload}
        closeMenu={closeMenu}
      />
      <ContextMenuItem devider />
      <ContextMenuItem name='Cut' onClick={handleCut} closeMenu={closeMenu} />
      <ContextMenuItem name='Copy' onClick={handleCopy} closeMenu={closeMenu} />
      <ContextMenuItem devider />
      <ContextMenuItem name='Delete' onClick={handleDelete} closeMenu={closeMenu} />
      <ContextMenuItem name='Rename' onClick={focusInput} closeMenu={closeMenu} />
    </>
  );
};

export default DesktopIconContextMenu;
