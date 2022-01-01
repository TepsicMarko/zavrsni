import "./StatusBar.css";
import { memo } from "react";

const StatusBar = ({ children, backgroundColor, color, flex }) => {
  return (
    <div
      className='status-bar'
      style={{ backgroundColor, color, display: flex ? "flex" : "" }}
    >
      {children}
    </div>
  );
};

export default memo(StatusBar);
