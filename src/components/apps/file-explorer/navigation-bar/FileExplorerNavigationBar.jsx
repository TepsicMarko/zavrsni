import './FileExplorerNavigationBar.css';
import { IoArrowBack, IoArrowForward, IoArrowUp, IoReload } from 'react-icons/io5';
import { VscSearch } from 'react-icons/vsc';
import { useState, memo, useEffect, useContext, useRef } from 'react';
import { FcFolder } from 'react-icons/fc';
import { VscClose } from 'react-icons/vsc';
import { path as Path } from 'filer';
import remToPx from '../../../../utils/helpers/remToPx';
import { FileSystemContext } from '../../../../contexts/FileSystemContext';
import usePathHistory from '../../../../hooks/usePathHistory';
import { ERROR_PATH_NOT_FOUND } from '../../../system/dialogs/message/errorCodes';

const FileExplorerNavigationBar = ({
  pid,
  path,
  setPath,
  changePath,
  setSearchResults,
  setExpandBranches,
  startChildProcess,
  mode,
}) => {
  const [searchBoxWidth, setSearchBoxWidth] = useState('5rem');
  const [minWidth] = useState(remToPx('5rem'));
  const [address, setAddress] = useState(path);
  const [search, setSearch] = useState('');
  const { exists, findFSO } = useContext(FileSystemContext);
  const [previous, goBack, current, goForth, next, watchPath] = usePathHistory(path);
  const positionRef = useRef({});

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
      exists(address)
        .then(() => {
          setExpandBranches(true);
          changePath(address);
        })
        .catch((e) => {
          startChildProcess('File Explorer', pid, 'Message Dialog', {
            errCode: ERROR_PATH_NOT_FOUND,
            title: 'File Explorer',
            warning:
              'Windows cant find "' + address + '". Check the spelling and try again.',
            parentProcess: 'File Explorer',
            ppid: pid,
            isError: true,
          });
          setAddress(path);
        });
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const startSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      findFSO(path, false, search, setSearchResults);
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
    setSearch('');
  };

  const handleResizeStart = (e) => {
    e.stopPropagation();
    e.dataTransfer.setDragImage(new Image(), 0, 0);
    const { clientX: x } = e;
    positionRef.current = { x: e.target.parentElement.clientWidth + x };
  };

  const handleResize = (e) => {
    e.stopPropagation();
    const { x } = positionRef.current;
    const { clientX } = e;
    const newWidth = x - clientX;
    setSearchBoxWidth(newWidth <= minWidth ? minWidth : newWidth);
  };

  const goUp = () => {
    changePath(Path.join(path, '..'));
  };

  const resetAddress = () => {
    setAddress(path);
  };

  useEffect(() => {
    address !== path && setAddress(path);
  }, [path]);

  useEffect(() => {
    watchPath(path);
    mode === 'v' && setSearchResults([]);
    mode === 'v' && setSearch('');
  }, [path]);

  useEffect(() => {
    path !== current && setPath(current);
  }, [current]);

  return (
    <div className='flex-center fx-navigation-bar'>
      <div className='flex-center buttons-navigation'>
        <div
          onClick={previous.length ? goBack : undefined}
          className={!previous.length && 'disabled'}
        >
          <IoArrowBack />
        </div>
        <div
          onClick={next.length ? goForth : undefined}
          className={!next.length && 'disabled'}
        >
          <IoArrowForward />
        </div>
        <div onClick={goUp}>
          <IoArrowUp />
        </div>
      </div>

      <div className='flex-center address-bar'>
        <div className='folder-icon'>
          <FcFolder />
        </div>
        <input
          type='text'
          className='folder-path'
          value={address}
          onChange={handleAddressChange}
          onKeyDown={handleKeyDown}
          onBlur={resetAddress}
        />
        <div className='flex-center refresh-folder-view'>
          <IoReload size='0.75rem' color='gray' />
        </div>
      </div>

      <div className='flex-center file-search-box' style={{ flexBasis: searchBoxWidth }}>
        <div
          className='resize-search-box'
          draggable
          onDragStart={handleResizeStart}
          onDrag={handleResize}
          onDragEnd={handleResize}
        ></div>
        <VscSearch size='0.75rem' color='gray' onClick={startSearch} />
        <input
          type='text'
          placeholder={`Search ${Path.basename(path)}`}
          value={search}
          onChange={handleSearchChange}
          onKeyDown={startSearch}
        />
        <VscClose color='gray' id='remove' onClick={clearSearch} />
      </div>
    </div>
  );
};

export default memo(FileExplorerNavigationBar);
