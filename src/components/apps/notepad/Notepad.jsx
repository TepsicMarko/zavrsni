import Window from "../../system/window/Window";
import WindowContent from "../../system/window/window-content/WindowContent";
import { WindowWidthProvider } from "../../../contexts/WindowWidthContext";
import NotepadNavbar from "./navbar/NotepadNavbar";

const Notepad = ({ icon }) => {
  return (
    <WindowWidthProvider>
      <Window
        app='Notepad'
        icon={icon}
        minWindowWidth='5rem'
        minWindowHeight='10rem'
        titleBar={{ color: "black", backgroundColor: "white" }}
      >
        <WindowContent backgroundColor='white' flex flexDirection='row'>
          <NotepadNavbar />
        </WindowContent>
      </Window>
    </WindowWidthProvider>
  );
};

export default Notepad;
