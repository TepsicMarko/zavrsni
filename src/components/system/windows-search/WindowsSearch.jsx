import "./WindowsSearch.css";
import { useState, useEffect, useContext, useRef } from "react";
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
import axios from "axios";

const WindowsSearch = ({
  searchFor,
  isWindowsSearchOpen,
  closeWindowsSearch,
  startProcess,
}) => {
  const [searchIn, setSearchIn] = useState("All");
  const [appsOrFilesSearchResults, setAppsOrFilesSearchResults] = useState({
    Apps: [],
    Files: [],
  });
  const [webSearchResults, setWebSearchResults] = useState([]);
  const timeoutIdRef = useRef();
  const previousSearchForRef = useRef({});
  const windowsSearchRef = useClickOutside(closeWindowsSearch);
  const { findFSO } = useContext(FileSystemContext);

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

  const searchInWeb = async () => {
    clearTimeout(timeoutIdRef.current);
    const results = await new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        axios
          .get(
            `https://www.googleapis.com/customsearch/v1?key=${
              process.env.REACT_APP_EVIRONMENT === "dev"
                ? process.env.REACT_APP_DEV_API_KEY
                : process.env.REACT_APP_PROD_API_KEY
            }&cx=${
              process.env.REACT_APP_EVIRONMENT === "dev"
                ? process.env.REACT_APP_DEV_CX_KEY
                : process.env.REACT_APP_PROD_CX_KEY
            }&q=${searchFor}`
          )
          .then((res) => resolve(res))
          .catch((err) => reject(err));
      }, 500);

      timeoutIdRef.current = timeoutId;
    });

    console.log(results, searchFor, timeoutIdRef.current);
    setWebSearchResults(
      results.data.items.map(({ title, link, htmlFormattedUrl, snippet }) => ({
        title: title,
        url: { htmlFormattedUrl, raw: link },
        description: snippet,
      }))
    );
  };

  const openAppOrFile = (app, type, filePath) => {
    if (searchIn === "Apps") startProcess(app);
    else openWithDefaultApp(type, filePath, "", startProcess);
    closeWindowsSearch();
  };

  const openInBroswer = (url) => {
    startProcess("Chrome", { initialQuery: url || searchFor });
    closeWindowsSearch();
  };

  const returnMostRelevantResults = (includeWebResults = true) => {
    if (appsOrFilesSearchResults.Apps.length)
      return appsOrFilesSearchResults.Apps;
    if (appsOrFilesSearchResults.Files.length)
      return appsOrFilesSearchResults.Files;
    if (includeWebResults && webSearchResults.length) return webSearchResults;

    return [];
  };

  useEffect(async () => {
    if (searchFor.length) {
      let newAppsOfRilesSearchResults = {
        Apps:
          searchIn === "All" ||
          (searchIn === "Apps" &&
            searchFor !== previousSearchForRef.current.Apps)
            ? searchInApps()
            : appsOrFilesSearchResults.Apps,
        Files:
          searchIn === "All" ||
          (searchIn === "Files" &&
            searchFor !== previousSearchForRef.current.Files)
            ? await searchInFiles()
            : appsOrFilesSearchResults.Files,
      };
      setAppsOrFilesSearchResults(newAppsOfRilesSearchResults);

      if (
        (searchIn === "All" || searchIn === "Web") &&
        searchFor !== previousSearchForRef.current.Web
      )
        setWebSearchResults([]);
      searchInWeb();
    }

    if (searchIn === "All")
      previousSearchForRef.current = {
        Apps: searchFor,
        Files: searchFor,
        Web: searchFor,
      };
    else previousSearchForRef.current[searchIn] = searchFor;
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

      {searchFor ? (
        <div className='windows-search-results'>
          <WindowsSearchBestMatch
            bestMatch={
              searchIn === "All"
                ? returnMostRelevantResults()
                : searchIn === "Web"
                ? webSearchResults[0]
                : appsOrFilesSearchResults[searchIn][0]
            }
            searchIn={searchIn}
            searchFor={searchFor}
            openAppOrFile={openAppOrFile}
            openInBroswer={openInBroswer}
          />
          {(searchIn === "All" ||
            searchIn === "Apps" ||
            searchIn === "Files") && (
            <AppsOrFilesSearchResult
              result={
                searchIn === "All"
                  ? returnMostRelevantResults(false)[0]
                  : appsOrFilesSearchResults[searchIn][0]
              }
              searchIn={searchIn}
              openAppOrFile={openAppOrFile}
            />
          )}
          {((searchIn === "All" &&
            !appsOrFilesSearchResults.Apps.length &&
            !appsOrFilesSearchResults.Files.length) ||
            searchIn === "Web") && (
            <WebSearchResults
              results={webSearchResults}
              openInBroswer={openInBroswer}
            />
          )}
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
