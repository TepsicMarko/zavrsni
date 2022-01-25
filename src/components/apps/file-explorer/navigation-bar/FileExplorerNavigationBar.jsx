import "./FileExplorerNavigationBar.css";
import {
  IoArrowBack,
  IoArrowForward,
  IoArrowUp,
  IoReload,
} from "react-icons/io5";
import { VscSearch } from "react-icons/vsc";
import { useState, memo, useEffect, useContext } from "react";
import { FcFolder } from "react-icons/fc";
import { VscClose } from "react-icons/vsc";
import { path as Path } from "filer";
import remToPx from "../../../../utils/helpers/remToPx";
import { FileSystemContext } from "../../../../contexts/FileSystemContext";
import usePathHistory from "../../../../hooks/usePathHistory";

const FileExplorerNavigationBar = ({
  path,
  setPath,
  changePath,
  setSearchResults,
  setExpandBranches,
}) => {
  const [searchBoxWidth, setSearchBoxWidth] = useState("5rem");
  const [minWidth] = useState(remToPx("5rem"));
  const [address, setAddress] = useState(path);
  const [search, setSearch] = useState("");
  const { exists, findFSO } = useContext(FileSystemContext);
  const [previous, goBack, current, goForth, next, watchPath] =
    usePathHistory(path);

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
      exists(address)
        .then(() => {
          setExpandBranches(true);
          changePath(address);
        })
        .catch((e) => {
          alert(
            'Windows cant find "' +
              address +
              '". Check the spelling and try again.'
          );
          setAddress(path);
        });
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const startSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      findFSO(path, true, search, setSearchResults);
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
    setSearch("");
  };

  const handleResizeStart = (e) => {
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  };

  const handleResize = (e) => {
    const { offsetX } = e.nativeEvent;
    if (offsetX > -100) {
      const newWidth = remToPx(searchBoxWidth) - offsetX;
      setSearchBoxWidth(newWidth > minWidth ? newWidth : minWidth);
      console.log(offsetX, newWidth, minWidth);
    }
  };

  const goUp = () => {
    changePath(Path.join(path, ".."));
  };

  const resetAddress = () => {
    setAddress(path);
  };

  useEffect(() => {
    address !== path && setAddress(path);
  }, [path]);

  useEffect(() => {
    watchPath(path);
    setSearchResults([]);
  }, [path]);

  useEffect(() => {
    path !== current && setPath(current);
  }, [current]);

  return (
    <div className='flex-center fx-navigation-bar'>
      <div className='flex-center buttons-navigation'>
        <div
          onClick={previous.length && goBack}
          className={!previous.length && "disabled"}
        >
          <IoArrowBack />
        </div>
        <div
          onClick={next.length && goForth}
          className={!next.length && "disabled"}
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

      <div
        className='flex-center file-search-box'
        style={{ flexBasis: searchBoxWidth }}
      >
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
