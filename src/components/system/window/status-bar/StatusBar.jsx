import "./StatusBar.css";
import { memo } from "react";

const StatusBar = ({ children, backgroundColor }) => {
  return (
    <div className='status-bar' style={{ backgroundColor }}>
      {children}
    </div>
  );
};

export default memo(StatusBar);
