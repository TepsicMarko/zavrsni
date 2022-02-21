import './Desktop.css';
import { useContext, useState, cloneElement } from 'react';
import { RightClickMenuContext } from '../../../contexts/RightClickMenuContext';
import { FileSystemContext } from '../../../contexts/FileSystemContext';
import { ProcessesContext } from '../../../contexts/ProcessesContext';
import useDesktopGrid from '../../../hooks/useDesktopGrid';
import DesktopIcon from './desktop-icon/DesktopIcon';
import DesktopContextMenu from '../component-specific-context-menus/DesktopContextMenu';
import useWatchFolder from '../../../hooks/useWatchFolder';
import { path as Path } from 'filer';
import useSelectionRectangle from '../../../hooks/useSelectionRectangle';

const Desktop = ({ maxWidth, maxHeight, taskbarHeight }) => {
  const origin = '/C/users/admin/Desktop';
  const { renderOptions } = useContext(RightClickMenuContext);
  const { processes, startProcess } = useContext(ProcessesContext);
  const { createFSO, watch, getFolder, moveFSO } = useContext(FileSystemContext);
  const [view, setView] = useState('Medium icons');
  const [folderContent] = useWatchFolder(origin, watch, getFolder);
  const {
    rectRef,
    calcRectStyle,
    enableSelection,
    disableSelection,
    handleSelection,
    selectedElements,
    setSelectedElements,
  } = useSelectionRectangle();

  const evalTaskbarHeight = () =>
    typeof taskbarHeight !== 'number'
      ? parseInt(taskbarHeight) * 16
      : taskbarHeight < 48
      ? 48
      : taskbarHeight;

  const { grid, addToGrid, updateGridItemName, deleteFromGrid, calculateGridPosition } =
    useDesktopGrid({
      maxRows: Math.floor(
        (document.documentElement.clientHeight - evalTaskbarHeight()) / 80 - 1
      ),
      maxColumns: Math.floor(document.documentElement.clientWidth / 68),
    });

  const handleRightClick = (e) => {
    const { clientX, clientY } = e;
    const mousePosition = { x: clientX, y: clientY };
    renderOptions(
      e,
      <DesktopContextMenu
        path={origin}
        createFSO={createFSO}
        addToGrid={addToGrid}
        calculateGridPosition={calculateGridPosition}
        mousePosition={mousePosition}
        view={view}
        setView={setView}
      />
    );
  };

  const getEntries = (items) => {
    let entries = [];
    for (let i = 0; i < items.length; i++) {
      entries.push(items[i].webkitGetAsEntry());
    }

    return entries;
  };

  const handleDrop = (e) => {
    if (!e.dataTransfer.files.length) {
      const dataTransfer = JSON.parse(e.dataTransfer.getData('json'));
      console.log(dataTransfer);
      if (dataTransfer.origin === 'Desktop')
        addToGrid(
          dataTransfer.dragObjects,
          calculateGridPosition({ x: e.clientX, y: e.clientY })
        );
      else
        dataTransfer.dragObjects.forEach(({ path, name }) => {
          moveFSO(Path.join(path, name), Path.join(origin, name));
        });
    } else {
      e.preventDefault();
      startProcess('File Transfer Dialog', {
        entries: getEntries(e.dataTransfer.items),
        dropPath: origin,
      });
      addToGrid(
        Object.values(e.dataTransfer.files).map((file) => file.name),
        calculateGridPosition({ x: e.clientX, y: e.clientY })
      );
    }
  };
  const preventDefault = (e) => e.preventDefault();

  const handleDragStart = (e) => {
    enableSelection(e);
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  };

  const renderProcesses = () =>
    Object.keys(processes).flatMap((process) => {
      return Object.keys(processes[process]).map((processInstance) => {
        const appInstance = processes[process][processInstance];

        return appInstance.childProcess ? (
          <>
            {cloneElement(appInstance.source, {
              key: processInstance,
              pid: processInstance,
            })}
            {Object.keys(appInstance.childProcess).length
              ? cloneElement(appInstance.childProcess.source, {
                  key: processInstance + '-' + appInstance.childProcess.name,
                })
              : null}
          </>
        ) : (
          cloneElement(appInstance.source, {
            key: processInstance,
            pid: processInstance,
          })
        );
      });
    });

  const renderDesktopIcons = () =>
    folderContent.map(({ name, type }) => (
      <DesktopIcon
        key={name}
        name={name}
        path={origin}
        type={type.toLowerCase()}
        gridPosition={grid[name]}
        updateGridItemName={updateGridItemName}
        deleteFromGrid={deleteFromGrid}
        startProcess={startProcess}
        rectRef={rectRef}
        selectedElements={selectedElements}
        setSelectedElements={setSelectedElements}
      />
    ));

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDrag={handleSelection}
      onDragEnd={disableSelection}
      className='desktop'
      onContextMenu={handleRightClick}
      style={{
        maxWidth,
        maxHeight,
        gridTemplateColumns: `repeat(${Math.floor(
          document.documentElement.clientWidth / 68
        )}, 4.25rem)`,
        gridTemplateRows: `repeat(${Math.floor(
          (document.documentElement.clientHeight - evalTaskbarHeight()) / 80 - 1
        )}, 5rem)`,
      }}
      onDragEnter={preventDefault}
      onDragOver={preventDefault}
      onDrop={handleDrop}
    >
      {renderDesktopIcons()}
      {renderProcesses()}
      <div ref={rectRef} className='rect-selection' style={{ ...calcRectStyle() }}></div>
    </div>
  );
};

export default Desktop;
