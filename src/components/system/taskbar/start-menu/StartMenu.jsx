import "./StartMenu.css";
import { useState, cloneElement } from "react";
import {
  AiOutlineUser,
  AiOutlineFile,
  AiOutlinePicture,
  AiOutlinePoweroff,
} from "react-icons/ai";
import { MdOutlineSettings } from "react-icons/md";
import { VscMenu } from "react-icons/vsc";
import { appConfigurations } from "../../../../utils/constants/processConfigurations";

const StartMenu = () => {
  const [isSidebarVisible, setSidebarVisibility] = useState(false);

  const expandSidebar = () => setSidebarVisibility(true);
  const colapseSidebar = () => setSidebarVisibility(false);

  return (
    <div className='start-menu'>
      <div
        onMouseEnter={expandSidebar}
        onMouseLeave={colapseSidebar}
        className={`start-menu-sidebar ${
          isSidebarVisible ? "sidebar-expanded" : ""
        }`}
      >
        <div className='sidebar-list-item align-top'>
          <VscMenu size='1.15rem' />
          {isSidebarVisible && (
            <div className='sidebar-list-item-content'>Start</div>
          )}
        </div>

        <div className='sidebar-list-item'>
          <div className='flex-center user-icon'>
            <div className='flex-center'>
              <AiOutlineUser size='0.75rem' />
            </div>
          </div>
          {isSidebarVisible && (
            <div className='sidebar-list-item-content'>Marko Tepšić </div>
          )}
        </div>

        <div className='sidebar-list-item'>
          <AiOutlineFile size='1.25rem' />
          {isSidebarVisible && (
            <div className='sidebar-list-item-content'>Documents</div>
          )}
        </div>

        <div className='sidebar-list-item'>
          <AiOutlinePicture size='1.25rem' />
          {isSidebarVisible && (
            <div className='sidebar-list-item-content'>Pictures</div>
          )}
        </div>

        <div className='sidebar-list-item'>
          <MdOutlineSettings size='1.25rem' />
          {isSidebarVisible && (
            <div className='sidebar-list-item-content'>Settings</div>
          )}
        </div>

        <div className='sidebar-list-item'>
          <AiOutlinePoweroff size='1.25rem' />
          {isSidebarVisible && (
            <div className='sidebar-list-item-content'>Power</div>
          )}
        </div>
      </div>
      <div className='apps-and-features'>
        {Object.keys(appConfigurations).map((app) => (
          <div className='start-menu-app'>
            <div className='app-icon'>
              {cloneElement(appConfigurations[app].icon, {
                width: "25px",
                height: "25px",
                size: "25px",
              })}
            </div>
            <div className='app-name'>{app}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StartMenu;
