import "./Taskbar.css";
import { useState } from "react";
import { BsWindows } from "react-icons/bs";
import { VscSearch } from "react-icons/vsc";

import useToggle from "../../hooks/useToggle";
import useDraggableTaskbar from "../../hooks/useDraggableTaskbar";

const Taskbar = ({ width, height, accentColor }) => {
  const [isSearchFocused, toggleFocused] = useToggle();
  const {
    isDragging,
    taskbarPosition,
    handleDragStart,
    handleDrag,
    handleDragEnd,
  } = useDraggableTaskbar();
  return (
    <div
      className='taskbar'
      style={{
        backgroundColor: accentColor,
        width,
        height,
        ...taskbarPosition,
        transform:
          Object.keys(taskbarPosition)[0] === "left" ||
          Object.keys(taskbarPosition)[0] === "right"
            ? "rotate(90deg)"
            : "",
      }}
      draggable
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
    >
      <div className='start-and-serch'>
        <div className='flex-center start'>
          <BsWindows color='white' />
        </div>
        <div className='windows-search'>
          <VscSearch
            className='search-icon'
            color={isSearchFocused ? "black" : "white"}
          />
          <input
            onFocus={toggleFocused}
            onBlur={toggleFocused}
            type='text'
            placeholder='Type here to search'
            className='search-input'
          />
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
