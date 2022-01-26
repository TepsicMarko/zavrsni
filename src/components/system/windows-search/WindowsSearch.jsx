import "./WindowsSearch.css";
import { useState, useEffect, useContext } from "react";
import useClickOutside from "../../../hooks/useClickOutside";
import WindowsSearchNavbar from "./navbar/WindowsSearchNavbar";
import QuickSearch from "./quick-search/QuickSearch";
import WindowsSearchBestMatch from "./best-match/WindowsSearchBestMatch";
import AppsOrFilesSearchResult from "./results/AppsOrFilesSearchResult";
import WebSearchResults from "./results/WebSearchResults";
import { appConfigurations } from "../../../utils/constants/processConfigurations";
import { FileSystemContext } from "../../../contexts/FileSystemContext";
import getFileType from "../../../utils/helpers/getFileType";
import getFileTypeIcon from "../../../utils/helpers/getFileTypeIcon";
import { path as Path } from "filer";
import openWithDefaultApp from "../../../utils/helpers/openWithDefaultApp";
import moment from "moment";

const WindowsSearch = ({
  searchFor,
  isWindowsSearchOpen,
  closeWindowsSearch,
  startProcess,
}) => {
  const [searchIn, setSearchIn] = useState("All");
  const [searchResults, setSearchResults] = useState({
    Apps: [],
    Files: [],
    Web: [],
  });
  const windowsSearchRef = useClickOutside(closeWindowsSearch);
  const { findFSO } = useContext(FileSystemContext);

  const determineBestMatch = () => {};

  const searchInApps = () => {
    let results = [];
    Object.keys(appConfigurations).forEach(
      (app) =>
        app.toLocaleLowerCase().includes(searchFor) &&
        results.push({
          name: app,
          icon: appConfigurations[app].icon,
          type: "App",
        })
    );

    return results;
  };
  const searchInFiles = async () => {
    let found = await findFSO("/C/users/admin", false, searchFor);

    return found.map((fso) => ({
      name: fso.name,
      path: fso.path,
      type: fso.type.toLowerCase(),
      icon: getFileTypeIcon(getFileType(Path.extname(fso.name))),
      mtime: moment(fso.mtime).format("DD/MM/YYYY h:mm A"),
    }));
  };

  const searchInWeb = () => {
    return [];
  };

  const openAppOrFile = (app, type, filePath) => {
    if (searchIn === "Apps") startProcess(app);
    else openWithDefaultApp(type, filePath, "", startProcess);
    closeWindowsSearch();
  };

  useEffect(async () => {
    if (searchFor.length) {
      // prettier-ignore
      const newSearchresults = { 
        Apps: /**searchIn === "All" || */ searchIn === "Apps" ?  searchInApps() : [], 
        Files: /**searchIn === "All" || */ searchIn === "Files" ?  await searchInFiles() : [],
        Web: /**searchIn === "All" || */ searchIn === "Web" ? searchInWeb() : [],
      };

      setSearchResults(newSearchresults);
    }
  }, [searchFor, searchIn]);

  return isWindowsSearchOpen ? (
    <div
      ref={windowsSearchRef}
      className={`windows-search ${
        isWindowsSearchOpen
          ? "windows-search-open-animation"
          : "windows-search-close-animation"
      }`}
    >
      <WindowsSearchNavbar
        searchIn={searchIn}
        setSearchIn={setSearchIn}
        isWindowsSearchOpen={isWindowsSearchOpen}
        closeWindowsSearch={closeWindowsSearch}
      />

      {searchFor && searchIn !== "All" ? (
        <div className='windows-search-results'>
          <WindowsSearchBestMatch
            bestMatch={
              // searchIn === "All" ? searchResults : searchResults[searchIn][0]
              searchResults[searchIn][0]
            }
            searchIn={searchIn}
            openAppOrFile={openAppOrFile}
          />
          {(searchIn === "Apps" || searchIn === "Files") && (
            <AppsOrFilesSearchResult
              result={
                // searchIn === "All" ? searchResults : searchResults[searchIn][0]
                searchResults[searchIn][0]
              }
              searchIn={searchIn}
              openAppOrFile={openAppOrFile}
            />
          )}
          {searchIn === "Web" && <WebSearchResults />}
        </div>
      ) : (
        <QuickSearch
          isWindowsSearchOpen={isWindowsSearchOpen}
          closeWindowsSearch={closeWindowsSearch}
          startProcess={startProcess}
          searchIn={searchIn}
        />
      )}
    </div>
  ) : null;
};

export default WindowsSearch;