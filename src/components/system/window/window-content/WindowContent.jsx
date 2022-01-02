import "./WindowContent.css";
import { memo } from "react";

const WindowContent = ({ children, backgroundColor, flex, flexDirection }) => {
  return (
    <div
      style={{ backgroundColor, flexDirection, display: flex ? "flex" : "" }}
      className='window-content'
    >
      {children}
    </div>
  );
};

export default memo(WindowContent);
