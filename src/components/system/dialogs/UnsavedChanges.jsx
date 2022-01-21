import "./UnsavedChanges.css";
import Window from "../window/Window";
import WindowContent from "../window/window-content/WindowContent";
import StatusBar from "../window/status-bar/StatusBar";

const UnsavedChanges = ({
  icon,
  handleSave,
  handleDontSave,
  handleCancel,
  filePath,
  ppid,
  parentProcess,
}) => {
  return (
    <Window
      process='Unsaved Changes Dialog'
      parentProcess={parentProcess}
      pid={ppid}
      icon={icon}
      minWindowWidth='20rem'
      minWindowHeight='9rem'
      titleBar={{ color: "black", backgroundColor: "white", title: "Notepad" }}
      onClose={handleCancel}
      //in this case parent process isn't the right prop name for the job, but i think that it would be redundant to have two differently named props which do the same thing
      resizable={false}
      limitedWindowControls
    >
      <WindowContent backgroundColor='white' flex flexDirection='column'>
        <div className='unsaved-changes-message'>{`Do you want to save chnages to ${
          filePath || "Untilted"
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
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </StatusBar>
    </Window>
  );
};

export default UnsavedChanges;
