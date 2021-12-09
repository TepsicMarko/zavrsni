import "./WindowContent.css";
import { memo } from "react";

const WindowContent = (props) => {
  const { children, backgroundColor, flex, flexDirection } = props;
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
