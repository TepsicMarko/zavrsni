import "./App.css";
import "./global.css";
import Desktop from "./components/desktop/Desktop";
import Taskbar from "./components/taskbar/Taskbar";

import { useEffect, useState } from "react";
import useDraggableTaskbar from "./hooks/useDraggableTaskbar";

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
    height: "3rem",
  });
  const [dekstopDimensions, setDekstopDimensions] = useState({
    width: "100vw",
    height: "100vh",
  });

  useEffect(() => {
    taskbarOrientation === "horizontal" &&
      taskbarDimensions.width !== "100vw" &&
      setTaskbarDimensions({ width: "100vw", height: "3rem" });
    taskbarOrientation === "vertical" &&
      taskbarDimensions.width !== "4.25rem" &&
      setTaskbarDimensions({ width: "4.25rem", height: "100vh" });
  }, [taskbarOrientation]);

  return (
    <div className='App'>
      <Desktop {...dekstopDimensions} />
      <Taskbar
        {...taskbarDimensions}
        handleDragStart={handleDragStart}
        handleDrag={handleDrag}
        handleDragEnd={handleDragEnd}
        taskbarPosition={taskbarPosition}
        taskbarOrientation={taskbarOrientation}
      />
    </div>
  );
};

export default App;
