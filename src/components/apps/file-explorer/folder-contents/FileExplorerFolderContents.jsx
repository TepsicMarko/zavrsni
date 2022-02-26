import './FileExplorerFolderContents.css';
import ColumnHeading from './column-heading/ColumnHeading';
import FsoListItem from './fso-list-item/FsoListItem';
import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import useWatchFolder from '../../../../hooks/useWatchFolder';
import remToPx from '../../../../utils/helpers/remToPx';
import moment from 'moment';
import { FileSystemContext } from '../../../../contexts/FileSystemContext';
import { ProcessesContext } from '../../../../contexts/ProcessesContext';
import { WindowDimensionsContext } from '../../../../contexts/WindowDimensionsContext';
import { RightClickMenuContext } from '../../../../contexts/RightClickMenuContext';
import FolderContentsContextMenu from '../../../system/component-specific-context-menus/FolderContentsContextMenu';
import { path as Path } from 'filer';
import useSelectionRectangle from '../../../../hooks/useSelectionRectangle';

const FileExplorerFolderContents = ({
  changePath,
  path,
  width,
  setWidth,
  searchResults,
  setItemCount,
  setExpandBranches,
  openFile,
  endProcess,
  ppid,
}) => {
  const { watch, getFolder, renameFSO, deleteFSO, createFSO, moveFSO, createBlob } =
    useContext(FileSystemContext);
  const { windowDimensions } = useContext(WindowDimensionsContext);
  const { startProcess } = useContext(ProcessesContext);
  const { renderOptions } = useContext(RightClickMenuContext);

  const windowWidthOnFirstRender = useRef(windowDimensions.width);
  const [folderContent, setWatcherPath] = useWatchFolder(
    path,
    watch,
    getFolder,
    setItemCount
  );
  // const [handleExternalFileDrop] = useExternalFileDrop(createFSO, createBlob);

  const [columnHeadingsWidth, setColumnHeadingsWidth] = useState({
    Name: '4.5rem',
    Location: '4.5rem',
    'Date Modified': '4.5rem',
    Type: '4.5rem',
    Size: '4.5rem',
  });
  const {
    rectRef,
    calcRectStyle,
    enableSelection,
    disableSelection,
    handleSelection,
    selectedElements,
    setSelectedElements,
    dimensions,
  } = useSelectionRectangle();
  const [minWidth, setMinWidth] = useState(remToPx('6rem'));

  const folderContentsRef = useRef(null);
  const previousWindowWidthRef = useRef(windowDimensions.width);

  const setColumnHeadingWidth = useCallback(
    (name, width) => {
      setColumnHeadingsWidth({ ...columnHeadingsWidth, [name]: width });
    },
    [columnHeadingsWidth]
  );

  const handleResizeStart = (e) => {
    e.stopPropagation();
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  };

  const handleResize = (e) => {
    e.stopPropagation();
    const { offsetX } = e.nativeEvent;
    const newWidth = width - offsetX;
    const maxWidth = windowDimensions.width - remToPx('3.5rem');

    setWidth(
      newWidth >= maxWidth ? maxWidth : newWidth >= minWidth ? newWidth : minWidth
    );
  };

  const handleRightClick = (e) =>
    renderOptions(e, <FolderContentsContextMenu path={path} createFSO={createFSO} />);

  const preventDefault = (e) => e.preventDefault();

  const getEntries = (items) => {
    let entries = [];
    for (let i = 0; i < items.length; i++) {
      entries.push(items[i].webkitGetAsEntry());
    }

    return entries;
  };

  const handleDrop = (e) => {
    if (!e.dataTransfer.files.length) {
      e.preventDefault();
      const dataTransfer = JSON.parse(e.dataTransfer.getData('json'));
      const dragObject = dataTransfer.dragObject;
      if (dataTransfer.origin === 'Desktop') {
        moveFSO(
          Path.join(dragObject.path, dragObject.name),
          Path.join(path, dragObject.name)
        );
      }
    } else {
      e.preventDefault();
      startProcess('File Transfer Dialog', {
        entries: getEntries(e.dataTransfer.items),
        dropPath: path,
      });
    }
  };

  const calcWidth = () => {
    let sum = 0;
    for (let [key, value] of Object.entries(columnHeadingsWidth)) {
      if (!searchResults.length && key === 'Location');
      else typeof value !== 'number' ? (sum += remToPx(value)) : (sum += value);
    }
    return sum;
  };

  const handleDragStart = (e) => {
    e.stopPropagation();
    enableSelection(e);
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  };

  useEffect(() => {
    setWatcherPath(path);
  }, [path]);

  useEffect(() => {
    if (windowWidthOnFirstRender.current === 0) {
      setWidth(windowDimensions.width - 150);
      windowWidthOnFirstRender.current = windowDimensions.width;
    }
  }, [windowDimensions.width]);

  useEffect(() => {
    const maxWidth = windowDimensions.width - remToPx('3.5rem');
    const windowWidthDiff = windowDimensions.width - previousWindowWidthRef.current;
    const newWidth = width + windowWidthDiff;
    if (width + windowWidthDiff > minWidth && newWidth <= maxWidth)
      setWidth(width + windowWidthDiff);
    previousWindowWidthRef.current = windowDimensions.width;
  }, [windowDimensions.width]);

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDrag={handleSelection}
      onDragEnd={disableSelection}
      ref={folderContentsRef}
      className='fx-folder-contents'
      style={{ width }}
      onContextMenu={handleRightClick}
      onDragEnter={preventDefault}
      onDragOver={preventDefault}
      onDrop={handleDrop}
    >
      <div className='column-headings'>
        {Object.keys(columnHeadingsWidth).map((columnHeading) => (
          <ColumnHeading
            name={columnHeading}
            width={columnHeadingsWidth[columnHeading]}
            setColumnHeadingWidth={setColumnHeadingWidth}
            visible={
              columnHeading === 'Location'
                ? searchResults.length > 0 && columnHeading === 'Location'
                : true
            }
          />
        ))}
      </div>
      <div
        className='fso-list'
        style={{
          width: calcWidth(),
        }}
        onDragEnter={(e) => e.stopPropagation()}
      >
        {[searchResults.length ? searchResults : folderContent][0].map((fso, i) => {
          return (
            <FsoListItem
              key={fso.node}
              name={fso.name}
              dateModified={moment(fso.ctime).format('DD/MM/YYYY hh:mm a')}
              type={fso.type}
              size={fso.size}
              columnHeadingsWidth={columnHeadingsWidth}
              path={path}
              renameFSO={renameFSO}
              deleteFSO={deleteFSO}
              changePath={changePath}
              location={fso.path}
              moveFSO={moveFSO}
              setExpandBranches={setExpandBranches}
              openFile={openFile}
              endProcess={endProcess}
              ppid={ppid}
              rectRef={rectRef}
              selectedElements={selectedElements}
              setSelectedElements={setSelectedElements}
              dimensions={dimensions}
            />
          );
        })}
      </div>
      <div
        draggable
        onDragStart={handleResizeStart}
        onDrag={handleResize}
        onDragEnd={handleResize}
        className='folder-contents-resize'
      ></div>
      <div ref={rectRef} className='rect-selection' style={{ ...calcRectStyle() }}></div>
    </div>
  );
};

export default FileExplorerFolderContents;
