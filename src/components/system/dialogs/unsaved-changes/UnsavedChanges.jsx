import './UnsavedChanges.css';
import Window from '../../window/Window';
import WindowContent from '../../window/window-content/WindowContent';
import StatusBar from '../../window/status-bar/StatusBar';
import { useContext } from 'react';
import { ProcessesContext } from '../../../../contexts/ProcessesContext';

const UnsavedChanges = ({ icon, save, dontSave, filePath, pid, ppid, parentProcess }) => {
  const { endProcess } = useContext(ProcessesContext);

  const closeDialog = () => {
    endProcess('Unsaved Changes Dialog', pid, parentProcess, ppid);
  };

  const handleSave = () => {
    closeDialog();
    save();
  };
  const handleDontSave = () => {
    closeDialog();
    dontSave(endProcess, pid, ppid);
  };

  return (
    <Window
      process='Unsaved Changes Dialog'
      pid={pid}
      icon={icon}
      minWindowWidth='20rem'
      minWindowHeight='9rem'
      titleBar={{ color: 'black', backgroundColor: 'white', title: 'Notepad' }}
      onClose={closeDialog}
      resizable={false}
      limitedWindowControls
    >
      <WindowContent backgroundColor='white' flex flexDirection='column'>
        <div className='unsaved-changes-message'>{`Do you want to save chnages to ${
          filePath || 'Untilted'
        }?`}</div>
      </WindowContent>
      <StatusBar
        backgroundColor='#f0f0f0'
        color='black'
        flex
        borderColor='#E1E1E1'
        borderStyle='solid'
        borderWidth='1px 0 0 0'
        fontWeight='400'
        position='relative'
        height='fit-content'
      >
        <div className='unsaved-changes-status-bar'>
          <button onClick={handleSave}>Save</button>
          <button onClick={handleDontSave}>Don't Save</button>
          <button onClick={closeDialog}>Cancel</button>
        </div>
      </StatusBar>
    </Window>
  );
};

export default UnsavedChanges;
