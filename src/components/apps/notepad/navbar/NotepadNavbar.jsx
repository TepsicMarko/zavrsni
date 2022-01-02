import "./NotepadNavbar.css";
import { useState } from "react";
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

const NotepadNavbar = () => {
  const [activeTab, setActiveTab] = useState("");

  const chnageActiveTab = (e) => setActiveTab(e.target.textContent);

  return (
    <div className='notepad-navbar'>
      {[
        { name: "File", size: "14.5rem" },
        { name: "Edit", size: "12.5rem" },
        { name: "Format", size: "7.5rem" },
        { name: "View", size: "14.5rem" },
        { name: "Help", size: "14.5rem" },
      ].map(({ name, size }) => (
        <div className='flex-center notepad-nav-tab' onClick={chnageActiveTab}>
          {name}
          <div className='nav-dropdown-menu' style={{ width: size }}>
            {activeTab === name ? dropdownMenus[name] : null}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotepadNavbar;
