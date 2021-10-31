import "./DesktopIcon.css";
import { FcFolder } from "react-icons/fc";
import { AiFillFileText } from "react-icons/ai";

const DesktopIcon = ({ name, isFolder }) => {
  const handleClick = (e) => {
    e.target.select();
  };
  return (
    <div className='desktop-icon'>
      {isFolder ? (
        <FcFolder size='3rem' />
      ) : (
        <AiFillFileText size='3rem' color='white' />
      )}
      <input
        className='desktop-icon-name'
        type='text'
        value={name}
        onClick={handleClick}
      />
    </div>
  );
};

export default DesktopIcon;
