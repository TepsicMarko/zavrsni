import "./WindowsSearch.css";
import { useState, cloneElement } from "react";
import WindowsSearchNavbar from "./navbar/WindowsSearchNavbar";
import { appConfigurations } from "../../../utils/constants/processConfigurations";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { IoNewspaperOutline } from "react-icons/io5";
import { BsClock } from "react-icons/bs";
import { AiOutlineInfoCircle } from "react-icons/ai";
import useClickOutside from "../../../hooks/useClickOutside";

const WindowsSearch = ({
  searchFor,
  isWindowsSearchOpen,
  closeWindowsSearch,
  startProcess,
}) => {
  const [searchIn, setSearchIn] = useState("All");
  const windowsSearchRef = useClickOutside(closeWindowsSearch);

  const openApp = (app) => {
    closeWindowsSearch();
    startProcess(app);
  };

  return (
    <div
      ref={windowsSearchRef}
      className={`windows-search ${
        isWindowsSearchOpen
          ? "windows-search-open-animation"
          : "windows-search-close-animation"
      }`}
    >
      {isWindowsSearchOpen && (
        <>
          <WindowsSearchNavbar
            searchIn={searchIn}
            setSearchIn={setSearchIn}
            isWindowsSearchOpen={isWindowsSearchOpen}
            closeWindowsSearch={closeWindowsSearch}
          />
          <div className='top-apps'>
            <strong>Top apps</strong>
            {[
              "Command Prompt",
              "File Explorer",
              "Notepad",
              "Movies And TV",
            ].map((app) => (
              <div className='flex-center top-app' onClick={() => openApp(app)}>
                <div className='flex-center top-app-icon'>
                  {cloneElement(appConfigurations[app].icon, {
                    width: "30px",
                    height: "30px",
                    size: "30px",
                  })}
                </div>
                <div className='top-app-name'>{app}</div>
              </div>
            ))}
          </div>
          <div className='quick-searches'>
            <strong>Quick searches</strong>
            {[
              { icon: <TiWeatherPartlySunny />, topic: "Weather" },
              { icon: <IoNewspaperOutline />, topic: "Top News" },
              { icon: <BsClock />, topic: "Today in history" },
              { icon: <AiOutlineInfoCircle />, topic: "Coronavirus trends" },
            ].map((quickSearch, i) => (
              <div className='quick-search'>
                <div className='flex-center quick-search-icon'>
                  {cloneElement(quickSearch.icon, { size: "1.75rem" })}
                </div>
                <div className='quick-search-topic'>{quickSearch.topic}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default WindowsSearch;
