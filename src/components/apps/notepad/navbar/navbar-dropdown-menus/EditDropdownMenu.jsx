import ContextMenuItem from '../../../../system/context-menu/context-menu-item/ContextMenuItem';
import useClipboard from '../../../../../hooks/useClipboard';

const EditDropdownMenu = ({ divRef, closeMenu }) => {
  const { executeClipboardComand } = useClipboard();

  const handleClick = (name) => {
    executeClipboardComand(name.toLowerCase(), divRef);
  };

  const executeCommand = (name) => {
    document.execCommand(name.toLowerCase());
  };

  return (
    <>
      <ContextMenuItem
        fontWeight='400'
        name='Undo'
        onClick={executeCommand}
        returnName
        hoverColor='#91c9f7'
        closeMenu={closeMenu}
      />
      <ContextMenuItem
        fontWeight='400'
        name='Redo'
        onClick={executeCommand}
        returnName
        hoverColor='#91c9f7'
        closeMenu={closeMenu}
      />
      <ContextMenuItem
        fontWeight='400'
        name='Cut'
        onClick={handleClick}
        returnName
        hoverColor='#91c9f7'
        closeMenu={closeMenu}
      />
      <ContextMenuItem
        fontWeight='400'
        name='Copy'
        onClick={handleClick}
        returnName
        hoverColor='#91c9f7'
        closeMenu={closeMenu}
      />
      <ContextMenuItem
        fontWeight='400'
        name='Paste'
        onClick={handleClick}
        returnName
        hoverColor='#91c9f7'
        closeMenu={closeMenu}
      />
      <ContextMenuItem
        fontWeight='400'
        name='Delete'
        onClick={handleClick}
        returnName
        hoverColor='#91c9f7'
        closeMenu={closeMenu}
      />
    </>
  );
};

export default EditDropdownMenu;
