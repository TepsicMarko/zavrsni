import './ColumnHeading.css';
import { useState, memo } from 'react';
import remToPx from '../../../../../utils/helpers/remToPx';

const ColumnHeading = ({ name, visible, sortFolderContent }) => {
  const [minWidth] = useState(remToPx('4.5rem'));
  const [width, setWidth] = useState(remToPx('4.5rem'));

  const handleResizeStart = (e) => {
    e.stopPropagation();
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  };

  const handleResize = (e) => {
    e.stopPropagation();
    const { offsetX } = e.nativeEvent;
    const newWidth = width + offsetX;
    setWidth(newWidth >= minWidth ? newWidth : minWidth);
  };

  return (
    <>
      {visible && (
        <th
          style={{ width, minWidth: width }}
          className='column-heading'
          onClick={sortFolderContent}
        >
          {name}
          <div
            draggable
            onDragStart={handleResizeStart}
            onDrag={handleResize}
            onDragEnd={handleResize}
            className='column-heading-resize'
          ></div>
        </th>
      )}
    </>
  );
};

export default memo(ColumnHeading);
