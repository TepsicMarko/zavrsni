import './FileExplorerFolderContents.css';
import ColumnHeading from './column-heading/ColumnHeading';
import FsoListItem from './fso-list-item/FsoListItem';
import { useContext, useCallback } from 'react';
import useWatchFolder from '../../../../hooks/useWatchFolder';
import { FileSystemContext } from '../../../../contexts/FileSystemContext';
import { ProcessesContext } from '../../../../contexts/ProcessesContext';
import { RightClickMenuContext } from '../../../../contexts/RightClickMenuContext';
import FolderContentsContextMenu from '../../../system/context-menus/FolderContentsContextMenu';
import { path as Path } from 'filer';
import useSelectionRectangle from '../../../../hooks/useSelectionRectangle';
import useKeyboardShortcut from '../../../../hooks/useKeyboardShortcut';

const FileExplorerFolderContents = ({
  changePath,
  path,
  searchResults,
  setItemCount,
  setExpandBranches,
  openFile,
  endProcess,
  pid,
  ppid,
  addToGrid,
  mode,
  setSelectedFile,
  isFocused,
}) => {
  const { watch, getFolder, createFSO, moveFSO, pasteFiles, isClipboardEmpty } =
    useContext(FileSystemContext);
  const { startProcess } = useContext(ProcessesContext);
  const { renderOptions } = useContext(RightClickMenuContext);

  const [folderContent, sortFolderContent] = useWatchFolder(
    path,
    watch,
    getFolder,
    setItemCount
  );

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

  const handlePaste = useCallback(() => pasteFiles(path), [pasteFiles, path]);

  const handleRightClick = (e) =>
    renderOptions(
      e,
      <FolderContentsContextMenu
        path={path}
        createFSO={createFSO}
        addToGrid={addToGrid}
        handlePaste={handlePaste}
        isClipboardEmpty={isClipboardEmpty}
        sortFolderContent={sortFolderContent}
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

  const handleDragStart = (e) => {
    e.stopPropagation();
    mode === 'v' && enableSelection(e);
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  };

  useKeyboardShortcut(
    ['ctrl', 'v'],
    !isClipboardEmpty && isFocused ? handlePaste : undefined
  );

  return (
    <div
      className='fx-folder-contents-container'
      draggable
      onDragStart={handleDragStart}
      onDrag={handleSelection}
      onDragEnd={disableSelection}
      onContextMenu={handleRightClick}
      onDragEnter={preventDefault}
      onDragOver={preventDefault}
      onDrop={handleDrop}
    >
      <table className='fx-folder-contents' cellspacing='0'>
        <thead>
          <tr>
            {[
              ['Name'],
              ['Location'],
              ['Date Modified', 'mtimeMs'],
              ['Type'],
              ['Size'],
            ].map(([name, alt]) => (
              <ColumnHeading
                name={name}
                visible={
                  name === 'Location'
                    ? searchResults.length > 0 && name === 'Location'
                    : true
                }
                sortFolderContent={() => sortFolderContent(alt || name.toLowerCase())}
              />
            ))}
          </tr>
        </thead>
        <tbody onDragEnter={(e) => e.stopPropagation()}>
          <tr style={{ height: '0.5rem' }}></tr>

          {!searchResults.length && !folderContent.length ? (
            <div className='empty-folder'>This folder is empty</div>
          ) : (
            [...(searchResults.length ? searchResults : folderContent)].map((fso, i) => {
              return (
                <FsoListItem
                  key={fso.node}
                  fso={fso}
                  path={path}
                  changePath={changePath}
                  setExpandBranches={setExpandBranches}
                  openFile={openFile}
                  endProcess={endProcess}
                  pid={pid}
                  ppid={ppid}
                  rectRef={rectRef}
                  selectedElements={selectedElements}
                  setSelectedElements={setSelectedElements}
                  dimensions={dimensions}
                  setSelectedFile={setSelectedFile}
                  mode={mode}
                  addToGrid={addToGrid}
                />
              );
            })
          )}
        </tbody>
      </table>
      <div ref={rectRef} className='rect-selection' style={{ ...calcRectStyle() }}></div>
    </div>
  );
};

export default FileExplorerFolderContents;
