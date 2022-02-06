import "./FileTransfer.css";
import Window from "../../window/Window";
import WindowContent from "../../window/window-content/WindowContent";
import StatusBar from "../../window/status-bar/StatusBar";
import { useState, useContext, useEffect, useRef } from "react";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { BsFillPlayFill } from "react-icons/bs";
import { VscDebugPause } from "react-icons/vsc";
import { FileSystemContext } from "../../../../contexts/FileSystemContext";
import { ProcessesContext } from "../../../../contexts/ProcessesContext";
import handleExternalFileDrop from "../../../../utils/helpers/handleExternalFileDrop";

const FileTransfer = ({ pid, icon, entries, dropPath }) => {
  const fileReaderRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [fileCount, setFileCount] = useState(1);
  const { createFSO, createBlob } = useContext(FileSystemContext);
  const { endProcess } = useContext(ProcessesContext);

  const togglePaused = () => setIsPaused(!isPaused);

  const handleClose = () => {
    endProcess("File Transfer Dialog", pid);
    fileReaderRef.current.abort();
  };

  useEffect(() => {
    handleExternalFileDrop(
      entries,
      dropPath,
      setProgress,
      createFSO,
      createBlob,
      fileReaderRef,
      setFileCount
    );
  }, []);

  useEffect(() => {
    if (progress === 100) endProcess("File Transfer Dialog", pid);
  }, [progress]);

  return (
    <Window
      process='File Transfer Dialog'
      pid={pid}
      icon={icon}
      minWindowWidth='27.5rem'
      minWindowHeight='10rem'
      resizable={false}
      titleBar={{
        color: "black",
        backgroundColor: "white",
        title: `${isPaused ? "Paused - " : ""}${progress}% complete`,
      }}
      limitedWindowControls
      onClose={handleClose}
    >
      <WindowContent backgroundColor='white' flex>
        <div className='transfer-progress-container'>
          <div className='file-transfer-info'>
            Copying {fileCount} items from <span>Your PC</span> to{" "}
            <span>{dropPath}</span>
          </div>
          <div className='file-transfer-progress'>
            {isPaused ? "Paused - " : ""} {progress}% complete
            <span className='flex-center transfer-controls'>
              <div className='pause-or-resume-transfer' onClick={togglePaused}>
                {isPaused ? <BsFillPlayFill /> : <VscDebugPause />}
              </div>
              <IoCloseSharp size='1.15rem' onClick={handleClose} />
            </span>
          </div>
          <div className='file-transfer-progress-bar'>
            <div style={{ width: progress + "%" }}></div>
          </div>
        </div>
      </WindowContent>
      <StatusBar
        backgroundColor='white'
        color='black'
        flex
        borderColor='#E1E1E1'
        borderStyle='solid'
        borderWidth='1px 0 0 0'
        fontWeight='400'
        position='relative'
        height='fit-content'
      >
        <div className='flex-center file-transfer-show-more-details'>
          <IoIosArrowDropdown size='1.25rem' /> More details
        </div>
      </StatusBar>
    </Window>
  );
};

export default FileTransfer;
