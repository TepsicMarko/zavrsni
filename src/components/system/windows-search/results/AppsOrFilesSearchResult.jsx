import './SearchResults.css';
import { cloneElement } from 'react';
import { IoOpenOutline } from 'react-icons/io5';
import { BsFolder2Open, BsPin } from 'react-icons/bs';
import { MdOutlineFileCopy } from 'react-icons/md';
import { path as Path } from 'filer';

const AppsOrFilesSearchResult = ({ result, searchIn, openAppOrFile, focusedResult }) => {
  const handleClick = () =>
    searchIn === 'Apps'
      ? openAppOrFile(result.name)
      : openAppOrFile(result.name, result.type, result.path);

  const openFileLocation = () => {
    const parentFolder = Path.basename(Path.dirname(result.path));
    openAppOrFile(parentFolder, 'directory', Path.dirname(result.path));
  };

  const copyToClipboard = () => {
    const selection = window.getSelection();
    navigator.clipboard.writeText(result.path);
  };

  result = Object.keys(focusedResult).length ? focusedResult : result;

  return result ? (
    <div className='apps-or-files-search-result'>
      <div className='basic-app-or-file-info'>
        <div className='app-or-file-icon'>
          {cloneElement(result.icon, {
            size: '70px',
            width: '70px',
            height: '70px',
            color: 'white',
          })}
        </div>
        <div className='app-or-file-name' onClick={handleClick}>
          {result.name}
        </div>
        <div className='app-or-file-type'>{result.type}</div>
      </div>
      {result.path && result.mtime && (
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
        {searchIn === 'Apps' && (
          <div onClick={() => alert('comming soon...')}>
            <BsPin />
            Pin To Taskbar
          </div>
        )}
        {result.path && result.mtime && (
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
    </div>
  ) : null;
};

export default AppsOrFilesSearchResult;
