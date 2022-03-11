import './TaskManager.css';
import Window from '../../system/window/Window';
import WindowContent from '../../system/window/window-content/WindowContent';
import StatusBar from '../../system/window/status-bar/StatusBar';
import { ProcessesContext } from '../../../contexts/ProcessesContext';
import { useState, useContext } from 'react';

const TaskManager = ({ icon, pid }) => {
  const [selectedProcess, setSelectedProcess] = useState({ name: '', pid: '' });
  const { processes, endProcess } = useContext(ProcessesContext);

  const endTask = (e) => {
    e.stopPropagation();
    endProcess(selectedProcess.name, selectedProcess.pid);
    setSelectedProcess({ name: '', pid: '' });
  };

  return (
    <Window
      process='TaskManager'
      pid={pid}
      icon={icon}
      minWindowWidth='9rem'
      minWindowHeight='6.5rem'
      titleBar={{ color: 'black', backgroundColor: 'white' }}
    >
      <WindowContent backgroundColor='white' flex flexDirection='column' flexWrap='wrap'>
        <div className='overflow-container'>
          <div className='open-processes'>
            {Object.keys(processes).map((process) => {
              const app = processes[process];
              return Object.keys(app).map((appInstance) =>
                app[appInstance].isChildProcess ? null : (
                  <div
                    className='open-process'
                    onClick={() =>
                      setSelectedProcess({ name: process, pid: appInstance })
                    }
                    style={{
                      backgroundColor:
                        selectedProcess.pid === appInstance ? '#CDE8FF' : '',
                    }}
                  >
                    {app[appInstance].icon}
                    {process}
                  </div>
                )
              );
            })}
          </div>
        </div>
      </WindowContent>
      <StatusBar
        backgroundColor='white'
        color='black'
        flex
        borderColor='#ABABAB'
        borderStyle='solid'
        borderWidth='1px 0 0 0'
        fontWeight='400'
        position='relative'
        height='fit-content'
      >
        <button
          disabled={!selectedProcess.pid.length}
          className='end-task'
          onClick={endTask}
        >
          End task
        </button>
      </StatusBar>
    </Window>
  );
};

export default TaskManager;
