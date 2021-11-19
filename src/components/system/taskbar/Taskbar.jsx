import "./Taskbar.css";
import { useState, useEffect, useRef } from "react";
import { BsWindows } from "react-icons/bs";
import { VscSearch } from "react-icons/vsc";
import { MdOutlineKeyboardArrowUp, MdMessage } from "react-icons/md";
import { AiOutlineWifi } from "react-icons/ai";
import { GiSpeaker } from "react-icons/gi";
import remToPx from "../../../helpers/remToPx";
import moment from "moment";

import useToggle from "../../../hooks/useToggle";

const Taskbar = ({
  width,
  height,
  accentColor,
  handleDragStart,
  handleDrag,
  handleDragEnd,
  taskbarPosition,
  taskbarOrientation,
  setTaskbarDimensions,
}) => {
  const [isSearchFocused, toggleFocused] = useToggle();
  const [time, setTime] = useState(moment().format("h:mm a"));
  const [isResizing, toggleResizing] = useToggle();
  const verticalWidthRef = useRef(0);
  const horizontalHeightRef = useRef(0);

  const isVerticalClassName = (className) => {
    return `${className}${
      taskbarOrientation === "vertical" ? "-vertical" : ""
    }`;
  };

  const determineRotaion = () => {
    switch (Object.keys(taskbarPosition)[0]) {
      case "top":
        return "180deg";
      case "right":
        return "270deg";
      case "bottom":
        return "0deg";
      case "left":
        return "90deg";
    }
  };

  const handleResizeStart = () => {
    toggleResizing();
  };
  const handleResize = (e) => {
    const position = Object.keys(taskbarPosition)[0];
    const { clientHeight, clientWidth } = document.documentElement;
    const maxHeight = clientHeight * 0.5;

    const newHeight =
      e.clientY < maxHeight
        ? position === "bottom"
          ? maxHeight
          : e.clientY
        : position === "top"
        ? maxHeight
        : clientHeight - e.clientY;

    const maxWidth = clientWidth * 0.5;
    const newWidth =
      e.clientX < maxWidth
        ? position === "right"
          ? maxWidth
          : e.clientX
        : position === "left"
        ? maxWidth
        : clientWidth - e.clientX;

    const newTaskbarDimensions = {
      width:
        taskbarOrientation === "horizontal"
          ? width
          : newWidth <= maxWidth
          ? newWidth
          : maxWidth,
      height:
        taskbarOrientation === "vertical"
          ? height
          : newHeight <= maxHeight
          ? newHeight
          : maxHeight,
    };

    setTaskbarDimensions(newTaskbarDimensions);
    taskbarOrientation === "vertical" &&
      (verticalWidthRef.current = newTaskbarDimensions.width);
    taskbarOrientation === "horizontal" &&
      (horizontalHeightRef.current = newTaskbarDimensions.height);
  };
  const handleResizeEnd = (e) => {
    handleResize(e);
    toggleResizing();
  };

  const calcResizePosition = () => {
    switch (Object.keys(taskbarPosition)[0]) {
      case "top":
        return { bottom: 0, height: "0.35rem ", width: "100%" };
      case "right":
        return { left: 0, width: "0.35rem ", height: "100%" };
      case "bottom":
        return { top: 0, height: "0.35rem ", width: "100%" };
      case "left":
        return { right: 0, width: "0.35rem ", height: "100%" };
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("updating time");
      setTime(moment().format("h:mm a"));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        backgroundColor: accentColor,
        width:
          verticalWidthRef.current > remToPx(width) &&
          taskbarOrientation === "vertical"
            ? verticalWidthRef.current
            : width,
        height:
          horizontalHeightRef.current > remToPx(height) &&
          taskbarOrientation === "horizontal"
            ? horizontalHeightRef.current
            : height,
        ...taskbarPosition,
      }}
      className={isVerticalClassName("taskbar")}
      draggable
      onDragStart={!isResizing ? handleDragStart : null}
      onDrag={!isResizing ? handleDrag : null}
      onDragEnd={!isResizing ? handleDragEnd : null}
    >
      <div
        className='taskbar-resize'
        style={{
          ...calcResizePosition(),
          cursor: taskbarOrientation === "vertical" ? "w-resize" : "s-resize",
        }}
        draggable
        onDragStart={handleResizeStart}
        onDrag={handleResize}
        onDragEnd={handleResizeEnd}
      ></div>
      <div className={isVerticalClassName("start-and-search")}>
        <div className='flex-center start'>
          <BsWindows color='white' size='1.15rem' />
        </div>
        <div className='flex-center windows-search'>
          <VscSearch
            className={isVerticalClassName("search-icon")}
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
      <div className={isVerticalClassName("system-tray")}>
        <div
          className='open-apps'
          style={{ transform: `rotate(${determineRotaion()})` }}
        >
          <MdOutlineKeyboardArrowUp size='2rem' />
        </div>
        <div className='network'>
          <AiOutlineWifi size='1.25rem' />
        </div>
        <div className='sound'>
          <GiSpeaker size='1.5rem' />
        </div>
        <div className='language'>
          {navigator.language || navigator.userLanguage}
        </div>
        <div className={isVerticalClassName("current-date")}>
          {time} <br /> {height >= 96 && [moment().format("dddd"), <br />]}
          {moment().format("DD/MM/yyyy")}
        </div>
        <div className={isVerticalClassName("windows-notifications")}>
          <MdMessage size='1.35rem' />
        </div>
      </div>
    </div>
  );
};

export default Taskbar;
