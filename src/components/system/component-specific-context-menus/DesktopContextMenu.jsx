import ContextMenuItem from '../context-menu/context-menu-item/ContextMenuItem';
import { useState } from 'react';

const DesktopContextMenu = ({
  path,
  createFSO,
  addToGrid,
  calculateGridPosition,
  mousePosition,
  closeMenu,
  sortGrid,
}) => {
  const [openSubmenu, setOpenSubmenu] = useState('');
  const handleMouseOver = (name) => setOpenSubmenu(name);
  return (
    <>
      <ContextMenuItem
        name='Sort'
        openSubmenu={openSubmenu === 'Sort'}
        onMouseOver={handleMouseOver}
        hoverColor='rgba(255, 255, 255, 0.15)'
      >
        {[
          ['Name'],
          ['Size', 'size'],
          ['Item Type', 'type'],
          ['Date Modified', 'mtimeMs'],
        ].map(([name, alt]) => (
          <ContextMenuItem
            name={name}
            onClick={() => {
              sortGrid(alt || name);
            }}
            closeMenu={closeMenu}
          />
        ))}
      </ContextMenuItem>
      <ContextMenuItem
        name='New'
        openSubmenu={openSubmenu === 'New'}
        onMouseOver={handleMouseOver}
        hoverColor='rgba(255, 255, 255, 0.15)'
      >
        {[
          { name: 'New Folder', type: 'directory' },
          { name: 'New Shortcut', type: 'lnk' },
          { name: 'New Text Document', type: '.txt' },
        ].map(({ name, type }) => (
          <ContextMenuItem
            name={name}
            onClick={() => {
              createFSO(path, name, type, undefined, (name) =>
                addToGrid([name], calculateGridPosition(mousePosition), false, true)
              );
            }}
            closeMenu={closeMenu}
          />
        ))}
      </ContextMenuItem>
    </>
  );
};

export default DesktopContextMenu;
