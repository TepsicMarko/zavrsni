import './DesktopIcon.css';
import { FcFolder } from 'react-icons/fc';
import { AiFillFileText } from 'react-icons/ai';
import { GoFileSymlinkFile } from 'react-icons/go';
import { BsFileEarmarkFill } from 'react-icons/bs';
import { useContext, useState, useEffect, useRef, useCallback } from 'react';
import { FileSystemContext } from '../../../../contexts/FileSystemContext';
import { RightClickMenuContext } from '../../../../contexts/RightClickMenuContext';
import useInput from '../../../../hooks/useInput';
import DesktopIconContextMenu from '../../component-specific-context-menus/DesktopIconContextMenu';
import openWithDefaultApp from '../../../../utils/helpers/openWithDefaultApp';
import { path as Path } from 'filer';
import getFileType from '../../../../utils/helpers/getFileType';
import isInSelection from '../../../../utils/helpers/isInSelection';
import chrome from '../../../../assets/chrome.svg';
import pdf from '../../../../assets/pdf.jpg';
import useKeyboardShortcut from '../../../../hooks/useKeyboardShortcut';
import mime from 'mime-types';
import downloadFile from '../../../../utils/helpers/downloadFile';

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
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [isInputTexSelected, setIsInputTextSelected] = useState(false);
  const [isCut, setIsCut] = useState(false);
  const [dontDeselect, setDontDeselect] = useState(false);
  const [inputValue, handleInputChange] = useInput(name);
  const [imgSrc, setImgSrc] = useState('');
  const {
    renameFSO,
    deleteFSO,
    readFileContent,
    readBlob,
    moveFSO,
    cutFiles,
    copyFiles,
    cut,
    getFolder,
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
      const fileType = getFileType(Path.extname(name));

      if (fileType === 'document') {
        const ext = Path.extname(name);
        if (ext === '.html')
          return <img src={chrome} width='45rem' draggable={false} s />;
        if (ext === '.pdf') return <img src={pdf} width='45rem' draggable={false} />;
      }

      if (fileType === 'text') return <AiFillFileText size='2.5rem' color='white' />;

      if (fileType === 'image') {
        return <img src={imgSrc} width='70%' height='100%' draggable={false} />;
      }

      if (fileType === 'video') {
        return <video src={imgSrc} width='70%' height='100%' draggable={false} />;
      }

      if (fileType === undefined)
        return <BsFileEarmarkFill size='2.5rem' color='white' />;
    } else if (type === 'link') return <GoFileSymlinkFile size='2.5rem' color='white' />;
    else return <FcFolder size='2.5rem' />;
  };

  const handleClick = (e) => {
    // e.stopPropagation();
    !isSelected && setIsSelected(true);
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

  const handleRightClick = (e) => {
    e.stopPropagation();
    !selectedElements[name] && setSelectedElements({});
    !isSelected && setIsSelected(true);
    setDontDeselect(true);

    renderOptions(
      e,
      <DesktopIconContextMenu
        inputRef={inputRef}
        handleDelete={handleDelete}
        handleOpen={handleOpen}
        selectDivText={selectDivText}
        handleFocus={handleFocus}
        handleCopy={handleCopy}
        handleCut={handleCut}
        handleFileDownload={handleFileDownload}
      />
    );
  };

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
    const fileType = await getFileType(Path.extname(name));
    if (type === 'file') {
      (fileType === 'video' || fileType === 'image') &&
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
      {renderIcon(isCut ? 0.5 : 1)}
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
      >
        {name}
      </div>
    </div>
  );
};

export default DesktopIcon;
