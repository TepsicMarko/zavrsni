import { FcFolder } from 'react-icons/fc';
import FileExplorer from '../../components/apps/file-explorer/FileExplorer';
import Notepad from '../../components/apps/notepad/Notepad';
import notepad from '../../assets/notepad.png';
import Chrome from '../../components/apps/chrome/Chrome';
import chrome from '../../assets/chrome.svg';
import TaskManager from '../../components/apps/task-manager/TaskManager';
import taskManager from '../../assets/task-manager.png';
import Photos from '../../components/apps/photos/Photos';
import photos from '../../assets/photos.png';
import MoviesAndTv from '../../components/apps/movies-and-tv/MoviesAndTv';
import moviesAndTv from '../../assets/movies-and-tv.png';
import CommandPrompt from '../../components/apps/command-prompt/CommandPrompt';
import cmd from '../../assets/cmd.png';

import UnsavedChanges from '../../components/system/dialogs/unsaved-changes/UnsavedChanges';
import FileTransfer from '../../components/system/dialogs/file-transfer/FileTransfer';
import fileTransferProgress from '../../assets/fileTransferProgress.svg';
import Warning from '../../components/system/dialogs/warning/Warning';

const appConfigurations = {
  'File Explorer': {
    source: <FileExplorer icon={<FcFolder />} />,
    minimized: false,
    icon: <FcFolder />,
    pinnedToTaskbar: true,
    isFocused: false,
    childProcess: {},
  },
  Notepad: {
    source: <Notepad icon={<img src={notepad} width='20rem' />} />,
    minimized: false,
    icon: <img src={notepad} width='30rem' />,
    pinnedToTaskbar: true,
    childProcess: {},
    isFocused: false,
  },
  Chrome: {
    source: <Chrome icon={<img src={chrome} width='15px' />} />,
    minimized: false,
    icon: <img src={chrome} width='25px' />,
    pinnedToTaskbar: true,
    isFocused: false,
  },
  TaskManager: {
    source: <TaskManager icon={<img src={taskManager} height='20px' />} />,
    minimized: false,
    icon: <img src={taskManager} height='30px' />,
    pinnedToTaskbar: true,
    isFocused: false,
  },
  Photos: {
    source: <Photos />,
    minimized: false,
    icon: <img src={photos} height='30px' />,
    pinnedToTaskbar: true,
    isFocused: false,
  },
  'Movies And TV': {
    source: <MoviesAndTv />,
    minimized: false,
    icon: <img src={moviesAndTv} height='30px' />,
    pinnedToTaskbar: true,
    isFocused: false,
  },
  'Command Prompt': {
    source: <CommandPrompt icon={<img src={cmd} width='15px' />} />,
    minimized: false,
    icon: <img src={cmd} width='30px' />,
    pinnedToTaskbar: true,
    isFocused: false,
  },
};

const dialogConfigurations = {
  'Unsaved Changes Dialog': {
    source: <UnsavedChanges />,
  },
  'Warning Dialog': {
    source: <Warning />,
  },
  'File Transfer Dialog': {
    source: (
      <FileTransfer
        icon={
          <img src={fileTransferProgress} style={{ width: '15px', marginTop: '3px' }} />
        }
      />
    ),
    icon: <img src={fileTransferProgress} />,
  },
};

export { appConfigurations };

export default { ...appConfigurations, ...dialogConfigurations };
