import './FsoListItem.css';
import {
  memo,
  useRef,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
} from 'react';
import getFileTypeIcon from '../../../../../utils/helpers/getFileTypeIcon';
import FsoListItemContextMenu from '../../../../system/component-specific-context-menus/FsoListItemContextMenu';
import selectInputContent from '../../../../../utils/helpers/selectInputContent';
import { RightClickMenuContext } from '../../../../../contexts/RightClickMenuContext';
import { ProcessesContext } from '../../../../../contexts/ProcessesContext';
import { FileSystemContext } from '../../../../../contexts/FileSystemContext';
import { path as Path } from 'filer';
import useInput from '../../../../../hooks/useInput';
import openWithDefaultApp from '../../../../../utils/helpers/openWithDefaultApp';
import getFileType from '../../../../../utils/helpers/getFileType';
import isInSelection from '../../../../../utils/helpers/isInSelection';
import useClickOutside from '../../../../../hooks/useClickOutside';
import useKeyboardShortcut from '../../../../../hooks/useKeyboardShortcut';
import moment from 'moment';
import downloadFile from '../../../../../utils/helpers/downloadFile';
import jszip from 'jszip';
import mime from 'mime';

import chrome from '../../../../../assets/chrome.svg';
import pdf from '../../../../../assets/pdf.jpg';
import zip from '../../../../../assets/zip.png';

