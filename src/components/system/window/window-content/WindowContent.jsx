import "./WindowContent.css";
import { cloneElement } from "react";

const WindowContent = ({
  children,
  backgroundColor,
  flex,
  flexDirection,
  width,
}) => {
  return (
    <div
      style={{ backgroundColor, flexDirection, display: flex ? "flex" : "" }}
      className='window-content'
    >
      {children.map((child) => cloneElement(child, { windowWidth: width }))}
    </div>
  );
};

export default WindowContent;
