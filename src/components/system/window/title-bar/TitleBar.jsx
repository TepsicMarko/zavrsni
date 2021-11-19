import "./TitleBar.css";
import {
  VscChromeMinimize,
  VscChromeMaximize,
  VscChromeClose,
} from "react-icons/vsc";

const TitleBar = ({ icon, name, backgroundColor, color, maximiseWindow }) => {
  return (
    <div className='title-bar' style={{ backgroundColor, color }}>
      <div className='flex-center aplication-icon'>{icon}</div>
      <div className='aplication-name'>{name}</div>
      <div className='window-controls'>
        <div className='flex-center'>
          <VscChromeMinimize color={color} size='0.85rem' />
        </div>
        <div className='flex-center' onClick={maximiseWindow}>
          <VscChromeMaximize color={color} size='0.9rem' />
        </div>
        <div className='flex-center'>
          <VscChromeClose color={color} size='0.85rem' />
        </div>
      </div>
    </div>
  );
};

export default TitleBar;
