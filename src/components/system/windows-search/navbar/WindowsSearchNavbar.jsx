import "./WindowsSearchNavbar.css";
import { IoCloseOutline } from "react-icons/io5";

const WindowsSearchNavbar = ({
  searchIn,
  setSearchIn,
  isWindowsSearchOpen,
  closeWindowsSearch,
}) => {
  const tabs = ["All", "Apps", "Files", "Web"];

  return (
    <div className='windows-search-navbar'>
      {tabs.map((tab) => (
        <div
          className='flex-center windows-search-navbar-tab'
          data-search-in={tab}
          onClick={() => setSearchIn(tab)}
        >
          <div
            className='nav-tab-name'
            style={{
              textShadow:
                tab === searchIn ? "-0.06ex 0 white, 0.06ex 0 white" : "",
            }}
          >
            {tab}
          </div>
          {tab === searchIn && <div className='active-tab-indicator'></div>}
        </div>
      ))}
      <IoCloseOutline
        color='white'
        size='1.5rem'
        onClick={closeWindowsSearch}
      />
    </div>
  );
};

export default WindowsSearchNavbar;
