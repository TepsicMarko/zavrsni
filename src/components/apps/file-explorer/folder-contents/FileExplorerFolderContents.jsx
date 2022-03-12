import './FileExplorerFolderContents.css';
import ColumnHeading from './column-heading/ColumnHeading';
import FsoListItem from './fso-list-item/FsoListItem';
import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import useWatchFolder from '../../../../hooks/useWatchFolder';
import remToPx from '../../../../utils/helpers/remToPx';
import moment from 'moment';
import { FileSystemContext } from '../../../../contexts/FileSystemContext';
import { ProcessesContext } from '../../../../contexts/ProcessesContext';
import { RightClickMenuContext } from '../../../../contexts/RightClickMenuContext';
import FolderContentsContextMenu from '../../../system/component-specific-context-menus/FolderContentsContextMenu';
import { path as Path } from 'filer';
import useSelectionRectangle from '../../../../hooks/useSelectionRectangle';

const FileExplorerFolderContents = ({
  changePath,
  path,
  searchResults,
  setItemCount,
  setExpandBranches,
  openFile,
  endProcess,
  ppid,
  addToGrid,
  mode,
  setSelectedFile,
}) => {
  const { watch, getFolder, renameFSO, deleteFSO, createFSO, moveFSO, pasteFiles } =
    useContext(FileSystemContext);
  const { startProcess } = useContext(ProcessesContext);
  const { renderOptions } = useContext(RightClickMenuContext);

  const [folderContent, setWatcherPath] = useWatchFolder(
    path,
    watch,
    getFolder,
    setItemCount
  );

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

  const setColumnHeadingWidth = useCallback(
    (name, width) => {
      setColumnHeadingsWidth({ ...columnHeadingsWidth, [name]: width });
    },
    [columnHeadingsWidth]
  );

  const handlePaste = () => pasteFiles(path);

  const handleRightClick = (e) =>
    renderOptions(
      e,
      <FolderContentsContextMenu
        path={path}
        createFSO={createFSO}
        addToGrid={addToGrid}
        handlePaste={handlePaste}
      />
    );

  const preventDefault = (e) => e.preventDefault();

  const getEntries = (items) => {
    let entries = [];
    for (let i = 0; i < items.length; i++) {
      entries.push(items[i].webkitGetAsEntry());
    }

    return entries;
  };

  const handleDrop = (e) => {
    e.stopPropagation();
    if (!e.dataTransfer.files.length) {
      e.preventDefault();
      let dataTransfer;
      try {
        dataTransfer = JSON.parse(e.dataTransfer.getData('json'));
      } catch (e) {
        return null;
      }
      if (dataTransfer.origin === 'Desktop') {
        const origin = '/C/users/admin/Desktop';
        dataTransfer.dragObjects.forEach((name) => {
          moveFSO(Path.join(origin, name), Path.join(path, name));
        });
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
    mode === 'v' && enableSelection(e);
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  };

  useEffect(() => {
    setWatcherPath(path);
  }, [path]);

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDrag={handleSelection}
      onDragEnd={disableSelection}
      className='fx-folder-contents'
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
        {[...(searchResults.length ? searchResults : folderContent)].map((fso, i) => {
          return (
            <FsoListItem
              key={fso.node}
              fso={fso}
              columnHeadingsWidth={columnHeadingsWidth}
              path={path}
              changePath={changePath}
              setExpandBranches={setExpandBranches}
              openFile={openFile}
              endProcess={endProcess}
              ppid={ppid}
              rectRef={rectRef}
              selectedElements={selectedElements}
              setSelectedElements={setSelectedElements}
              dimensions={dimensions}
              setSelectedFile={setSelectedFile}
              mode={mode}
            />
          );
        })}
      </div>
      <div ref={rectRef} className='rect-selection' style={{ ...calcRectStyle() }}></div>
    </div>
  );
};

export default FileExplorerFolderContents;
