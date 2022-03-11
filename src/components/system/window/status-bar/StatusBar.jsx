import './StatusBar.css';
import { memo } from 'react';

const StatusBar = ({
  children,
  backgroundColor,
  color,
  flex,
  borderColor,
  borderStyle,
  borderWidth,
  fontWeight,
  height,
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => e.preventDefault()}
      className='status-bar'
      style={{
        backgroundColor,
        color,
        display: flex ? 'flex' : '',
        borderColor,
        borderStyle,
        borderWidth,
        fontWeight,
        height,
      }}
    >
      {children}
    </div>
  );
};

export default memo(StatusBar);
