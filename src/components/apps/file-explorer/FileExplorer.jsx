import "./FileExplorer.css";
import Window from "../../system/window/Window";
import TitleBar from "../../system/window/title-bar/TitleBar";
import WindowContent from "../../system/window/window-content/WindowContent";
import StatusBar from "../../system/window/status-bar/StatusBar";
import { FcFolder } from "react-icons/fc";

const FileExplorer = () => {
  return (
    <Window minWidth='14rem' minHeight='16rem'>
      <TitleBar
        icon={<FcFolder />}
        name='File Explorer'
        backgroundColor='black'
        color='white'
      />
      <WindowContent backgroundColor='#202020'></WindowContent>
      <StatusBar backgroundColor='#2e2e2e'></StatusBar>
    </Window>
  );
};

export default FileExplorer;
