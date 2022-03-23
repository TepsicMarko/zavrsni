import ContextMenuItem from '../context-menu/context-menu-item/ContextMenuItem';
import mime from 'mime';
import { useState, useContext } from 'react';
import { WallpaperContext } from '../../../contexts/WallpaperContext';
import { path as Path } from 'filer';

const FileContextMenu = ({
  filePath,
  fileName,
  fileType,
  closeMenu,
  openFile,
  openInNotepad,
  openInFileExplorer,
  deleteFile,
  focusInput,
  copyFile,
  cutFile,
  downloadFile,
  isZip,
  extarctZip,
  readBlob,
}) => {
  const [openSubmenu, setOpenSubmenu] = useState('');
  const handleMouseOver = (name) => setOpenSubmenu(name);
  const { setWallpaper } = useContext(WallpaperContext);
  const mimeType = mime.lookup(fileName) || '';

  const setAsWallpaper = async () =>
    setWallpaper(await readBlob(Path.join(filePath, fileName), mime.lookup(fileName)));

  return (
    <>
      <ContextMenuItem
        name='Open'
        onClick={openFile}
        closeMenu={closeMenu}
        onMouseOver={handleMouseOver}
      />
      {fileType.toLowerCase() !== 'directory'
        ? mimeType !== 'text/plain' &&
          (mimeType.startsWith('text/') || mimeType.startsWith('application/')) && (
            <ContextMenuItem
              name='Open with'
              openSubmenu={openSubmenu === 'Open with'}
              onMouseOver={handleMouseOver}
            >
              <ContextMenuItem
                name='Notepad'
                onClick={openInNotepad}
                closeMenu={closeMenu}
              />
            </ContextMenuItem>
          )
        : openInFileExplorer && (
            <ContextMenuItem
              name='Open in new window'
              onClick={openInFileExplorer}
              closeMenu={closeMenu}
            />
          )}
      {fileType.toLowerCase() !== 'directory' && mimeType.startsWith('image/') && (
        <ContextMenuItem
          name='Set as desktop background'
          onClick={setAsWallpaper}
          closeMenu={closeMenu}
          onMouseOver={handleMouseOver}
        />
      )}
      {isZip && (
        <ContextMenuItem
          name='Extract Here'
          onClick={extarctZip}
          closeMenu={closeMenu}
          onMouseOver={handleMouseOver}
        />
      )}
      <ContextMenuItem
        name='Download'
        onClick={downloadFile}
        closeMenu={closeMenu}
        onMouseOver={handleMouseOver}
      />
      <ContextMenuItem devider />
      <ContextMenuItem
        name='Cut'
        onClick={cutFile}
        closeMenu={closeMenu}
        onMouseOver={handleMouseOver}
      />
      <ContextMenuItem
        name='Copy'
        onClick={copyFile}
        closeMenu={closeMenu}
        onMouseOver={handleMouseOver}
      />
      <ContextMenuItem devider />
      <ContextMenuItem
        name='Delete'
        onClick={deleteFile}
        closeMenu={closeMenu}
        onMouseOver={handleMouseOver}
      />
      <ContextMenuItem
        name='Rename'
        onClick={focusInput}
        closeMenu={closeMenu}
        onMouseOver={handleMouseOver}
      />
    </>
  );
};

export default FileContextMenu;
