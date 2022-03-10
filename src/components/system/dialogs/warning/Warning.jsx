import './Warning.css';
import Window from '../../window/Window';
import WindowContent from '../../window/window-content/WindowContent';
import warningIcon from '../../../../assets/warning.png';
import { useContext } from 'react';
import { ProcessesContext } from '../../../../contexts/ProcessesContext';

const Warning = ({ icon, pid, ppid, title, warning }) => {
  const { endProcess } = useContext(ProcessesContext);

  const dismissWarning = () => {
    endProcess('Warning Dialog', pid, 'File Explorer', ppid);
  };

  return (
    <Window
      process='Warning Dialog'
      pid={pid}
      icon={icon}
      minWindowWidth='20rem'
      minWindowHeight='9rem'
      titleBar={{ color: 'black', backgroundColor: 'white', title }}
      onClose={dismissWarning}
      resizable={false}
      limitedWindowControls
    >
      <WindowContent backgroundColor='white' flex flexDirection='column'>
        <div className='warning-message'>
          <img src={warningIcon} width='35px' />
          {warning}
        </div>
      </WindowContent>
      <div className='warning-status-bar'>
        <button onClick={dismissWarning}>OK</button>
      </div>
    </Window>
  );
};

export default Warning;
