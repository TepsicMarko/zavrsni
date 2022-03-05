import './ColumnHeading.css';
import { useState, memo } from 'react';
import remToPx from '../../../../../utils/helpers/remToPx';

const ColumnHeading = ({ name, width, setColumnHeadingWidth, visible }) => {
  const [initialWidth, setInitialWidth] = useState(remToPx(width));

  const handleResizeStart = (e) => {
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  };

  const handleResize = (e) => {
    e.stopPropagation();
    if (typeof width === 'string') width = remToPx(width);
    const { offsetX } = e.nativeEvent;
    const newWidth = width + offsetX;
    setColumnHeadingWidth(name, newWidth >= initialWidth ? newWidth : initialWidth);
  };

  return (
    <>
      {visible && (
        <div style={{ width }} className='column-heading'>
          {name}
          <div
            draggable
            onDragStart={handleResizeStart}
            onDrag={handleResize}
            onDragEnd={handleResize}
            className='column-heading-resize'
          ></div>
        </div>
      )}
    </>
  );
};

export default memo(ColumnHeading);
