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
}) => {
  const timeoutIdRef = useRef(null);
  const [isMouseOver, setIsMouseOver] = useState(false);

  const handleClick = () => {
    if (!processes[name]) startProcess(name);
    else focusProcess(name);

    colapseStartMenu();
    closeWindowsSearch();
  };

  const handleMouseOver = () => {
    clearInterval(timeoutIdRef.current);
    setIsMouseOver(true);
  };
  const handleMouseLeave = () =>
    (timeoutIdRef.current = setTimeout(() => setIsMouseOver(false), 250));

  return (
    <div
      className='flex-center taskbar-icon'
      onClick={handleClick}
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseLeave}
    >
      {cloneElement(icon, { size: '1.5rem' })}
      {Object.keys(processes[name] || {}).length ? <span></span> : null}
      {isMouseOver && <ThumbnailPreview process={name} endProcess={endProcess} />}
    </div>
  );
};

export default TaskbarIcon;
