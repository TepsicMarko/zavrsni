import "./NotepadNavbar.css";
import { useState, useRef, useEffect, cloneElement } from "react";
import FileDropdownMenu from "./navbar-dropdown-menus/FileDropdownMenu";
import EditDropdownMenu from "./navbar-dropdown-menus/EditDropdownMenu";
import FormatDropdownMenu from "./navbar-dropdown-menus/FormatDropdownMenu";
import ViewDropdownMenu from "./navbar-dropdown-menus/ViewDropdownMenu";

const dropdownMenus = {
  File: <FileDropdownMenu />,
  Edit: <EditDropdownMenu />,
  Format: <FormatDropdownMenu />,
  View: <ViewDropdownMenu />,
};

const NotepadNavbar = ({ textContent, filePath, setFilePath, divRef }) => {
  const [activeTab, setActiveTab] = useState("");
  const navRef = useRef(null);

  const chnageActiveTab = (e) => setActiveTab(e.target.textContent);
  const handleMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  useEffect(() => {
    const eventHandler = (e) => {
      setActiveTab("");
    };

    document.addEventListener("mousedown", eventHandler);
    return () => document.removeEventListener("mousedown", eventHandler);
  }, []);

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
          onClick={chnageActiveTab}
          onMouseDown={handleMouseDown}
        >
          {name}
          {activeTab === name && (
            <div className='nav-dropdown-menu' style={{ width: size }}>
              {name === "File" || name === "Edit"
                ? cloneElement(dropdownMenus[name], {
                    setFilePath,
                    textContent,
                    filePath,
                    divRef,
                  })
                : dropdownMenus[name]}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotepadNavbar;
