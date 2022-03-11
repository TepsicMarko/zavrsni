import './WindowContent.css';
import { memo } from 'react';

const WindowContent = ({ children, backgroundColor, flex, flexDirection, flexWrap }) => {
  return (
    <div
      draggable
      onDragStart={(e) => e.preventDefault()}
      style={{
        backgroundColor,
        flexDirection,
        display: flex ? 'flex' : '',
        flexWrap,
      }}
      className='window-content'
    >
      {children}
    </div>
  );
};

export default memo(WindowContent);
