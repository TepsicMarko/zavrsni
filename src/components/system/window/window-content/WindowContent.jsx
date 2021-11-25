import "./WindowContent.css";

const WindowContent = ({ children, backgroundColor, flex, flexDirection }) => {
  return (
    <div
      className='window-content'
      style={{ backgroundColor, flexDirection, display: flex ? "flex" : "" }}
    >
      {children}
    </div>
  );
};

export default WindowContent;
