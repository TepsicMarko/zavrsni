import "./FileExplorerNavbar.css";

const FileExplorerNavbar = ({ activeTab, changeTab }) => (
  <div className='fx-navbar'>
    <div className='flex-center nav-btn'>File</div>
    {["Home", "Share", "View"].map((tab) => (
      <div
        className={`flex-center nav-tab${tab === activeTab ? "-active" : ""}`}
        onClick={changeTab}
      >
        {tab}
      </div>
    ))}
  </div>
);

export default FileExplorerNavbar;
