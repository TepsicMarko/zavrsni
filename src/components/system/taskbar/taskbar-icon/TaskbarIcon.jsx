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
      onMouseEnter={
        handleMouseOver
        // if (processes[name]) {
        //   for (let pid of Object.keys(processes[name])) {
        //     console.log(document.getElementById(pid), pid);
        //   }
        // }
      }
      onMouseLeave={handleMouseLeave}
    >
      {cloneElement(icon, { size: '1.5rem' })}
      {Object.keys(processes[name] || {}).length ? <span></span> : null}
      {isMouseOver &&
        processes[name] &&
        Object.keys(processes[name]).map((pid) => (
          <ThumbnailPreview id={pid} icon={icon} name={name} />
        ))}
    </div>
  );
};

export default TaskbarIcon;
