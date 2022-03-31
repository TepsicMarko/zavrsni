import ContextMenuItem from '../context-menu/context-menu-item/ContextMenuItem';
import { useState } from 'react';

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
  addToGrid,
}) => {
  const [openSubmenu, setOpenSubmenu] = useState('');
  const handleMouseOver = (name) => setOpenSubmenu(name);
  const createNewFolder = async () => {
    const folderName = await createFSO(createPath, 'New Folder', 'directory');
    if (createPath === '/C/Users/Public/Desktop') {
      addToGrid([folderName, undefined], { row: 1, column: 1 });
    }
  };

  const deleteFolder = () => {
    deleteFSO(deletePath, name, 'directory');
  };

  return (
    <>
      <ContextMenuItem
        name={isOpen ? 'Collapse' : 'Expand'}
        onClick={toggleOpen}
        closeMenu={closeMenu}
        onMouseOver={handleMouseOver}
      />
      <ContextMenuItem devider />
      <ContextMenuItem
        name='Delete'
        onClick={deleteFolder}
        onMouseOver={handleMouseOver}
        closeMenu={closeMenu}
      />
      <ContextMenuItem
        name='Rename'
        onClick={focusInput}
        onMouseOver={handleMouseOver}
        closeMenu={closeMenu}
      />
      <ContextMenuItem devider />
      <ContextMenuItem
        name='New'
        openSubmenu={openSubmenu === 'New'}
        onMouseOver={handleMouseOver}
      >
        <ContextMenuItem name='Folder' onClick={createNewFolder} closeMenu={closeMenu} />
      </ContextMenuItem>
    </>
  );
};

export default NavigationPaneBranchContextMenu;
