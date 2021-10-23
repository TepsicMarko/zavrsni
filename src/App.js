import "./App.css";
import "./global.css";
import Desktop from "./components/desktop/Desktop";
import Taskbar from "./components/taskbar/Taskbar";

import { useState } from "react";
import useDraggableTaskbar from "./hooks/useDraggableTaskbar";

const App = () => {
  const [taskbarDimensions, setTaskbarDimensions] = useState({
    width: "100vw",
    height: "3rem",
  });
  const [dekstopDimensions, setDekstopDimensions] = useState({
    width: "100vw",
    height: "100vh",
  });
  const { isDragging, handleDragStart, handleDrag, handleDragEnd } =
    useDraggableTaskbar();

  return (
    <div className='App'>
      <Desktop {...dekstopDimensions} />
      <Taskbar
        {...taskbarDimensions}
        handleDragStart={handleDragStart}
        handleDrag={handleDrag}
        handleDragEnd={handleDragEnd}
      />
    </div>
  );
};

export default App;
