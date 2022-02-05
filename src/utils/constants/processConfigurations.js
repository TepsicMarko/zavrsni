import { FcFolder } from "react-icons/fc";
import FileExplorer from "../../components/apps/file-explorer/FileExplorer";
import Notepad from "../../components/apps/notepad/Notepad";
import notepad from "../../assets/notepad.png";
import Chrome from "../../components/apps/chrome/Chrome";
import chrome from "../../assets/chrome.svg";
import TaskManager from "../../components/apps/task-manager/TaskManager";
import taskManager from "../../assets/task-manager.png";
import Photos from "../../components/apps/photos/Photos";
import photos from "../../assets/photos.png";
import MoviesAndTv from "../../components/apps/movies-and-tv/MoviesAndTv";
import moviesAndTv from "../../assets/movies-and-tv.png";
import CommandPrompt from "../../components/apps/command-prompt/CommandPrompt";
import cmd from "../../assets/cmd.png";

import UnsavedChanges from "../../components/system/dialogs/unsaved-changes/UnsavedChanges";
import FileTransfer from "../../components/system/dialogs/file-transfer/FileTransfer";
import fileTransferProgress from "../../assets/fileTransferProgress.svg";

const appConfigurations = {
  "File Explorer": {
    source: <FileExplorer icon={<FcFolder />} />,
    minimised: false,
    icon: <FcFolder />,
    pinnedToTaskbar: true,
  },
  Notepad: {
    source: <Notepad icon={<img src={notepad} width='20rem' />} />,
    minimised: false,
    icon: <img src={notepad} width='30rem' />,
    pinnedToTaskbar: true,
    childProcess: {},
  },
  Chrome: {
    source: <Chrome icon={<img src={chrome} width='15px' />} />,
    minimised: false,
    icon: <img src={chrome} width='25px' />,
    pinnedToTaskbar: true,
  },
  TaskManager: {
    source: <TaskManager icon={<img src={taskManager} height='20px' />} />,
    minimised: false,
    icon: <img src={taskManager} height='30px' />,
    pinnedToTaskbar: true,
  },
  Photos: {
    source: <Photos />,
    minimised: false,
    icon: <img src={photos} height='30px' />,
    pinnedToTaskbar: true,
  },
  "Movies And TV": {
    source: <MoviesAndTv />,
    minimised: false,
    icon: <img src={moviesAndTv} height='30px' />,
    pinnedToTaskbar: true,
  },
  "Command Prompt": {
    source: <CommandPrompt icon={<img src={cmd} width='15px' />} />,
    minimised: false,
    icon: <img src={cmd} width='30px' />,
    pinnedToTaskbar: true,
  },
};

const dialogConfigurations = {
  "Unsaved Changes Dialog": {
    source: <UnsavedChanges />,
  },
  "File Transfer Dialog": {
    source: (
      <FileTransfer
        icon={
          <img
            src={fileTransferProgress}
            style={{ width: "15px", marginTop: "3px" }}
          />
        }
      />
    ),
    icon: <img src={fileTransferProgress} />,
  },
};

export { appConfigurations };

export default { ...appConfigurations, ...dialogConfigurations };