const FsoListItem = ({
  fso: { name, mtime, type, size, location },
  path,
  changePath,
  setExpandBranches,
  openFile,
  endProcess,
  pid,
  ppid,
  rectRef,
  selectedElements,
  setSelectedElements,
  mode,
  setSelectedFile,
  addToGrid,
}) => {
  const inputRef = useRef(null);
  const { renderOptions } = useContext(RightClickMenuContext);
  const { startProcess } = useContext(ProcessesContext);
  const {
    renameFSO,
    deleteFSO,
    moveFSO,
    cutFiles,
    copyFiles,
    cut,
    readBlob,
    readFileContent,
    getFolder,
    createFSO,
    createBlob,
  } = useContext(FileSystemContext);
  const [inputValue, handleInputChange] = useInput(name);
  const [isSelected, setIsSelected] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isCut, setIsCut] = useState(false);
  const fsoRef = useClickOutside('click', () => setIsSelected(false));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.target.blur();
    }
    if (e.key === 'Backspace') {
      e.stopPropagation();
    }
  };

  const focusInput = (e) => {
    e.stopPropagation();
    setIsInputFocused(true);
    selectInputContent(inputRef.current);
  };

  const handleBlur = (e) => {
    setIsInputFocused(false);

    if (name !== inputValue && inputValue.length)
      renameFSO(path, { old: name, new: inputValue });
  };

  const handleDelete = useCallback(() => {
    if (Object.keys(selectedElements).length)
      Object.values(selectedElements).forEach(({ path, name, type }) => {
        deleteFSO(path, name, type.toLowerCase());
      });
    else deleteFSO(path, name, type.toLowerCase());
  }, [deleteFSO, selectedElements]);

  const handleCopy = useCallback(
    () =>
      copyFiles(
        Object.keys(selectedElements).length
          ? Object.values(selectedElements)
          : [{ path, name, type }]
      ),
    [selectedElements, copyFiles]
  );
  const handleCut = useCallback(
    () =>
      cutFiles(
        Object.keys(selectedElements).length
          ? Object.values(selectedElements)
          : [{ path, name, type }]
      ),
    [selectedElements, cutFiles]
  );

  const handleDownload = async () => {
    if (Object.keys(selectedElements).length) {
      for (let { path, name, type } of Object.values(selectedElements)) {
        await downloadFile(
          path,
          name,
          type.toLowerCase(),
          getFolder,
          readBlob,
          readFileContent
        );
      }
    } else
      downloadFile(path, name, type.toLowerCase(), getFolder, readBlob, readFileContent);
  };

  const extractFiles = async () => {
    const unzip = new jszip();
    const zipped = await readBlob(Path.join(path, name), mime.lookup(name), true);

    unzip.loadAsync(zipped).then(async (unzipped) => {
      let rootDirCreated = false;
      for (let file of Object.values(unzipped.files)) {
        if (file.dir) {
          await createFSO(path, file.name, 'directory');
          !rootDirCreated && addToGrid([file.name.slice(0, -1)], { row: 1, column: 1 });
          !rootDirCreated && (rootDirCreated = true);
        } else {
          await createBlob(
            path,
            file.name,
            file._data.compressedContent || new ArrayBuffer()
          );
        }
      }
    });
  };

  const handleRightClick = (e) =>
    renderOptions(
      e,
      <FsoListItemContextMenu
        name={name}
        deletePath={path}
        handleDelete={handleDelete}
        focusInput={focusInput}
        path={path}
        changePath={changePath}
        type={type}
        startProcess={startProcess}
        handleCopy={handleCopy}
        handleCut={handleCut}
        handleDownload={handleDownload}
        isZip={mime.lookup(name) === 'application/zip'}
        extractFiles={extractFiles}
      />
    );

  const handleDoubleClick = (e) => {
    if (type === 'DIRECTORY') {
      setExpandBranches(true);
      changePath(location ? location : Path.join(path, name));
    } else {
      if (openFile) {
        openFile(path, name);
        return endProcess('File Explorer', pid, 'Notepad', ppid);
      }
      openWithDefaultApp(type, path, name, startProcess);
    }
  };

  const handleClick = (e) => {
    mode !== 'v' && setSelectedFile(name.replace(/\.[^/.]+$/, ''));
    setIsSelected(true);
  };

  const handleDragStart = (e) => {
    e.stopPropagation();
    e.dataTransfer.setData(
      'json',
      JSON.stringify({
        origin: 'File Explorer',
        dragObjects: [
          ...(Object.keys(selectedElements).length
            ? Object.values(selectedElements)
            : [{ path, name }]),
        ],
      })
    );
  };

  const preventDefault = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    let dataTransfer;
    try {
      JSON.parse(e.dataTransfer.getData('json'));

      const dragObject = dataTransfer.dragObject;
      console.log(dragObject, path);
      if (type === 'DIRECTORY') {
        moveFSO(
          Path.join(dragObject.path, dragObject.name),
          Path.join(path, name, dragObject.name)
        );
      }
    } catch (e) {}
  };

  const renderIcon = () => {
    if (type === 'FILE') {
      const ext = Path.extname(name);

      if (ext === '.html') return <img src={chrome} width='14px' draggable={false} />;
      else if (ext === '.pdf') return <img src={pdf} width='14px' draggable={false} />;
      else if (ext === '.zip')
        return (
          <img src={zip} width='12px' style={{ paddingRight: '2px' }} draggable={false} />
        );
      else return getFileTypeIcon(getFileType(ext));
    } else {
      return getFileTypeIcon(type);
    }
  };

  useLayoutEffect(() => {
    isInputFocused && inputRef.current.focus();
  }, [isInputFocused]);

  useEffect(() => {
    if (rectRef) {
      const selection = rectRef.current;
      const fso = fsoRef.current;

      if (isInSelection(fso, selection)) {
        setIsSelected(true);
        !selectedElements[name] &&
          setSelectedElements({
            ...selectedElements,
            [name]: { name, path, type },
          });
      } else {
        setIsSelected(false);
        setSelectedElements(({ [name]: remove, ...rest }) => rest);
      }
    }
  });

  useEffect(() => {
    !selectedElements[name] && isSelected && setIsSelected(false);
  }, [selectedElements]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.which === 1 && fsoRef.current && !fsoRef.current.contains(e.target)) {
        if (!Object.keys(selectedElements).length) {
          setIsSelected(false);
        } else setSelectedElements({});
      }
    };

    document.addEventListener('mouseup', handleClickOutside);
    return () => {
      document.removeEventListener('mouseup', handleClickOutside);
    };
  }, [selectedElements]);

  useEffect(() => {
    if (cut.length)
      if (!cut.find((file) => file.name === name)) setIsCut(false);
      else !isCut && setIsCut(true);
    else isCut && setIsCut(false);
  }, [cut]);

  const updateCutHandler = useKeyboardShortcut(['ctrl', 'x'], handleCut);
  const updateCopyHandler = useKeyboardShortcut(['ctrl', 'c'], handleCopy);
  const updateDeleteHandler = useKeyboardShortcut(
    ['delete'],
    isSelected ? handleDelete : undefined
  );

  useEffect(() => {
    updateCutHandler(isSelected ? handleCut : undefined);
    updateCopyHandler(isSelected ? handleCopy : undefined);
    updateDeleteHandler(isSelected ? handleDelete : undefined);
  }, [handleCut, handleCopy, handleDelete, isSelected]);

  return (
    <tr
      ref={fsoRef}
      draggable
      onDragEnter={preventDefault}
      onDragOver={preventDefault}
      onDrop={handleDrop}
      className='fso-list-item'
      style={{
        maxWidth: 'inherit',
        backgroundColor: isSelected ? 'gray' : '',
      }}
      onContextMenu={handleRightClick}
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
      onDragStart={handleDragStart}
    >
      <td>
        <span className='fso-list-item-icon' style={{ opacity: isCut ? 0.5 : 1 }}>
          {renderIcon()}
        </span>
        <span
          contentEditable={isInputFocused}
          className='fso-list-item-name-input'
          ref={inputRef}
          suppressContentEditableWarning={true}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onInput={handleInputChange}
          onDoubleClick={(e) => (isInputFocused ? e.stopPropagation() : undefined)}
        >
          {name}
        </span>
      </td>
      {location && <td className='fso-location'>{location}</td>}
      <td className='fso-mtime'>
        <span>{moment(mtime).format('DD/MM/YYYY hh:mm a')}</span>
      </td>
      <td>{type.toLowerCase()}</td>
      <td>{size}</td>
    </tr>
  );
};

export default memo(FsoListItem);
