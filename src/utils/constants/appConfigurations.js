import { FcFolder } from "react-icons/fc";
import FileExplorer from "../../components/apps/file-explorer/FileExplorer";
import Notepad from "../../components/apps/notepad/Notepad";
import notepad from "../../assets/notepad.png";
import Chrome from "../../components/apps/chrome/Chrome";
import chrome from "../../assets/chrome.png";
import chromeSmall from "../../assets/chrome-small.png";
import TaskManager from "../../components/apps/task-manager/TaskManager";
import taskManager from "../../assets/task-manager.png";
import Photos from "../../components/apps/photos/Photos";
import photos from "../../assets/photos.png";
import MoviesAndTv from "../../components/apps/movies-and-tv/MoviesAndTv";
import moviesAndTv from "../../assets/movies-and-tv.png";
import CommandPrompt from "../../components/apps/command-prompt/CommandPrompt";
import cmd from "../../assets/cmd.png";

const appConfigurations = {
  "File Explorer": {
    source: <FileExplorer icon={<FcFolder />} />,
    running: false,
    minimised: false,
    icon: <FcFolder />,
    pinnedToTaskbar: true,
    isFocused: false,
  },
  Notepad: {
    source: <Notepad icon={<img src={notepad} width='20rem' />} />,
    running: false,
    minimised: false,
    icon: <img src={notepad} width='30rem' />,
    pinnedToTaskbar: true,
    isFocused: false,
    childProcess: {},
  },
  Chrome: {
    source: <Chrome icon={<img src={chromeSmall} />} />,
    running: false,
    minimised: false,
    icon: <img src={chrome} />,
    pinnedToTaskbar: true,
    isFocused: false,
  },
  TaskManager: {
    source: <TaskManager icon={<img src={taskManager} height='20px' />} />,
    running: false,
    minimised: false,
    icon: <img src={taskManager} height='30px' />,
    pinnedToTaskbar: true,
    isFocused: false,
  },
  Photos: {
    source: <Photos />,
    running: false,
    minimised: false,
    icon: <img src={photos} height='30px' />,
    pinnedToTaskbar: true,
    isFocused: false,
  },
  "Movies And TV": {
    source: <MoviesAndTv />,
    running: false,
    minimised: false,
    icon: <img src={moviesAndTv} height='30px' />,
    pinnedToTaskbar: true,
    isFocused: false,
  },
  "Command Prompt": {
    source: <CommandPrompt icon={<img src={cmd} width='15px' />} />,
    running: false,
    minimised: false,
    icon: <img src={cmd} width='30px' />,
    pinnedToTaskbar: true,
    isFocused: false,
  },
};

export default appConfigurations;
