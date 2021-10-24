import "./App.css";
import "./global.css";
import Desktop from "./components/desktop/Desktop";
import Taskbar from "./components/taskbar/Taskbar";

import { useState } from "react";

const App = () => {
  const [taskbarDimensions, setTaskbarDimensions] = useState({
    width: "100vw",
    height: "3rem",
  });
  const [dekstopDimensions, setDekstopDimensions] = useState({
    width: "100vw",
    height: "100vh",
  });
  return (
    <div className='App'>
      <Desktop {...dekstopDimensions} />
      <Taskbar {...taskbarDimensions} />
    </div>
  );
};

export default App;
