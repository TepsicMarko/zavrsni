import Window from "../../../system/window/Window";
import WindowContent from "../../../system/window/window-content/WindowContent";
import StatusBar from "../../../system/window/status-bar/StatusBar";

const UnsavedChanges = ({ icon, handleSave, handleDontSave, handleCancel }) => {
  return (
    <Window
      app='Notepad-dialog'
      fileName='Notepad'
      icon={icon}
      minWindowWidth='20rem'
      minWindowHeight='9rem'
      titleBar={{ color: "black", backgroundColor: "white" }}
      onClose={handleCancel}
      parentProcess={true}
      //in this case parent process isn't the right prop name for the job, but i think that it would be redundant to have two differently named props which do the same thing
      resizable={false}
    >
      <WindowContent backgroundColor='white'>
        <StatusBar>
          <button onClick={handleSave}>save</button>
          <button onClick={handleDontSave}>don't save</button>
          <button onClick={handleCancel}>cancel</button>
        </StatusBar>
      </WindowContent>
    </Window>
  );
};

export default UnsavedChanges;
