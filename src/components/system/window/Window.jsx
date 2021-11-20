import "./Window.css";
import React, { useState, useEffect, useContext, useRef } from "react";
import remToPx from "../../../helpers/remToPx";
import { ProcessesContext } from "../../../contexts/ProcessesContext";

const Window = ({ children, app, icon, minWidth, minHeight }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [width, setWidth] = useState(
    document.documentElement.clientWidth * 0.75
  );
  const [height, setHeight] = useState(
    document.documentElement.clientHeight * 0.7
  );
  const { endProcess, minimiseToTaskbar } = useContext(ProcessesContext);
  const appDataRef = useRef({ width, height, position });
  const previousDimensionsAndPositionRef = useRef({});

  const updateWindowPosition = (e) => {
    const { clientX, clientY } = e;
    setPosition({ top: clientY - offset.y, left: clientX - offset.x });
  };

  const handleDragStart = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    e.dataTransfer.setDragImage(new Image(), 0, 0);
    setOffset({ x: offsetX, y: offsetY });
  };
  const handleDrag = (e) => updateWindowPosition(e);
  const handleDragEnd = (e) => updateWindowPosition(e);

  const handleResizeStart = (e) => {
    e.stopPropagation();
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  };

  const handleLeftResizeHandle = (offsetX, returnPosition) => {
    let newWidth = width - offsetX;
    const newPosition = position.left + offsetX;

    if (newPosition / position.left > 0.5) {
      // checks if offsetX is valid because onDragEnd returns wrong value
      if (newWidth > remToPx(minWidth)) {
        !returnPosition && setPosition({ ...position, left: newPosition });
        setWidth(newWidth);

        if (returnPosition) return newPosition;
      } else setWidth(remToPx(minWidth));
    }
  };

  const handleTopResizeHandle = (offsetY, returnPosition) => {
    let newHeight = height - offsetY;
    const newPosition = position.top + offsetY;

    if (newPosition / position.top > 0.5) {
      // checks if offsetY is valid because onDragEnd returns wrong value
      if (newHeight > remToPx(minHeight)) {
        !returnPosition && setPosition({ ...position, top: newPosition });
        setHeight(newHeight);

        if (returnPosition) return newPosition;
      } else setHeight(remToPx(minHeight));
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
      } else setWidth(newWidth > 0 ? newWidth : width);
    }

    if (handlePosition === "t" || handlePosition === "b") {
      let newHeight = height + offsetY;
      if (handlePosition === "t") {
        handleTopResizeHandle(offsetY);
      } else setHeight(newHeight > 0 ? newHeight : height);
    }

    if (handlePosition === "bl") {
      let newHeight = height + offsetY;
      handleLeftResizeHandle(offsetX);
      setHeight(newHeight > 0 ? newHeight : height);
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
      setWidth(newWidth > 0 ? newWidth : width);
    }

    if (handlePosition === "br") {
      const newWidth = width + offsetX;
      const newHeight = height + offsetY;
      setWidth(newWidth > 0 ? newWidth : width);
      setHeight(newHeight > 0 ? newHeight : height);
    }
  };
  const handleResizeEnd = (e) => e.stopPropagation();

  const closeWindow = () => endProcess(app);
  const minimiseWindow = () => minimiseToTaskbar(app);

  const maximiseWindow = () => {
    const { clientWidth, clientHeight } = document.documentElement;
    console.log(width, clientWidth, height, clientHeight);
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
  };

  useEffect(() => {
    appDataRef.current = { width, height, position };
  }, [width, height, position]);

  useEffect(() => {
    const saveAppData = () => {
      console.log("test");
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

  return (
    <div
      draggable
      className='window'
      style={{ width, height, ...position, minWidth, minHeight }}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
    >
      {[
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
      {children.map((child, i) =>
        i === 0
          ? React.cloneElement(child, {
              maximiseWindow,
              closeWindow,
              minimiseWindow,
              name: app,
              icon,
            })
          : child
      )}
    </div>
  );
};

export default Window;
