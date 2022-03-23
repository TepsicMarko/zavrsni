import './App.css';
import './global.css';
import Desktop from './components/system/desktop/Desktop';
import Taskbar from './components/system/taskbar/Taskbar';

import { useState, useContext } from 'react';
import useDraggableTaskbar from './hooks/useDraggableTaskbar';
import remToPx from './utils/helpers/remToPx';
// import windowsDefault from './assets/windowsDefault.jpg';
import { FileSystemProvider } from './contexts/FileSystemContext';
import { RightClickMenuProvider } from './contexts/RightClickMenuContext';
import { ProcessesProvider } from './contexts/ProcessesContext';
import { ThumbnailPreviewsProvider } from './contexts/ThumbnailPreviewsContext';
import { WallpaperContext } from './contexts/WallpaperContext';

const App = () => {
  const {
    taskbarPosition,
    taskbarOrientation,
    handleDragStart,
    handleDrag,
    handleDragEnd,
  } = useDraggableTaskbar();

  const [taskbarDimensions, setTaskbarDimensions] = useState({
    width: '100vw',
    height: '2.75rem',
  });
  const { wallpaper } = useContext(WallpaperContext);

  const calcFlexDirection = () => {
    if (taskbarPosition === 'top') return 'column-reverse';
    if (taskbarPosition === 'right') return 'row';
    if (taskbarPosition === 'bottom') return 'column';
    if (taskbarPosition === 'left') return 'row-reverse';
  };

  return (
    <FileSystemProvider>
      <RightClickMenuProvider>
        <ThumbnailPreviewsProvider>
          <ProcessesProvider>
            <div
              className='App'
              style={{
                flexDirection: calcFlexDirection(),
                backgroundImage: `url(${wallpaper})`,
              }}
            >
              <Desktop
                taskbarHeight={taskbarDimensions.height}
                maxWidth={
                  taskbarOrientation === 'vertical'
                    ? `calc(100% - ${remToPx(taskbarDimensions.width) + 'px'})`
                    : '100%'
                }
                maxHeight={
                  taskbarOrientation === 'horizontal'
                    ? `calc(100% - ${remToPx(taskbarDimensions.height) + 'px'})`
                    : '100%'
                }
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
              <a style={{ display: 'none' }} id='file-download' />
            </div>
          </ProcessesProvider>
        </ThumbnailPreviewsProvider>
      </RightClickMenuProvider>
    </FileSystemProvider>
  );
};

export default App;
