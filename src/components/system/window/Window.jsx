import "./Window.css";
import React, { useState } from "react";

const Window = ({ children }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [width, setWidth] = useState(
    document.documentElement.clientWidth * 0.75
  );
  const [height, setHeight] = useState(
    document.documentElement.clientHeight * 0.7
  );

  const updateWindowPosition = (e) => {
    const { clientX, clientY } = e;
    setPosition({ top: clientY - offset.y, left: clientX - offset.x });
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setDragImage(new Image(), 0, 0);
    const { offsetX, offsetY } = e.nativeEvent;
    setOffset({ x: offsetX, y: offsetY });
  };
  const handleDrag = (e) => updateWindowPosition(e);
  const handleDragEnd = (e) => updateWindowPosition(e);

  const handleResizeStart = (e) => {
    e.stopPropagation();
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  };
  const resize = (e) => {
    e.stopPropagation();
    const { offsetX, offsetY } = e.nativeEvent;
    const className = e.target.getAttribute("class");
    const position = className.slice(className.indexOf("-") + 1);

    if (position === "l" || position === "r") {
      const newWidth = width + offsetX;
      setWidth(newWidth > 0 ? newWidth : width);
    } else if (position === "t" || position === "b") {
      const newHeight = height + offsetY;
      setHeight(newHeight > 0 ? newHeight : height);
    } else {
      const newWidth = width + offsetX;
      const newHeight = height + offsetY;
      setWidth(newWidth > 0 ? newWidth : width);
      setHeight(newHeight > 0 ? newHeight : height);
    }
  };
  const handleResizeEnd = (e) => e.stopPropagation();

  const maximiseWindow = () => {
    const { clientWidth, clientHeight } = document.documentElement;
    setHeight(clientHeight);
    setWidth(clientWidth);
    setPosition({ top: 0, left: 0 });
  };

  return (
    <div
      draggable
      className='window'
      style={{ width, height, ...position }}
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
        i === 0 ? React.cloneElement(child, { maximiseWindow }) : child
      )}
    </div>
  );
};

export default Window;
