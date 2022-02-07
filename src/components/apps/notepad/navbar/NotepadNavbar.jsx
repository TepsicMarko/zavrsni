import "./NotepadNavbar.css";
import { useState, useRef, useEffect, cloneElement } from "react";
import FileDropdownMenu from "./navbar-dropdown-menus/FileDropdownMenu";
import EditDropdownMenu from "./navbar-dropdown-menus/EditDropdownMenu";
import FormatDropdownMenu from "./navbar-dropdown-menus/FormatDropdownMenu";
import ViewDropdownMenu from "./navbar-dropdown-menus/ViewDropdownMenu";
import useClickOutside from "../../../../hooks/useClickOutside";

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
}) => {
  const [activeTab, setActiveTab] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navRef = useClickOutside("mousedown", () => {
    setActiveTab("");
    setIsDropdownOpen(false);
  });

  const changeActiveTab = (e) => {
    setActiveTab(e.target.textContent);
    setIsDropdownOpen(true);
  };

  const handleMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleMouseOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    isDropdownOpen && setActiveTab(e.target.childNodes[0].textContent);
  };

  return (
    <div className='notepad-navbar'>
      {[
        { name: "File", size: "14.5rem" },
        { name: "Edit", size: "12.5rem" },
        { name: "Format", size: "7.5rem" },
        { name: "View", size: "7.5rem" },
      ].map(({ name, size }) => (
        <div
          ref={navRef}
          className='flex-center notepad-nav-tab'
          onClick={changeActiveTab}
          onMouseDown={handleMouseDown}
          onMouseOver={handleMouseOver}
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
              {name === "File" && (
                <FileDropdownMenu
                  setFilePath={setFilePath}
                  textContent={textContent}
                  filePath={filePath}
                  openUnsavedChangesDialog={openUnsavedChangesDialog}
                  resetNotepad={resetNotepad}
                  pid={pid}
                />
              )}
              {name === "Edit" && <EditDropdownMenu divRef={divRef} />}
              {name === "Format" && (
                <FormatDropdownMenu
                  setWordWrap={setWordWrap}
                  wordWrap={wordWrap}
                />
              )}
              {name === "View" && (
                <ViewDropdownMenu
                  setStatusBarVisibility={setStatusBarVisibility}
                  statusBarVisible={statusBarVisible}
                  setZoom={setZoom}
                  zoom={zoom}
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
