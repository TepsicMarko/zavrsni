import "./WindowContent.css";

const WindowContent = ({ children, backgroundColor }) => {
  return (
    <div className='window-content' style={{ backgroundColor }}>
      {children}
    </div>
  );
};

export default WindowContent;
