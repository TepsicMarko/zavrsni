import ContextMenuItem from '../context-menu/context-menu-item/ContextMenuItem';
import { useState } from 'react';

const FolderContentsContextMenu = ({
  path,
  createFSO,
  closeMenu,
  addToGrid,
  handlePaste,
}) => {
  const [openSubmenu, setOpenSubmenu] = useState('');
  const handleMouseOver = (name) => setOpenSubmenu(name);
  return (
    <>
      <ContextMenuItem name='Paste' onClick={handlePaste} closeMenu={closeMenu} />
      <ContextMenuItem
        name='View'
        openSubmenu={openSubmenu === 'View'}
        onMouseOver={handleMouseOver}
      >
        {['Large', 'Medium', 'Small'].map((el) => (
          <ContextMenuItem name={el + ' icons'} radio closeMenu={closeMenu} />
        ))}
      </ContextMenuItem>
      <ContextMenuItem
        name='New'
        openSubmenu={openSubmenu === 'New'}
        onMouseOver={handleMouseOver}
      >
        {[
          { name: 'New Folder', type: 'directory' },
          { name: 'New Shortcut', type: 'lnk' },
          { name: 'New Text Document', type: '.txt' },
        ].map(({ name, type }) => (
          <ContextMenuItem
            name={name}
            onClick={async () => {
              const fsoName = await createFSO(path, name, type);
              if (path === '/C/users/admin/Desktop')
                addToGrid([fsoName, undefined], { row: 1, column: 1 });
            }}
            closeMenu={closeMenu}
          />
        ))}
      </ContextMenuItem>
    </>
  );
};

export default FolderContentsContextMenu;
