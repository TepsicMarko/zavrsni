import "./App.css";
import "./global.css";
import Desktop from "./components/system/desktop/Desktop";
import Taskbar from "./components/system/taskbar/Taskbar";
import ContextMenu from "./components/system/context-menu/ContextMenu";

import { useEffect, useState } from "react";
import useDraggableTaskbar from "./hooks/useDraggableTaskbar";
import { FileSystemProvider } from "./contexts/FileSystemContext";
import { RightClickMenuProvider } from "./contexts/RightClickMenuContext";
import { ProcessesProvider } from "./contexts/ProcessesContext";

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
        <ProcessesProvider>
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
          <ContextMenu />
        </ProcessesProvider>
      </RightClickMenuProvider>
    </FileSystemProvider>
  );
};

export default App;
