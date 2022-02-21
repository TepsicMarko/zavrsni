import './DesktopIcon.css';
import { FcFolder } from 'react-icons/fc';
import { AiFillFileText } from 'react-icons/ai';
import { GoFileSymlinkFile } from 'react-icons/go';
import { BsFileEarmarkFill } from 'react-icons/bs';
import { useContext, useState, useEffect, useRef, useMemo } from 'react';
import { FileSystemContext } from '../../../../contexts/FileSystemContext';
import { RightClickMenuContext } from '../../../../contexts/RightClickMenuContext';
import useInput from '../../../../hooks/useInput';
import DesktopIconContextMenu from '../../component-specific-context-menus/DesktopIconContextMenu';
import openWithDefaultApp from '../../../../utils/helpers/openWithDefaultApp';
import { path as Path } from 'filer';
import getFileType from '../../../../utils/helpers/getFileType';
import isInSelection from '../../../../utils/helpers/isInSelection';
import useClickOutside from '../../../../hooks/useClickOutside';

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
  const [inputValue, handleInputChange] = useInput(name);
  const [imgSrc, setImgSrc] = useState('');
  const { renameFSO, deleteFSO, readFileContent, readBlob } =
    useContext(FileSystemContext);
  const { renderOptions } = useContext(RightClickMenuContext);
  const inputRef = useRef(null);
  const iconRef = useClickOutside('mousedown', () => {
    setIsSelected(false);
    setIsInputTextSelected(false);
  });

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

  const setImageSource = (src) => {
    imgSrc.length === 0 && setImgSrc(src);
  };

  const renderIcon = useMemo(() => {
    if (type === 'file') {
      const fileType = getFileType(Path.extname(name));

      if (fileType === 'text') return <AiFillFileText size='2.5rem' color='white' />;

      if (fileType === 'image') {
        readFileContent(Path.join(path, name), setImageSource);
        return <img src={imgSrc} width='70%' height='100%' draggable={false} />;
      }

      if (fileType === 'video') {
        readBlob(Path.join(path, name), setImageSource);
        return <video src={imgSrc} width='70%' height='100%' draggable={false} />;
      }

      if (fileType === undefined)
        return <BsFileEarmarkFill size='2.5rem' color='white' />;
    } else if (type === 'link') return <GoFileSymlinkFile size='2.5rem' color='white' />;
    else return <FcFolder size='2.5rem' />;
  }, [imgSrc]);

  const handleClick = (e) => {
    e.stopPropagation();
    setIsSelected(true);
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

  const handleDelete = async () => {
    if (Object.keys(selectedElements).length)
      Object.values(selectedElements).forEach(async ({ path, name, type }) => {
        await deleteFSO(path, name, type.toLowerCase());
        deleteFromGrid(name);
      });
    else {
      await deleteFSO(path, name, type.toLowerCase());
      deleteFromGrid(name);
    }
  };
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

  const handleRightClick = (e) => {
    handleClick(e);
    renderOptions(
      e,
      <DesktopIconContextMenu
        inputRef={inputRef}
        handleDelete={handleDelete}
        handleOpen={handleOpen}
        selectDivText={selectDivText}
        handleFocus={handleFocus}
      />
    );
  };

  const stopPropagation = (e) => e.stopPropagation();

  const handleDoubleClick = (e) => openWithDefaultApp(type, path, name, startProcess);

  useEffect(() => {
    if (rectRef) {
      const selection = rectRef.current;
      const icon = iconRef.current;

      if (isInSelection(icon, selection)) {
        setIsSelected(true);
        !selectedElements[name] &&
          setSelectedElements({
            ...selectedElements,
            [name]: { name, path, type },
          });
      } else {
        setIsSelected(false);
      }
    }
  });

  useEffect(() => {
    if (!isSelected) setSelectedElements(({ [name]: remove, ...rest }) => ({ ...rest }));

    return () => setSelectedElements(({ [name]: remove, ...rest }) => ({ ...rest }));
  }, [isSelected]);

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
    >
      {renderIcon}
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
