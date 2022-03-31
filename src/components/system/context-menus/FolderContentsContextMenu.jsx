import ContextMenuItem from '../context-menu/context-menu-item/ContextMenuItem';
import { useState } from 'react';

const FolderContentsContextMenu = ({
  path,
  createFSO,
  closeMenu,
  addToGrid,
  handlePaste,
  isClipboardEmpty,
  sortFolderContent,
}) => {
  const [openSubmenu, setOpenSubmenu] = useState('');
  const handleMouseOver = (name) => setOpenSubmenu(name);
  return (
    <>
      <ContextMenuItem
        name='Paste'
        onClick={handlePaste}
        onMouseOver={handleMouseOver}
        disabled={isClipboardEmpty}
        closeMenu={closeMenu}
      />
      <ContextMenuItem
        name='Sort'
        openSubmenu={openSubmenu === 'Sort'}
        onMouseOver={handleMouseOver}
      >
        {[['Name'], ['Size'], ['Item Type', 'type'], ['Date Modified', 'mtimeMs']].map(
          ([name, alt]) => (
            <ContextMenuItem
              name={name}
              onClick={() => sortFolderContent(alt || name.toLowerCase())}
              radio
              closeMenu={closeMenu}
            />
          )
        )}
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
              if (path === '/C/Users/Public/Desktop')
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
