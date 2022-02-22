import './Taskbar.css';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { BsWindows } from 'react-icons/bs';
import { VscSearch } from 'react-icons/vsc';
import { MdOutlineKeyboardArrowUp, MdMessage } from 'react-icons/md';
import { AiOutlineWifi } from 'react-icons/ai';
import { GiSpeaker } from 'react-icons/gi';
import moment from 'moment';
import { ProcessesContext } from '../../../contexts/ProcessesContext';
import useToggle from '../../../hooks/useToggle';
import useInput from '../../../hooks/useInput';
import processConfigurations from '../../../utils/constants/processConfigurations';
import StartMenu from './start-menu/StartMenu';
import WindowsSearch from '../windows-search/WindowsSearch';
import TaskbarIcon from './taskbar-icon/TaskbarIcon';

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
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [time, setTime] = useState(moment().format('h:mm A'));
  const [isResizing, toggleResizing] = useToggle();
  const [isStartMenuVisible, setStartMenuVisibility] = useState(false);
  const [isWindowsSearchOpen, setIsWindowsSearchOpen] = useState(false);
  const [searchVal, handleSearchChange] = useInput();
  const verticalWidthRef = useRef(0);
  const horizontalHeightRef = useRef(0);
  const { processes, startProcess, focusProcess, endProcess, minimizeToTaskbar } =
    useContext(ProcessesContext);

  const isVerticalClassName = (className) => {
    return `${className}${taskbarOrientation === 'vertical' ? '-vertical' : ''}`;
  };

  const colapseStartMenu = () => setStartMenuVisibility(false);
  const closeWindowsSearch = () => setIsWindowsSearchOpen(false);
  const openWindowsSearch = () => {
    setIsSearchFocused(true);
    setIsWindowsSearchOpen(true);
  };

  const handleResize = (e) => {
    const position = taskbarPosition;
    const { clientHeight, clientWidth } = document.documentElement;
    const maxHeight = clientHeight * 0.5;
    const maxWidth = clientWidth * 0.5;

    // prettier-ignore
    const newHeight =
      e.clientY < maxHeight
        ? position === 'bottom'
          ? maxHeight
          : e.clientY
        : position === 'top'
          ? maxHeight
          : clientHeight - e.clientY;

    // prettier-ignore
    const newWidth =
      e.clientX < maxWidth
        ? position === 'right'
          ? maxWidth
          : e.clientX
        : position === 'left'
          ? maxWidth
          : clientWidth - e.clientX;

    // prettier-ignore
    const newTaskbarDimensions = {
      width:
        taskbarOrientation === 'horizontal'
          ? width
          : newWidth <= maxWidth
            ? newWidth
            : maxWidth,
      height:
        taskbarOrientation === 'vertical'
          ? height
          : newHeight <= maxHeight
            ? newHeight
            : maxHeight,
    };

    setTaskbarDimensions(newTaskbarDimensions);
    taskbarOrientation === 'vertical' &&
      (verticalWidthRef.current = newTaskbarDimensions.width);
    taskbarOrientation === 'horizontal' &&
      (horizontalHeightRef.current = newTaskbarDimensions.height);
  };
  const handleResizeEnd = (e) => {
    handleResize(e);
    toggleResizing();
  };

  const calcResizePosition = () => {
    switch (taskbarPosition) {
      case 'top':
        return { bottom: 0, height: '0.35rem ', width: '100%' };
      case 'right':
        return { left: 0, width: '0.35rem ', height: '100%' };
      case 'bottom':
        return { top: 0, height: '0.35rem ', width: '100%' };
      case 'left':
        return { right: 0, width: '0.35rem ', height: '100%' };
    }
  };

  const toggleStartMenu = () => {
    setStartMenuVisibility(!isStartMenuVisible);
    closeWindowsSearch();
  };

  useEffect(() => {
    let interval = null;

    setTimeout(() => {
      setTime(moment().format('h:mm A'));
      interval = setInterval(() => setTime(moment().format('h:mm A')), 60000);
    }, Math.abs(new Date().getSeconds() * 100 - 6000) * 10);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (taskbarOrientation === 'horizontal')
      setTaskbarDimensions({
        height: horizontalHeightRef.current || '2.75rem',
        width: '100vw',
      });

    if (taskbarOrientation === 'vertical')
      setTaskbarDimensions({
        height: '100vh',
        width: verticalWidthRef.current || '4.25rem',
      });
  }, [taskbarPosition]);

  return (
    <div
      style={{
        backgroundColor: accentColor,
        width,
        height,
      }}
      className={isVerticalClassName('taskbar')}
      draggable={!isStartMenuVisible && !isWindowsSearchOpen}
      onDragStart={!isResizing ? handleDragStart : null}
      onDrag={!isResizing ? handleDrag : null}
      onDragEnd={!isResizing ? handleDragEnd : null}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        className='taskbar-resize'
        style={{
          ...calcResizePosition(),
          cursor: taskbarOrientation === 'vertical' ? 'w-resize' : 's-resize',
        }}
        draggable
        onDragStart={toggleResizing}
        onDrag={handleResize}
        onDragEnd={handleResizeEnd}
      ></div>
      <div className={isVerticalClassName('start-and-search')}>
        <div
          className='flex-center start'
          onClick={toggleStartMenu}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <BsWindows color='white' size='1.15rem' />
        </div>
        <div className='flex-center windows-search-bar'>
          <VscSearch
            className={isVerticalClassName('search-icon')}
            color={isSearchFocused ? 'black' : 'white'}
          />
          {taskbarOrientation !== 'vertical' && (
            <input
              value={searchVal}
              onChange={handleSearchChange}
              onBlur={() => setIsSearchFocused(false)}
              type='text'
              placeholder='Type here to search'
              className='search-input'
              onMouseDown={(e) => {
                e.stopPropagation();
                colapseStartMenu();
              }}
              onFocus={openWindowsSearch}
            />
          )}
          <WindowsSearch
            searchFor={searchVal}
            isWindowsSearchOpen={isWindowsSearchOpen}
            closeWindowsSearch={closeWindowsSearch}
            startProcess={startProcess}
          />
        </div>
      </div>
      <div className='app-shortcuts'>
        {Object.entries(processConfigurations)
          .filter(([name, appConfig]) => appConfig.pinnedToTaskbar)
          .map(([name, appConfig]) => (
            <TaskbarIcon
              name={name}
              icon={appConfig.icon}
              focusProcess={focusProcess}
              startProcess={startProcess}
              endProcess={endProcess}
              processes={processes}
              colapseStartMenu={colapseStartMenu}
              closeWindowsSearch={closeWindowsSearch}
              minimizeToTaskbar={minimizeToTaskbar}
            />
          ))}
      </div>

      <div className={isVerticalClassName('system-tray')}>
        <div className='open-apps'>
          <MdOutlineKeyboardArrowUp size='2rem' />
        </div>
        <div className='network'>
          <AiOutlineWifi size='1.25rem' />
        </div>
        <div className='sound'>
          <GiSpeaker size='1.5rem' />
        </div>
        <div className='language'>{navigator.language || navigator.userLanguage}</div>
        <div className={isVerticalClassName('current-date')}>
          {time} <br /> {height >= 96 && [moment().format('dddd'), <br />]}
          {moment().format('M/DD/yyyy')}
        </div>
        <div className={isVerticalClassName('windows-notifications')}>
          <MdMessage size='1.35rem' />
        </div>
      </div>

      <StartMenu
        isStartMenuVisible={isStartMenuVisible}
        colapseStartMenu={colapseStartMenu}
      />
    </div>
  );
};

export default Taskbar;
