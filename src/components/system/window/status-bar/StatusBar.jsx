import "./StatusBar.css";

const StatusBar = ({ children, backgroundColor }) => {
  return (
    <div className='status-bar' style={{ backgroundColor }}>
      {children}
    </div>
  );
};

export default StatusBar;
