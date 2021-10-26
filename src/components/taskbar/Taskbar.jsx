import "./Taskbar.css";
import { useState, useEffec, useEffect } from "react";
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
}) => {
  const [isSearchFocused, toggleFocused] = useToggle();
  const [time, setTime] = useState(moment().format("h:mm a"));

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

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("updating time");
      setTime(moment().format("h:mm a"));
    }, 60000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div
      className={isVerticalClassName("taskbar")}
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
          {time} <br /> {moment().format("DD/MM/yyyy")}
        </div>
        <div className={isVerticalClassName("windows-notifications")}>
          <MdMessage size='1.35em' />
        </div>
      </div>
    </div>
  );
};

export default Taskbar;
