import "./StatusBar.css";
import { memo } from "react";

const StatusBar = ({
  children,
  backgroundColor,
  color,
  flex,
  borderColor,
  borderStyle,
  borderWidth,
  fontWeight,
}) => {
  return (
    <div
      className='status-bar'
      style={{
        backgroundColor,
        color,
        display: flex ? "flex" : "",
        borderColor,
        borderStyle,
        borderWidth,
        fontWeight,
      }}
    >
      {children}
    </div>
  );
};

export default memo(StatusBar);
