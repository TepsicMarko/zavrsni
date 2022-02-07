import "./StartMenu.css";
import { useState, useContext } from "react";
import {
  AiOutlineUser,
  AiOutlineFile,
  AiOutlinePicture,
  AiOutlinePoweroff,
} from "react-icons/ai";
import { MdOutlineSettings } from "react-icons/md";
import { VscMenu } from "react-icons/vsc";
import AppsAndFeatures from "./app-and-features/AppsAndFeatures";
import { ProcessesContext } from "../../../../contexts/ProcessesContext";
import useClickOutside from "../../../../hooks/useClickOutside";

const StartMenu = ({ isStartMenuVisible, colapseStartMenu }) => {
  const [isSidebarVisible, setSidebarVisibility] = useState(false);
  const clickOutsideRef = useClickOutside("mousedown", colapseStartMenu);
  const { startProcess } = useContext(ProcessesContext);

  const expandSidebar = () => setSidebarVisibility(true);
  const colapseSidebar = () => setSidebarVisibility(false);

  const openDocuments = () => {
    colapseStartMenu();
    startProcess("File Explorer", { customPath: "/C/users/admin/Documents" });
  };
  const openPictures = () => {
    colapseStartMenu();
    startProcess("File Explorer", { customPath: "/C/users/admin/Pictures" });
  };
  const shutDown = () => {
    colapseStartMenu();
    window.location.reload();
  };

  return (
    <div
      ref={clickOutsideRef}
      className={`start-menu ${isStartMenuVisible ? "height-animation" : ""}`}
    >
      {isStartMenuVisible && (
        <>
          <div
            onMouseEnter={expandSidebar}
            onMouseLeave={colapseSidebar}
            className={`start-menu-sidebar ${
              isSidebarVisible ? "width-animation" : ""
            }`}
          >
            <div
              className='sidebar-list-item align-top'
              onMouseOver={(e) => e.stopPropagation()}
              onClick={isSidebarVisible ? colapseSidebar : expandSidebar}
            >
              <VscMenu size='1.15rem' />
              <div className='sidebar-list-item-content'>Start</div>
            </div>

            <div className='sidebar-list-item'>
              <div className='flex-center user-icon'>
                <div className='flex-center'>
                  <AiOutlineUser size='0.75rem' />
                </div>
              </div>
              <div
                className={`sidebar-list-item-content ${
                  isSidebarVisible ? "visibility-animation" : ""
                }`}
              >
                Marko Tepšić
              </div>
            </div>

            <div className='sidebar-list-item' onClick={openDocuments}>
              <AiOutlineFile size='1.25rem' />
              <div
                className={`sidebar-list-item-content ${
                  isSidebarVisible ? "visibility-animation" : ""
                }`}
              >
                Documents
              </div>
            </div>

            <div className='sidebar-list-item' onClick={openPictures}>
              <AiOutlinePicture size='1.25rem' />
              <div
                className={`sidebar-list-item-content ${
                  isSidebarVisible ? "visibility-animation" : ""
                }`}
              >
                Pictures
              </div>
            </div>

            <div className='sidebar-list-item'>
              <MdOutlineSettings size='1.25rem' />
              <div
                className={`sidebar-list-item-content ${
                  isSidebarVisible ? "visibility-animation" : ""
                }`}
              >
                Settings
              </div>
            </div>

            <div className='sidebar-list-item' onClick={shutDown}>
              <AiOutlinePoweroff size='1.25rem' />
              <div
                className={`sidebar-list-item-content ${
                  isSidebarVisible ? "visibility-animation" : ""
                }`}
              >
                Power
              </div>
            </div>
          </div>
          <AppsAndFeatures
            startProcess={startProcess}
            colapseStartMenu={colapseStartMenu}
          />
        </>
      )}
    </div>
  );
};

export default StartMenu;
