import './NotepadNavbar.css';
import { useState, useRef, useEffect, cloneElement } from 'react';
import FileDropdownMenu from './navbar-dropdown-menus/FileDropdownMenu';
import EditDropdownMenu from './navbar-dropdown-menus/EditDropdownMenu';
import FormatDropdownMenu from './navbar-dropdown-menus/FormatDropdownMenu';
import ViewDropdownMenu from './navbar-dropdown-menus/ViewDropdownMenu';
import useClickOutside from '../../../../hooks/useClickOutside';

const NotepadNavbar = ({
  textContent,
  filePath,
  setFilePath,
  divRef,
  setWordWrap,
  wordWrap,
  statusBarVisible,
  setStatusBarVisibility,
  zoom,
  setZoom,
  openUnsavedChangesDialog,
  resetNotepad,
  pid,
  addToGrid,
}) => {
  const [activeTab, setActiveTab] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const closeMenu = () => {
    setActiveTab('');
    setIsDropdownOpen(false);
  };

  const navRef = useClickOutside('mousedown', closeMenu);

  return (
    <div className='notepad-navbar' ref={navRef}>
      {[
        { name: 'File', size: '14.5rem' },
        { name: 'Edit', size: '12.5rem' },
        { name: 'Format', size: '7.5rem' },
        { name: 'View', size: '7.5rem' },
      ].map(({ name, size }) => (
        <div
          className='flex-center notepad-nav-tab'
          onClick={() => {
            setActiveTab(name);
            setIsDropdownOpen(true);
          }}
          onMouseOver={(e) => {
            e.stopPropagation();
            isDropdownOpen && setActiveTab(e.target.childNodes[0].textContent);
          }}
        >
          {name}
          {activeTab === name && (
            <div
              className='nav-dropdown-menu'
              style={{ width: size }}
              onMouseOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {name === 'File' && (
                <FileDropdownMenu
                  setFilePath={setFilePath}
                  textContent={textContent}
                  filePath={filePath}
                  openUnsavedChangesDialog={openUnsavedChangesDialog}
                  resetNotepad={resetNotepad}
                  pid={pid}
                  addToGrid={addToGrid}
                  closeMenu={closeMenu}
                />
              )}
              {name === 'Edit' && (
                <EditDropdownMenu divRef={divRef} closeMenu={closeMenu} />
              )}
              {name === 'Format' && (
                <FormatDropdownMenu
                  setWordWrap={setWordWrap}
                  wordWrap={wordWrap}
                  closeMenu={closeMenu}
                />
              )}
              {name === 'View' && (
                <ViewDropdownMenu
                  setStatusBarVisibility={setStatusBarVisibility}
                  statusBarVisible={statusBarVisible}
                  setZoom={setZoom}
                  zoom={zoom}
                  closeMenu={closeMenu}
                />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotepadNavbar;
