import "./TaskManager.css";
import Window from "../../system/window/Window";
import WindowContent from "../../system/window/window-content/WindowContent";
import StatusBar from "../../system/window/status-bar/StatusBar";
import { ProcessesContext } from "../../../contexts/ProcessesContext";
import { useState, useContext } from "react";

const TaskManager = ({ icon, pid }) => {
  const [selectedProcess, setSelectedProcess] = useState("");
  const { processes, endProcess } = useContext(ProcessesContext);

  const selectProcess = (e) => {
    setSelectedProcess(e.target.textContent);
  };

  const endTask = () => {
    endProcess(selectedProcess);
  };

  return (
    <Window
      app='TaskManager'
      pid={pid}
      icon={icon}
      minWindowWidth='9rem'
      minWindowHeight='6.5rem'
      titleBar={{ color: "black", backgroundColor: "white" }}
    >
      <WindowContent
        backgroundColor='white'
        flex
        flexDirection='column'
        flexWrap='wrap'
      >
        <div className='overflow-container'>
          <div className='open-processes'>
            {Object.keys(processes).map((process) => {
              const app = processes[process];
              return (
                <div
                  className='open-process'
                  onClick={selectProcess}
                  style={{
                    backgroundColor:
                      selectedProcess === process ? "#CDE8FF" : "",
                  }}
                >
                  {app.icon}
                  {process}
                </div>
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
          disabled={!selectedProcess.length}
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
