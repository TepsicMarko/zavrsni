import "./WindowsSearch.css";
import { useState } from "react";
import useClickOutside from "../../../hooks/useClickOutside";
import WindowsSearchNavbar from "./navbar/WindowsSearchNavbar";
import QuickSearch from "./quick-search/QuickSearch";
import WindowsSearchBestMatch from "./best-match/WindowsSearchBestMatch";
import AppsAndFilesSearchResult from "./results/AppsAndFilesSearchResult";

const WindowsSearch = ({
  searchFor,
  isWindowsSearchOpen,
  closeWindowsSearch,
  startProcess,
}) => {
  const [searchIn, setSearchIn] = useState("All");
  const [bestMatch, setBestMatch] = useState("");
  const windowsSearchRef = useClickOutside(closeWindowsSearch);

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
        <WindowsSearchNavbar
          searchIn={searchIn}
          setSearchIn={setSearchIn}
          isWindowsSearchOpen={isWindowsSearchOpen}
          closeWindowsSearch={closeWindowsSearch}
        />
      )}

      {searchFor ? (
        <>
          <WindowsSearchBestMatch bestMatch={bestMatch} searchIn={searchIn} />
          {(searchIn === "Apps" || searchIn === "Files") && (
            <AppsAndFilesSearchResult />
          )}
        </>
      ) : (
        <QuickSearch
          isWindowsSearchOpen={isWindowsSearchOpen}
          closeWindowsSearch={closeWindowsSearch}
          startProcess={startProcess}
          searchIn={searchIn}
        />
      )}
    </div>
  );
};

export default WindowsSearch;
