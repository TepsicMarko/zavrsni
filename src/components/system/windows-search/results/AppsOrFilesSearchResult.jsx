import "./SearchResults.css";
import { cloneElement } from "react";
import { IoOpenOutline } from "react-icons/io5";
import { BsFolder2Open, BsPin } from "react-icons/bs";
import { MdOutlineFileCopy } from "react-icons/md";
import { path as Path } from "filer";

const AppsOrFilesSearchResult = ({ result, searchIn, openAppOrFile }) => {
  const handleClick = () =>
    openAppOrFile(result.name, result.type, result.path);

  const openFileLocation = () =>
    openAppOrFile(result.name, "directory", Path.dirname(result.path));

  const copyToClipboard = () => {
    const selection = window.getSelection();
    navigator.clipboard.writeText(result.path);
  };

  return (
    <div className='apps-or-files-search-result'>
      {result ? (
        <>
          <div className='basic-app-or-file-info'>
            <div className='app-or-file-icon'>
              {cloneElement(result.icon, {
                size: "70px",
                width: "70px",
                height: "70px",
                color: "white",
              })}
            </div>
            <div className='app-or-file-name' onClick={handleClick}>
              {result.name}
            </div>
            <div className='app-or-file-type'>{result.type}</div>
          </div>
          {searchIn === "Files" && (
            <div className='aditional-file-info'>
              <div className='file-location'>
                <div>Location:</div>
                <div onClick={handleClick}>{result.path}</div>
              </div>
              <div className='file-last-modified'>
                <div>Last modified:</div>
                <div>{result.mtime}</div>
              </div>
            </div>
          )}
          <div className='app-or-file-actions'>
            <div onClick={handleClick}>
              <IoOpenOutline />
              Open
            </div>
            {searchIn === "Apps" && (
              <div onClick={() => alert("comming soon...")}>
                <BsPin />
                Pin To Taskbar
              </div>
            )}
            {searchIn === "Files" && (
              <>
                <div onClick={openFileLocation}>
                  <BsFolder2Open />
                  Open File Location
                </div>
                <div onClick={copyToClipboard}>
                  <MdOutlineFileCopy />
                  Copy Path
                </div>
              </>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default AppsOrFilesSearchResult;
