import './TaskbarIcon.css';
import { cloneElement, useState, useRef, useContext } from 'react';
import ThumbnailPreview from '../thumbnail-preview/ThumbnailPreview';

const TaskbarIcon = ({
  name,
  icon,
  focusProcess,
  startProcess,
  endProcess,
  processes,
  colapseStartMenu,
  closeWindowsSearch,
  minimizeToTaskbar,
}) => {
  const timeoutIdRef = useRef(null);
  const [isMouseOver, setIsMouseOver] = useState(false);

  const handleClick = () => {
    if (!processes[name] || !Object.keys(processes[name]).length) startProcess(name);
    else if (Object.keys(processes[name]).length === 1) {
      !processes[name][Object.keys(processes[name])[0]].minimized &&
      processes[name][Object.keys(processes[name])[0]].isFocused
        ? minimizeToTaskbar(name, Object.keys(processes[name])[0])
        : focusProcess(name);
    }

    colapseStartMenu();
    closeWindowsSearch();
  };

  const handleMouseOver = () => {
    clearInterval(timeoutIdRef.current);
    setIsMouseOver(true);
  };
  const handleMouseLeave = () =>
    (timeoutIdRef.current = setTimeout(() => setIsMouseOver(false), 250));

  const isAnyInstanceFocused = () =>
    Object.values(processes[name] || {}).some((process) => process.isFocused);

  return (
    <div
      className='flex-center taskbar-icon'
      style={{
        backgroundColor: isAnyInstanceFocused() ? 'rgba(255, 255, 255, 0.25)' : '',
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseLeave}
    >
      {cloneElement(icon, { size: '1.5rem' })}
      {Object.keys(processes[name] || {}).length ? (
        <span style={{ width: isAnyInstanceFocused() ? '100%' : '' }}></span>
      ) : null}
      {isMouseOver && (
        <ThumbnailPreview
          name={name}
          endProcess={endProcess}
          focusProcess={focusProcess}
        />
      )}
    </div>
  );
};

export default TaskbarIcon;
