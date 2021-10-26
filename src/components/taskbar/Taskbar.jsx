import "./Taskbar.css";
import { useState } from "react";
import { BsWindows } from "react-icons/bs";
import { VscSearch } from "react-icons/vsc";

import useToggle from "../../hooks/useToggle";

const Taskbar = ({
  width,
  height,
  accentColor,
  handleDragStart,
  handleDrag,
  handleDragEnd,
  taskbarPosition,
  taskbarOrientation,
}) => {
  const [isSearchFocused, toggleFocused] = useToggle();

  return (
    <div
      className={`taskbar${
        taskbarOrientation === "vertical" ? "-vertical" : ""
      }`}
      style={{
        backgroundColor: accentColor,
        width,
        height,
        ...taskbarPosition,
      }}
      draggable
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
    >
      <div
        className={`start-and-search${
          taskbarOrientation === "vertical" ? "-vertical" : ""
        }`}
      >
        <div className='flex-center start'>
          <BsWindows color='white' />
        </div>
        <div className='flex-center windows-search'>
          <VscSearch
            className={`search-icon${
              taskbarOrientation === "vertical" ? "-vertical" : ""
            }`}
            color={isSearchFocused ? "black" : "white"}
          />
          {taskbarOrientation !== "vertical" && (
            <input
              onFocus={toggleFocused}
              onBlur={toggleFocused}
              type='text'
              placeholder='Type here to search'
              className='search-input'
            />
          )}
        </div>
      </div>
      <div className='app-shortcuts'></div>
      <div className='system-tray'>
        <div className='network'></div>
        <div className='sound'></div>
        <div className='language'></div>
        <div className='current-date'></div>
        <div className='windows-notifications'></div>
      </div>
    </div>
  );
};

export default Taskbar;
