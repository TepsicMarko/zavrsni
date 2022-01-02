import "./FileExplorerNavbar.css";
import { useMemo } from "react";

const FileExplorerNavbar = ({ activeTab, changeTab }) => (
  <div className='fx-navbar'>
    <div className='flex-center nav-btn'>File</div>
    {useMemo(
      () =>
        ["Home", "Share", "View"].map((tab) => (
          <div
            className={`flex-center nav-tab${
              tab === activeTab ? "-active" : ""
            }`}
            onClick={changeTab}
          >
            {tab}
          </div>
        )),
      [activeTab]
    )}
  </div>
);

export default FileExplorerNavbar;
