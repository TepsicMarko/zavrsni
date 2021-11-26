import "./ColumnHeading.css";
import { useState } from "react";
import remToPx from "../../../../../helpers/remToPx";

const ColumnHeading = ({ name }) => {
  const [width, setWidth] = useState({
    current: remToPx("4.5rem"),
    initial: remToPx("4.5rem"),
  });

  const handleResizeStart = (e) => {
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  };

  const handleResize = (e) => {
    const { offsetX } = e.nativeEvent;
    const newWidth = width.current + offsetX;
    setWidth({
      ...width,
      current: newWidth >= width.initial ? newWidth : width.initial,
    });
  };

  return (
    <div style={{ width: width.current }} className='column-heading'>
      {name}
      <div
        draggable
        onDragStart={handleResizeStart}
        onDrag={handleResize}
        onDragEnd={handleResize}
        className='column-heading-resize'
      ></div>
    </div>
  );
};

export default ColumnHeading;
