import './Window.css';
import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useContext,
  useRef,
  useCallback,
} from 'react';
import remToPx from '../../../utils/helpers/remToPx';
import { ProcessesContext } from '../../../contexts/ProcessesContext';
import { ThumbnailPreviewsContext } from '../../../contexts/ThumbnailPreviewsContext';
import TitleBar from './title-bar/TitleBar';
import useClickOutside from '../../../hooks/useClickOutside';

const Window = ({
  children,
  process,
  dialog,
  pid,
  ppid,
  displayTitle = true,
  icon,
  minWindowWidth,
  minWindowHeight,
  titleBar,
  parentProcess,
  onClose,
  resizable = true,
  enableIframe,
  disableIframe,
  zIndex,
  limitedWindowControls = false,
}) => {
  const [minWidth] = useState(remToPx(minWindowWidth));
  const [minHeight] = useState(remToPx(minWindowHeight));
  const [position, setPosition] = useState({ top: null, left: null });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);

  const { endProcess, minimizeToTaskbar, processes, focusProcess, unfocusProcess } =
    useContext(ProcessesContext);
  const { addThumbnailPreview, removeThumbnailPreview, thumbnailPreviewLocations } =
    useContext(ThumbnailPreviewsContext);
  const appDataRef = useRef({ width, height, position });
  const previousDimensionsAndPositionRef = useRef({});
  const windowRef = useClickOutside('click', () => unfocusProcess(process, pid));

  const updateWindowPosition = (e) => {
    e.stopPropagation();
    const { clientX, clientY } = e;
    setPosition({ top: clientY - offset.y, left: clientX - offset.x });
  };

  const setFocus = () => focusProcess(parentProcess || process, ppid || pid);

  const handleDragStart = useCallback(
    (e) => {
      e.stopPropagation();
      setIsDragging(true);
      setFocus();
      const { offsetX, offsetY } = e.nativeEvent;
      e.dataTransfer.setDragImage(new Image(), 0, 0);
      setOffset({ x: offsetX, y: offsetY });
    },
    [processes, process, pid, parentProcess]
  );

  const handleDrag = useCallback((e) => updateWindowPosition(e), [offset]);
  const handleDragEnd = useCallback(
    (e) => {
      setIsDragging(false);
      updateWindowPosition(e);
    },
    [offset]
  );
  const handleResizeStart = (e) => {
    setIsDragging(true);
    setFocus();
    disableIframe && disableIframe();
    e.stopPropagation();
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  };

  const handleLeftResizeHandle = (offsetX, returnPosition) => {
    let newWidth = width - offsetX;
    const newPosition = position.left + offsetX;

    if (newPosition / position.left > 0.5) {
      // checks if offsetX is valid because onDragEnd returns wrong value
      if (newWidth > minWidth) {
        !returnPosition && setPosition({ ...position, left: newPosition });
        setWidth(newWidth);

        if (returnPosition) return newPosition;
      } else setWidth(minWidth);
    }
  };

  const handleTopResizeHandle = (offsetY, returnPosition) => {
    let newHeight = height - offsetY;
    const newPosition = position.top + offsetY;

    if (newPosition / position.top > 0.5) {
      // checks if offsetY is valid because onDragEnd returns wrong value
      if (newHeight > minHeight) {
        !returnPosition && setPosition({ ...position, top: newPosition });
        setHeight(newHeight);

        if (returnPosition) return newPosition;
      } else setHeight(minHeight);
    }
  };

  const resize = (e) => {
    e.stopPropagation();
    const { offsetX, offsetY } = e.nativeEvent;
    const className = e.target.getAttribute('class');
    const handlePosition = className.slice(className.indexOf('-') + 1);

    if (handlePosition === 'l' || handlePosition === 'r') {
      let newWidth = width + offsetX;
      if (handlePosition === 'l') {
        handleLeftResizeHandle(offsetX);
      } else setWidth(newWidth > minWidth ? newWidth : width);
    }

    if (handlePosition === 't' || handlePosition === 'b') {
      let newHeight = height + offsetY;
      if (handlePosition === 't') {
        handleTopResizeHandle(offsetY);
      } else setHeight(newHeight > minHeight ? newHeight : height);
    }

    if (handlePosition === 'bl') {
      let newHeight = height + offsetY;
      handleLeftResizeHandle(offsetX);
      setHeight(newHeight > minHeight ? newHeight : height);
    }

    if (handlePosition === 'tl') {
      const newPosition = {};
      const top = handleTopResizeHandle(offsetY, true);
      const left = handleLeftResizeHandle(offsetX, true);
      newPosition.top = top !== undefined ? top : position.top;
      newPosition.left = left !== undefined ? left : position.left;
      setPosition(newPosition);
    }

    if (handlePosition === 'tr') {
      const newWidth = width + offsetX;
      handleTopResizeHandle(offsetY);
      setWidth(newWidth > minWidth ? newWidth : width);
    }

    if (handlePosition === 'br') {
      const newWidth = width + offsetX;
      const newHeight = height + offsetY;
      setWidth(newWidth > minWidth ? newWidth : width);
      setHeight(newHeight > minHeight ? newHeight : height);
    }
  };
  const handleResizeEnd = (e) => {
    setIsDragging(false);
    enableIframe && enableIframe();
    e.stopPropagation();
  };

  const closeWindow = useCallback(
    (e) => {
      e.stopPropagation();

      if (onClose) {
        onClose(endProcess);
      } else {
        windowRef.current.style.opacity = '0';
        windowRef.current.style.transform += 'scale(0.9)';

        setTimeout(() => {
          endProcess(process, pid, parentProcess, ppid);
        }, 200);
      }
    },
    [process, endProcess, parentProcess, onClose]
  );

  const minimizeWindow = useCallback(
    (e) => {
      e.stopPropagation();
      minimizeToTaskbar(process, pid);
    },
    [process, processes]
  );

  const maximiseWindow = useCallback(() => {
    const { clientWidth, clientHeight } = document.getElementsByClassName('desktop')[0];
    if (height >= clientHeight && width >= clientWidth) {
      const { width, height, position } = previousDimensionsAndPositionRef.current;
      setHeight(height);
      setWidth(width);
      setPosition(position);
    } else {
      previousDimensionsAndPositionRef.current = { width, height, position };
      setHeight(clientHeight);
      setWidth(clientWidth);
      setPosition({ top: 0, left: 0 });
    }
  }, [height, width, position, previousDimensionsAndPositionRef.current]);

  useEffect(() => {
    appDataRef.current = { width, height, position };
  }, [width, height, position]);

  useLayoutEffect(() => {
    const saveAppData = () => {
      sessionStorage.setItem(
        dialog || process,
        JSON.stringify({
          ...appDataRef.current,
          previousDimensionsAndPosition: previousDimensionsAndPositionRef.current,
        })
      );
    };

    const loadAppData = () => {
      const appData = sessionStorage.getItem(dialog || process);
      if (appData) {
        const { width, height, position, previousDimensionsAndPosition } =
          JSON.parse(appData);
        setWidth(width);
        setHeight(height);
        setPosition(position);
        previousDimensionsAndPositionRef.current = previousDimensionsAndPosition;
      } else {
        setWidth(resizable ? document.documentElement.clientWidth * 0.75 : minWidth);
        setHeight(resizable ? document.documentElement.clientHeight * 0.7 : minHeight);
        setPosition({ top: 0, left: 0 });
      }
    };

    loadAppData();

    return saveAppData;
  }, []);

  useEffect(() => {
    !processes[process][pid].isChildProcess &&
      addThumbnailPreview(
        process,
        titleBar.title || process,
        icon || processes[process][pid].icon,
        pid
      );

    return () =>
      !processes[process][pid].isChildProcess && removeThumbnailPreview(process, pid);
  }, [process, pid, titleBar.title]);

  const minimizeX = !limitedWindowControls ? thumbnailPreviewLocations[process].x : 0;
  const minimizeY = !limitedWindowControls ? thumbnailPreviewLocations[process].y : 0;

  return (
    position.top !== null && (
      <div
        ref={windowRef}
        className='window'
        id={pid}
        style={{
          width,
          height,
          minWidth,
          minHeight,
          zIndex:
            zIndex ||
            processes[parentProcess || process][ppid || pid].focusLevel +
              (parentProcess ? 1 : 0),
          opacity: !processes[process][pid].minimized ? '1' : '0',
          transform: processes[process][pid].minimized
            ? `translate(calc(${minimizeX}px - ${width / 2}px), calc( ${minimizeY}px - ${
                height * 0.5
              }px)) scale(0)`
            : `translate(${position.left}px, ${position.top}px) scale(1)`,
          transition: !isDragging ? '0.15s ease-out, opacity 0.15s linear' : '',
        }}
        onClick={setFocus}
      >
        {resizable &&
          [
            'resize-l',
            'resize-t',
            'resize-r',
            'resize-b',
            'resize-bl',
            'resize-tl',
            'resize-tr',
            'resize-br',
          ].map((el) => (
            <div
              draggable
              className={el}
              onDragStart={handleResizeStart}
              onDrag={resize}
              onDragEnd={handleResizeEnd}
            ></div>
          ))}
        <TitleBar
          backgroundColor={titleBar.backgroundColor}
          color={titleBar.color}
          maximiseWindow={maximiseWindow}
          closeWindow={closeWindow}
          minimizeWindow={minimizeWindow}
          handleDragStart={handleDragStart}
          handleDrag={handleDrag}
          handleDragEnd={handleDragEnd}
          title={displayTitle ? titleBar.title || process : ''}
          icon={icon}
          limitedWindowControls={limitedWindowControls}
          overlay={titleBar.overlay}
        />
        {children}
      </div>
    )
  );
};

export default Window;
