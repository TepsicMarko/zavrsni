import './TaskbarIcon.css';
import { cloneElement, useState, useRef, useContext, useLayoutEffect } from 'react';
import ThumbnailPreview from '../thumbnail-preview/ThumbnailPreview';
import { ThumbnailPreviewsContext } from '../../../../contexts/ThumbnailPreviewsContext';

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
  const taskbarIconRef = useRef(null);
  const timeoutIdRef = useRef(null);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [wasThumbnailShown, setWasThumbnailShown] = useState(false);
  const { setThumbnailPreviewLocation } = useContext(ThumbnailPreviewsContext);

  const handleClick = (e) => {
    e.stopPropagation();
    setIsMouseOver(false);
    const numberOfInstances = Object.keys(processes[name] || {}).length;
    const isOnlyInstanceAChildProcess =
      Object.values(processes[name] || {})[0]?.isChildProcess || false;
    const isAtLeastOneInstanceARegularProcess = Object.values(processes[name] || {}).some(
      (processInstance) => !processInstance.isChildProcess
    );

    if (
      !processes[name] ||
      !numberOfInstances ||
      (numberOfInstances === 1 && isOnlyInstanceAChildProcess)
    )
      startProcess(name);
    else if (
      (numberOfInstances === 1 && !isOnlyInstanceAChildProcess) ||
      (numberOfInstances === 2 && isAtLeastOneInstanceARegularProcess)
    ) {
      Object.entries(processes[name]).forEach(([pid, processInstance]) => {
        if (!processInstance.isChildProcess) {
          !processInstance.minimized
            ? !processInstance.isFocused
              ? focusProcess(name, pid)
              : !Object.keys(processInstance.childProcess || {}).length &&
                minimizeToTaskbar(name, pid)
            : focusProcess(name, pid);
        }
      });
    }

    colapseStartMenu();
    closeWindowsSearch();
  };

  const handleMouseOver = () => {
    clearInterval(timeoutIdRef.current);
    setIsMouseOver(true);
  };
  const handleMouseLeave = () =>
    wasThumbnailShown
      ? (timeoutIdRef.current = setTimeout(() => setIsMouseOver(false), 250))
      : setIsMouseOver(false);

  const isAnyInstanceFocused = () =>
    Object.values(processes[name] || {}).some((process) => process.isFocused);

  useLayoutEffect(() => {
    const { top, right, bottom, left } = taskbarIconRef.current.getBoundingClientRect();

    setThumbnailPreviewLocation(name, {
      y: top + (bottom - top) / 2,
      x: left + (right - left) / 2,
    });
  }, []);

  return (
    <div
      ref={taskbarIconRef}
      className='flex-center taskbar-icon'
      style={{
        backgroundColor: isAnyInstanceFocused() ? 'rgba(255, 255, 255, 0.25)' : '',
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseLeave}
    >
      {cloneElement(icon, { size: '1.5rem' })}
      {Object.values(processes[name] || {}).some(
        (processInstance) => !processInstance.isChildProcess
      ) ? (
        <span style={{ width: isAnyInstanceFocused() ? '100%' : '' }}></span>
      ) : null}
      {isMouseOver && Object.keys(processes[name] || {}).length ? (
        <ThumbnailPreview
          name={name}
          endProcess={endProcess}
          focusProcess={focusProcess}
          wasThumbnailShown={wasThumbnailShown}
          setWasThumbnailShown={setWasThumbnailShown}
        />
      ) : null}
    </div>
  );
};

export default TaskbarIcon;
