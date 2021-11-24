import "./FileExplorerNavigationBar.css";
import {
  IoArrowBack,
  IoArrowForward,
  IoArrowUp,
  IoReload,
} from "react-icons/io5";
import { VscSearch } from "react-icons/vsc";
import { useState } from "react";

const FileExplorerNavigationBar = ({}) => {
  const [searchBoxWidth, setSearchBoxWidth] = useState("5rem");
  return (
    <div className='flex-center fx-navigation-bar'>
      <div className='flex-center buttons-navigation'>
        <div>
          <IoArrowBack />
        </div>
        <div>
          <IoArrowForward />
        </div>
        <div>
          <IoArrowUp />
        </div>
      </div>
      <div className='flex-center address-bar'>
        <div className='folder-icon'></div>
        <input type='text' className='folder-path' />
        <div className='flex-center refresh-folder-view'>
          <IoReload size='0.75rem' color='gray' />
        </div>
      </div>
      <div
        className='flex-center file-search-box'
        style={{ width: searchBoxWidth }}
      >
        <div className='resize-search-box'></div>
        <VscSearch size='0.75rem' color='gray' />
        <input type='text' />
      </div>
    </div>
  );
};

export default FileExplorerNavigationBar;
