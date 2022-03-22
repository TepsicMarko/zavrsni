import './DesktopIcon.css';
import { GoFileSymlinkFile } from 'react-icons/go';
import {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  cloneElement,
} from 'react';
import { FileSystemContext } from '../../../../contexts/FileSystemContext';
import { RightClickMenuContext } from '../../../../contexts/RightClickMenuContext';
import useInput from '../../../../hooks/useInput';
import FileContextMenu from '../../context-menus/FileContextMenu';
import openWithDefaultApp from '../../../../utils/helpers/openWithDefaultApp';
import { path as Path } from 'filer';
import isInSelection from '../../../../utils/helpers/isInSelection';
import emptyFolder from '../../../../assets/icons/file-icons/emptyFolder.ico';
import useKeyboardShortcut from '../../../../hooks/useKeyboardShortcut';
import mime from 'mime-types';
import downloadFile from '../../../../utils/helpers/downloadFile';
import jszip from 'jszip';
import getFileTypeIcon from '../../../../utils/helpers/getFileTypeIcon';
import videoOverlay from '../../../../assets/icons/system-icons/videoOverlay.ico';

const DesktopIcon = ({
  name,
  path,
  type,
  gridPosition,
  updateGridItemName,
  deleteFromGrid,
  startProcess,
  rectRef,
  selectedElements,
  setSelectedElements,
  addToGrid,
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [isUserSelected, setIsUserSelected] = useState(false);
  const [isInputTexSelected, setIsInputTextSelected] = useState(false);
  const [isCut, setIsCut] = useState(false);
  const [dontDeselect, setDontDeselect] = useState(false);
  const [inputValue, handleInputChange] = useInput(name);
  const [imgSrc, setImgSrc] = useState('');
  const {
    renameFSO,
    deleteFSO,
    createFSO,
    readFileContent,
    readBlob,
    moveFSO,
    cutFiles,
    copyFiles,
    cut,
    getFolder,
    createBlob,
  } = useContext(FileSystemContext);
  const { renderOptions } = useContext(RightClickMenuContext);
  const inputRef = useRef(null);
  const iconRef = useRef(null);

  const handleBlur = (e) => {
    if (name !== inputValue && inputValue.length && isSelected) {
      renameFSO(path, { old: name, new: inputValue });
      updateGridItemName({ old: name, new: inputValue });
    }

    if (window.getSelection) {
      if (window.getSelection().empty) {
        // Chrome
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {
        // Firefox
        window.getSelection().removeAllRanges();
      }
    } else if (document.selection) {
      // IE?
      document.selection.empty();
    }
  };

  const renderIcon = () => {
    if (type === 'file') {
      const mimeType = mime.lookup(name) || '';

      if (mimeType.startsWith('image'))
        return <img src={imgSrc} width='70%' height='100%' draggable={false} />;

      if (mimeType.startsWith('video'))
        return (
          <div className='video-icon-container flex-center'>
            <video src={imgSrc} width='70%' height='100%' draggable={false} />
            <img src={videoOverlay} width='70%' draggable={false} />
            <div></div>
            <div></div>
          </div>
        );

      return cloneElement(getFileTypeIcon(name), {
        style: { width: '2.5rem' },
        draggable: false,
      });
    } else if (type === 'link') return <GoFileSymlinkFile size='2.5rem' color='white' />;
    else return <img src={emptyFolder} width='50rem' draggable={false} />;
  };

  const handleClick = (e) => {
    // e.stopPropagation();
    !isSelected && setIsSelected(true);
    !isUserSelected && setIsUserSelected(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      inputRef.current.blur();
    }
  };

  const handleDragStart = (e) => {
    e.stopPropagation();
    e.dataTransfer.setData(
      'json',
      JSON.stringify({
        origin: 'Desktop',
        dragObjects: [
          ...(Object.keys(selectedElements).length
            ? [
                name,
                ...Object.values(selectedElements)
                  .map((el) => el.name)
                  .filter((el) => el !== name),
              ]
            : [name]),
        ],
      })
    );
  };

  const handleDelete = useCallback(async () => {
    if (Object.keys(selectedElements).length)
      for (let { path, name, type } of Object.values(selectedElements)) {
        await deleteFSO(path, name, type.toLowerCase());
        deleteFromGrid(name);
      }
    else {
      await deleteFSO(path, name, type.toLowerCase());
      deleteFromGrid(name);
    }
  }, [selectedElements, deleteFSO, deleteFromGrid]);
  const handleOpen = () => {
    openWithDefaultApp(type, path, name, startProcess);
  };

  const selectDivText = (el) => {
    if (document.body.createTextRange) {
      let range = document.body.createTextRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(
        el.firstChild,
        Path.basename(el.textContent, Path.extname(el.textContent)).length
      );
      range.select();
      setIsInputTextSelected(true);
    } else if (window.getSelection) {
      let selection = window.getSelection();
      let range = document.createRange();
      selection.removeAllRanges();
      range.setStart(el.firstChild, 0);
      range.setEnd(
        el.firstChild,
        Path.basename(el.textContent, Path.extname(el.textContent)).length
      );
      selection.addRange(range);
      setIsInputTextSelected(true);
    }
  };

  const handleFocus = (e) => {
    handleClick(e);
    isSelected && !isInputTexSelected && selectDivText(inputRef.current);
  };

  const handleCopy = useCallback(
    () =>
      copyFiles(
        Object.keys(selectedElements).length
          ? Object.values(selectedElements)
          : [{ path, name, type }]
      ),
    [selectedElements, copyFiles]
  );
  const handleCut = useCallback(() => {
    cutFiles(
      Object.keys(selectedElements).length
        ? Object.values(selectedElements)
        : [{ path, name, type }]
    );
    setIsCut(true);
  }, [selectedElements, cutFiles]);

  const handleFileDownload = async () => {
    if (Object.keys(selectedElements).length) {
      for (let { path, name, type } of Object.values(selectedElements)) {
        await downloadFile(path, name, type, getFolder, readBlob, readFileContent);
      }
    } else downloadFile(path, name, type, getFolder, readBlob, readFileContent);
  };

  const extractFiles = async () => {
    const unzip = new jszip();
    const zipped = await readBlob(Path.join(path, name), mime.lookup(name), true);

    unzip.loadAsync(zipped).then(async (unzipped) => {
      let rootDirCreated = false;
      for (let file of Object.values(unzipped.files)) {
        if (file.dir) {
          await createFSO(path, file.name, 'directory');
          !rootDirCreated &&
            addToGrid([file.name.slice(0, -1), undefined], { row: 1, column: 1 });
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

  const focusInput = () => {
    inputRef.current.focus();
    selectDivText(inputRef.current);
  };

  const handleRightClick = (e) => {
    e.stopPropagation();
    !selectedElements[name] && setSelectedElements({});
    !isSelected && setIsSelected(true);
    !isUserSelected && setIsUserSelected(true);
    setDontDeselect(true);

    renderOptions(
      e,
      <FileContextMenu
        fileName={name}
        fileType={type}
        deleteFile={handleDelete}
        openFile={handleOpen}
        openInNotepad={openInNotepad}
        copyFile={handleCopy}
        cutFile={handleCut}
        focusInput={focusInput}
        downloadFile={handleFileDownload}
        isZip={mime.lookup(name) === 'application/zip'}
        extractZip={extractFiles}
      />
    );
  };

  const openInNotepad = () =>
    startProcess('Notepad', {
      path: Path.join(path, name),
    });

  const stopPropagation = (e) => e.stopPropagation();
  const handleDoubleClick = (e) => openWithDefaultApp(type, path, name, startProcess);

  const handleDrop = (e) => {
    const dataTransfer = JSON.parse(e.dataTransfer.getData('json'));

    if (
      dataTransfer.origin === 'Desktop' &&
      type === 'directory' &&
      !selectedElements[name] &&
      !dataTransfer.dragObjects.includes(name)
    ) {
      e.stopPropagation();

      dataTransfer.dragObjects.forEach((dragObject) => {
        moveFSO(Path.join(path, dragObject), Path.join(path, name, dragObject));
        deleteFromGrid(dragObject);
      });
    }
  };

  useEffect(async () => {
    const mimeType = mime.lookup(name);
    if (type === 'file') {
      (mimeType.startsWith('video') || mimeType.startsWith('image')) &&
        setImgSrc(await readBlob(Path.join(path, name), mime.lookup(name)));
    }
  }, []);

  useEffect(() => {
    if (rectRef) {
      const selection = rectRef.current;
      const icon = iconRef.current;

      if (isInSelection(icon, selection)) {
        !isSelected && setIsSelected(true);
        !selectedElements[name] &&
          setSelectedElements((currState) => ({
            ...currState,
            [name]: { name, path, type },
          }));
      } else {
        setIsSelected(false);
        setSelectedElements(({ [name]: remove, ...rest }) => rest);
      }
    }
  });

  useEffect(() => {
    !selectedElements[name] && !dontDeselect && isSelected && setIsSelected(false);
    dontDeselect && setDontDeselect(false);
  }, [selectedElements]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (iconRef.current && !iconRef.current.contains(e.target)) {
        if (e.which === 1) {
          if (!Object.keys(selectedElements).length) {
            setIsSelected(false);
            setIsUserSelected(false);
            setIsInputTextSelected(false);
          } else setSelectedElements({});
        }
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

  useEffect(() => (iconRef.current.firstChild.style.opacity = isCut ? 0.5 : 1), [isCut]);

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
    <div
      ref={iconRef}
      className={`flex-center desktop-icon${isSelected ? '-selected' : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleRightClick}
      style={{
        gridArea: `${gridPosition?.row}/${gridPosition?.column}/${gridPosition?.row}/${gridPosition?.column}`,
      }}
      draggable
      onDragStart={handleDragStart}
      onDrag={stopPropagation}
      onDrop={handleDrop}
    >
      <div className='flex-center'>{renderIcon(isCut ? 0.5 : 1)}</div>
      <div
        ref={inputRef}
        contentEditable={isSelected}
        suppressContentEditableWarning={true}
        className='desktop-icon-name'
        onClick={handleFocus}
        onInput={handleInputChange}
        onBlur={handleBlur}
        onKeyPress={handleKeyPress}
        onDoubleClick={stopPropagation}
        style={{ WebkitLineClamp: isUserSelected ? 'initial' : '2' }}
      >
        {name}
      </div>
    </div>
  );
};

export default DesktopIcon;
