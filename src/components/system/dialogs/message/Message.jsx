import './Message.css';
import Window from '../../window/Window';
import WindowContent from '../../window/window-content/WindowContent';
import warningIcon from '../../../../assets/icons/system-icons/warning.ico';
import errorIcon from '../../../../assets/icons/system-icons/error.png';
import { useContext } from 'react';
import { ProcessesContext } from '../../../../contexts/ProcessesContext';
import {
  ERROR_ALREADY_EXISTS,
  ERROR_FILE_NOT_FOUND,
  ERROR_PATH_NOT_FOUND,
} from './errorCodes';

const Message = ({
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
  isError,
}) => {
  const { endProcess } = useContext(ProcessesContext);

  const dismissMessage = () => {
    endProcess('Message Dialog', pid, 'File Explorer', ppid);
    onClose && onClose();
  };

  const handleReplace = () => {
    replaceFile();
    endProcess('File Explorer', ppid, 'Notepad', gppid);
  };

  return (
    <Window
      process='Message Dialog'
      pid={pid}
      parentProcess={parentProcess}
      ppid={gppid || ppid}
      icon={icon}
      minWindowWidth='20rem'
      minWindowHeight='9rem'
      titleBar={{ color: 'black', backgroundColor: 'white', title }}
      onClose={dismissMessage}
      resizable={false}
      limitedWindowControls
    >
      <WindowContent backgroundColor='white' flex flexDirection='column'>
        <div className='warning-message' style={{ minWidth: 'fit-content' }}>
          <img src={isError ? errorIcon : warningIcon} width='35px' />
          {warning}
        </div>
      </WindowContent>
      {(errCode === ERROR_FILE_NOT_FOUND || errCode === ERROR_PATH_NOT_FOUND) && (
        <div className='warning-status-bar'>
          <button onClick={dismissMessage}>OK</button>
        </div>
      )}
      {errCode === ERROR_ALREADY_EXISTS && (
        <div className='warning-status-bar'>
          <button onClick={handleReplace}>Yes</button>
          <button onClick={dismissMessage}>No</button>
        </div>
      )}
    </Window>
  );
};

export default Message;
