import "./App.css";
import "./global.css";
import Desktop from "./components/desktop/Desktop";
import Taskbar from "./components/taskbar/Taskbar";
import RightClickMenu from "./components/right-click-menu/RightClickMenu";

import { useEffect, useState } from "react";
import useDraggableTaskbar from "./hooks/useDraggableTaskbar";
import { FileSystemProvider } from "./contexts/FileSystemContext";
import { RightClickMenuProvider } from "./contexts/RightClickMenuContext";

const App = () => {
  const {
    isDragging,
    taskbarPosition,
    taskbarOrientation,
    handleDragStart,
    handleDrag,
    handleDragEnd,
  } = useDraggableTaskbar();

  const [taskbarDimensions, setTaskbarDimensions] = useState({
    width: "100vw",
    height: "2.75rem",
  });
  const [dekstopDimensions, setDekstopDimensions] = useState({
    width: "100vw",
    height: "100vh",
  });

  useEffect(() => {
    taskbarOrientation === "horizontal" &&
      taskbarDimensions.width !== "100vw" &&
      setTaskbarDimensions({ width: "100vw", height: "2.75rem" });
    taskbarOrientation === "vertical" &&
      taskbarDimensions.width !== "4.25rem" &&
      setTaskbarDimensions({ width: "4.25rem", height: "100vh" });
  }, [taskbarOrientation]);

  return (
    <FileSystemProvider>
      <RightClickMenuProvider>
        <div className='App'>
          <Desktop
            {...dekstopDimensions}
            taskbarHeight={taskbarDimensions.height}
          />
          <Taskbar
            {...taskbarDimensions}
            handleDragStart={handleDragStart}
            handleDrag={handleDrag}
            handleDragEnd={handleDragEnd}
            taskbarPosition={taskbarPosition}
            taskbarOrientation={taskbarOrientation}
            setTaskbarDimensions={setTaskbarDimensions}
          />
        </div>
        <RightClickMenu />
      </RightClickMenuProvider>
    </FileSystemProvider>
  );
};

export default App;
