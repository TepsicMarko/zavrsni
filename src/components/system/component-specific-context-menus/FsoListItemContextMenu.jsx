import ContextMenuItem from '../context-menu/context-menu-item/ContextMenuItem';
import { path as Path } from 'filer';
import openWithDefaultApp from '../../../utils/helpers/openWithDefaultApp';

const FsoListItemContextMenu = ({
  name,
  path,
  handleDelete,
  toggleOpen,
  closeMenu,
  focusInput,
  changePath,
  type,
  startProcess,
  handleCopy,
  handleCut,
}) => {
  const openFSO = () => {
    if (type === 'DIRECTORY') {
      changePath(Path.join(path, name));
    } else openWithDefaultApp(type, path, name, startProcess);
  };

  return (
    <>
      <ContextMenuItem name='Open' onClick={openFSO} closeMenu={closeMenu} />
      {type === 'DIRECTORY' && (
        <ContextMenuItem
          name='Open in new window'
          onClick={toggleOpen}
          closeMenu={closeMenu}
        />
      )}
      <ContextMenuItem devider />
      <ContextMenuItem name='Cut' onClick={handleCut} closeMenu={closeMenu} />
      <ContextMenuItem name='Copy' onClick={handleCopy} closeMenu={closeMenu} />
      <ContextMenuItem devider />
      <ContextMenuItem name='Delete' onClick={handleDelete} closeMenu={closeMenu} />
      <ContextMenuItem name='Rename' onClick={focusInput} closeMenu={closeMenu} />
    </>
  );
};

export default FsoListItemContextMenu;
