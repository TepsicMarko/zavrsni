import "./Window.css";
import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import remToPx from "../../../utils/helpers/remToPx";
import { ProcessesContext } from "../../../contexts/ProcessesContext";
import { WindowDimensionsContext } from "../../../contexts/WindowDimensionsContext";
import TitleBar from "./title-bar/TitleBar";

const Window = ({
  children,
  app,
  pid,
  displayAppName = true,
  icon,
  minWindowWidth,
  minWindowHeight,
  titleBar,
  parentProcess,
  onClose,
  resizable = true,
  fileName,
  enableIframe,
  disableIframe,
  zIndex,
}) => {
  const [minWidth] = useState(remToPx(minWindowWidth));
  const [minHeight] = useState(remToPx(minWindowHeight));
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [width, setWidth] = useState(
    resizable ? document.documentElement.clientWidth * 0.75 : minWidth
  );
  const [height, setHeight] = useState(
    resizable ? document.documentElement.clientHeight * 0.7 : minHeight
  );

  const { endProcess, minimiseToTaskbar, processes, focusProcess } =
    useContext(ProcessesContext);
  const optionalWindowDimensionsContext = useContext(WindowDimensionsContext);

  const appDataRef = useRef({ width, height, position });
  const previousDimensionsAndPositionRef = useRef({});

  const updateWindowPosition = (e) => {
    const { clientX, clientY } = e;
    setPosition({ top: clientY - offset.y, left: clientX - offset.x });
  };

  const handleDragStart = useCallback(
    (e) => {
      resizable && setFocus();
      const { offsetX, offsetY } = e.nativeEvent;
      e.dataTransfer.setDragImage(new Image(), 0, 0);
      setOffset({ x: offsetX, y: offsetY });
    },
    [processes]
  );

  const handleDrag = useCallback((e) => updateWindowPosition(e), [offset]);
  const handleDragEnd = useCallback((e) => updateWindowPosition(e), [offset]);
  const handleResizeStart = (e) => {
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
    const className = e.target.getAttribute("class");
    const handlePosition = className.slice(className.indexOf("-") + 1);

    if (handlePosition === "l" || handlePosition === "r") {
      let newWidth = width + offsetX;
      if (handlePosition === "l") {
        handleLeftResizeHandle(offsetX);
      } else setWidth(newWidth > minWidth ? newWidth : width);
    }

    if (handlePosition === "t" || handlePosition === "b") {
      let newHeight = height + offsetY;
      if (handlePosition === "t") {
        handleTopResizeHandle(offsetY);
      } else setHeight(newHeight > minHeight ? newHeight : height);
    }

    if (handlePosition === "bl") {
      let newHeight = height + offsetY;
      handleLeftResizeHandle(offsetX);
      setHeight(newHeight > minHeight ? newHeight : height);
    }

    if (handlePosition === "tl") {
      const newPosition = {};
      const top = handleTopResizeHandle(offsetY, true);
      const left = handleLeftResizeHandle(offsetX, true);
      newPosition.top = top !== undefined ? top : position.top;
      newPosition.left = left !== undefined ? left : position.left;
      setPosition(newPosition);
    }

    if (handlePosition === "tr") {
      const newWidth = width + offsetX;
      handleTopResizeHandle(offsetY);
      setWidth(newWidth > minWidth ? newWidth : width);
    }

    if (handlePosition === "br") {
      const newWidth = width + offsetX;
      const newHeight = height + offsetY;
      setWidth(newWidth > minWidth ? newWidth : width);
      setHeight(newHeight > minHeight ? newHeight : height);
    }
  };
  const handleResizeEnd = (e) => {
    enableIframe && enableIframe();
    e.stopPropagation();
  };

  const closeWindow = useCallback(
    (e) => {
      e.stopPropagation();
      if (onClose) {
        onClose(endProcess);
      } else endProcess(app, pid, parentProcess);
    },
    [app, endProcess, parentProcess, onClose]
  );

  const minimiseWindow = useCallback(
    () => minimiseToTaskbar(app, pid),
    [app, minimiseToTaskbar]
  );

  const maximiseWindow = useCallback(() => {
    const { clientWidth, clientHeight } = document.documentElement;
    if (height >= clientHeight && width >= clientWidth) {
      const { width, height, position } =
        previousDimensionsAndPositionRef.current;
      setHeight(height);
      setWidth(width);
      setPosition(position);
    } else {
      previousDimensionsAndPositionRef.current = { width, height, position };
      setHeight(clientHeight);
      setWidth(clientWidth);
      setPosition({ top: 0, left: 0 });
    }
  }, [height, width, previousDimensionsAndPositionRef.current]);

  const setFocus = () => focusProcess(app, pid, parentProcess);

  useEffect(() => {
    appDataRef.current = { width, height, position };
  }, [width, height, position]);

  useEffect(() => {
    const saveAppData = () => {
      sessionStorage.setItem(
        app,
        JSON.stringify({
          ...appDataRef.current,
          previousDimensionsAndPosition:
            previousDimensionsAndPositionRef.current,
        })
      );
    };

    const loadAppData = () => {
      const appData = sessionStorage.getItem(app);
      if (appData) {
        const { width, height, position, previousDimensionsAndPosition } =
          JSON.parse(appData);
        setWidth(width);
        setHeight(height);
        setPosition(position);
        previousDimensionsAndPositionRef.current =
          previousDimensionsAndPosition;
      }
    };

    loadAppData();

    return saveAppData;
  }, []);

  useEffect(() => {
    optionalWindowDimensionsContext &&
      optionalWindowDimensionsContext.handleWindowDimensionsChange({
        width,
        height,
      });
  }, [width, height]);

  return (
    <div
      className='window'
      style={{
        width,
        height,
        ...position,
        minWidth,
        minWindowHeight,
        zIndex: zIndex
          ? zIndex
          : processes[parentProcess || app][pid] &&
            processes[parentProcess || app][pid].focusLevel +
              (parentProcess ? 1 : 0),
        visibility: processes[app][pid]
          ? !processes[app][pid].minimised
            ? "visible"
            : "hidden"
          : "",
      }}
      onClick={resizable && setFocus}
    >
      {resizable &&
        [
          "resize-l",
          "resize-t",
          "resize-r",
          "resize-b",
          "resize-bl",
          "resize-tl",
          "resize-tr",
          "resize-br",
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
        minimiseWindow={minimiseWindow}
        handleDragStart={handleDragStart}
        handleDrag={handleDrag}
        handleDragEnd={handleDragEnd}
        name={displayAppName ? fileName || app : ""}
        icon={icon}
        parentProcess={parentProcess}
        overlay={titleBar.overlay}
      />
      {children}
    </div>
  );
};

export default Window;
