import "./Taskbar.css";
import { useState, useEffect, useRef } from "react";
import { BsWindows } from "react-icons/bs";
import { VscSearch } from "react-icons/vsc";
import { MdOutlineKeyboardArrowUp, MdMessage } from "react-icons/md";
import { AiOutlineWifi } from "react-icons/ai";
import { GiSpeaker } from "react-icons/gi";
import moment from "moment";

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
  setTaskbarDimensions,
}) => {
  const [isSearchFocused, toggleFocused] = useToggle();
  const [time, setTime] = useState(moment().format("h:mm a"));
  const [isResizing, toggleResizing] = useToggle();

  const isVerticalClassName = (className) => {
    return `${className}${
      taskbarOrientation === "vertical" ? "-vertical" : ""
    }`;
  };

  const determineRotaion = () => {
    switch (Object.keys(taskbarPosition)[0]) {
      case "top": {
        if (taskbarOrientation === "horizontal") return "180deg";
        else return "90deg";
      }
      case "right":
        return "270deg";
      case "bottom": {
        if (taskbarOrientation === "horizontal") return "0deg";
        else return "90deg";
      }
    }
  };

  const getAbsoluteValue = (x) => (x * x) / x;

  const handleResizeStart = () => {
    toggleResizing();
  };
  const handleResize = (e) => {
    const position = Object.keys(taskbarPosition)[0];
    const { clientHeight, clientWidth } = document.documentElement;
    const maxHeight = clientHeight * 0.5;
    const newHeight =
      e.clientY < maxHeight
        ? position === "bottom" || position === undefined
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
        : (position === "bottom" && taskbarOrientation === "vertical") ||
          (position === "top" && taskbarOrientation === " vertical")
        ? maxWidth
        : clientWidth - e.clientX;
    setTaskbarDimensions({
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
    });
  };
  const handleResizeEnd = (e) => {
    handleResize(e);
    toggleResizing();
  };

  const calcResizePosition = () => {
    switch (Object.keys(taskbarPosition)[0]) {
      case "top": {
        if (taskbarOrientation === "vertical")
          return { right: 0, width: "0.35rem ", height: "100%" };
        return { bottom: 0, width: "100%", height: "0.35rem" };
      }
      case "right": {
        if (taskbarOrientation === "vertical")
          return { left: 0, width: "0.35rem ", height: "100%" };
        return { left: 0, width: "100% ", height: "0.35rem" };
      }
      case "bottom": {
        if (taskbarOrientation === "vertical")
          return { right: 0, width: "0.35rem ", height: "100%" };
        return { top: 0, width: "100% ", height: "0.35rem" };
      }
      case undefined: {
        return { top: 0, width: "100% ", height: "0.35rem" };
      }
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
        width,
        height,
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
          <BsWindows color='white' />
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
          <MdMessage size='1.35em' />
        </div>
      </div>
    </div>
  );
};

export default Taskbar;
