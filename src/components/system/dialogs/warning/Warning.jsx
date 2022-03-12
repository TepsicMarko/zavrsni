import './Warning.css';
import Window from '../../window/Window';
import WindowContent from '../../window/window-content/WindowContent';
import warningIcon from '../../../../assets/warning.png';
import { useContext } from 'react';
import { ProcessesContext } from '../../../../contexts/ProcessesContext';
import { ERROR_ALREADY_EXISTS, ERROR_FILE_NOT_FOUND } from './errorCodes';

const Warning = ({
  icon,
  pid,
  ppid,
  gppid,
  parentProcess,
  title,
  warning,
  errCode,
  onClose,
  replaceFile,
}) => {
  const { endProcess } = useContext(ProcessesContext);

  const dismissWarning = () => {
    endProcess('Warning Dialog', pid, 'File Explorer', ppid);
    onClose();
  };

  const handleReplace = () => {
    replaceFile();
    endProcess('File Explorer', ppid, 'Notepad', gppid);
  };

  return (
    <Window
      process='Warning Dialog'
      pid={pid}
      parentProcess={parentProcess}
      ppid={gppid}
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
      {errCode === ERROR_FILE_NOT_FOUND && (
        <div className='warning-status-bar'>
          <button onClick={dismissWarning}>OK</button>
        </div>
      )}
      {errCode === ERROR_ALREADY_EXISTS && (
        <div className='warning-status-bar'>
          <button onClick={handleReplace}>Yes</button>
          <button onClick={dismissWarning}>No</button>
        </div>
      )}
    </Window>
  );
};

export default Warning;
