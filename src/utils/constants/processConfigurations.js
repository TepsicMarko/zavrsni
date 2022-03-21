import FileExplorer from '../../components/apps/file-explorer/FileExplorer';
import fileExplorer from '../../assets/icons/app-icons/fileExplorer.ico';
import Notepad from '../../components/apps/notepad/Notepad';
import notepad from '../../assets/icons/app-icons/notepad.png';
import Chrome from '../../components/apps/chrome/Chrome';
import chrome from '../../assets/icons/app-icons/chrome.svg';
import TaskManager from '../../components/apps/task-manager/TaskManager';
import taskManager from '../../assets/icons/app-icons/taskManager.png';
import Photos from '../../components/apps/photos/Photos';
import photos from '../../assets/icons/app-icons/photos.png';
import MoviesAndTv from '../../components/apps/movies-and-tv/MoviesAndTv';
import moviesAndTv from '../../assets/icons/app-icons/moviesAndTv.png';
import CommandPrompt from '../../components/apps/command-prompt/CommandPrompt';
import cmd from '../../assets/icons/app-icons/commandPrompt.ico';

import UnsavedChanges from '../../components/system/dialogs/unsaved-changes/UnsavedChanges';
import FileTransfer from '../../components/system/dialogs/file-transfer/FileTransfer';
import fileTransferProgress from '../../assets/icons/system-icons/fileTransferProgress.svg';
import Message from '../../components/system/dialogs/message/Message';

const appConfigurations = {
  'File Explorer': {
    source: <FileExplorer icon={<img src={fileExplorer} width='18px' />} />,
    minimized: false,
    icon: <img src={fileExplorer} width='30px' />,
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
  'Task Manager': {
    source: <TaskManager icon={<img src={taskManager} height='20px' />} />,
    minimized: false,
    icon: <img src={taskManager} height='30px' />,
    pinnedToTaskbar: true,
    isFocused: false,
    unique: true,
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
    source: <CommandPrompt icon={<img src={cmd} width='18px' />} />,
    minimized: false,
    icon: <img src={cmd} width='37px' />,
    pinnedToTaskbar: true,
    isFocused: false,
  },
};

const dialogConfigurations = {
  'Unsaved Changes Dialog': {
    source: <UnsavedChanges />,
  },
  'Message Dialog': {
    source: <Message />,
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
