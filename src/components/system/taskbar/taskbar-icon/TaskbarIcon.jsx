import './TaskbarIcon.css';
import { cloneElement, useState } from 'react';
import ThumbnailPreview from '../thumbnail-preview/ThumbnailPreview';

const TaskbarIcon = ({
  name,
  icon,
  focusProcess,
  startProcess,
  processes,
  colapseStartMenu,
  closeWindowsSearch,
}) => {
  const [isMouseOver, setIsMouseOver] = useState(false);

  const handleClick = () => {
    if (!processes[name]) startProcess(name);
    else focusProcess(name);

    colapseStartMenu();
    closeWindowsSearch();
  };

  const handleMouseOver = () => setIsMouseOver(true);
  const handleMouseLeave = () => setIsMouseOver(false);

  return (
    <div
      className='flex-center taskbar-icon'
      onClick={handleClick}
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseLeave}
    >
      {cloneElement(icon, { size: '1.5rem' })}
      {Object.keys(processes[name] || {}).length ? <span></span> : null}
      {isMouseOver &&
        processes[name] &&
        Object.keys(processes).map((name, i) => (
          <ThumbnailPreview processes={processes[name]} name={name} />
        ))}
    </div>
  );
};

export default TaskbarIcon;
