import "./DesktopIcon.css";
import { FcFolder } from "react-icons/fc";
import { AiFillFileText } from "react-icons/ai";
import { GoFileSymlinkFile } from "react-icons/go";
import { BsFileEarmarkFill } from "react-icons/bs";
import { useContext, useState, useEffect, useRef, useMemo } from "react";
import { FileSystemContext } from "../../../../contexts/FileSystemContext";
import { RightClickMenuContext } from "../../../../contexts/RightClickMenuContext";
import useInput from "../../../../hooks/useInput";
import DesktopIconContextMenu from "../../component-specific-context-menus/DesktopIconContextMenu";
import openWithDefaultApp from "../../../../utils/helpers/openWithDefaultApp";
import { path as Path } from "filer";
import getFileType from "../../../../utils/helpers/getFileType";
import isInSelection from "../../../../utils/helpers/isInSelection";

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
  const [inputValue, handleInputChange] = useInput(name);
  const [imgSrc, setImgSrc] = useState("");
  const { renameFSO, deleteFSO, readFileContent, readBlob } =
    useContext(FileSystemContext);
  const { renderOptions } = useContext(RightClickMenuContext);
  const inputRef = useRef(null);
  const iconRef = useRef(null);

  const handleBlur = (e) => {
    if (name !== inputValue && inputValue.length && isSelected) {
      renameFSO(path, { old: name, new: inputValue });
      updateGridItemName({ old: name, new: inputValue });
    }
  };

  const setImageSource = (src) => {
    imgSrc.length === 0 && setImgSrc(src);
  };

  const renderIcon = useMemo(() => {
    if (type === "file") {
      const fileType = getFileType(Path.extname(name));

      if (fileType === "text")
        return <AiFillFileText size='2.5rem' color='white' />;

      if (fileType === "image") {
        readFileContent(Path.join(path, name), setImageSource);
        return <img src={imgSrc} width='70%' height='100%' draggable={false} />;
      }

      if (fileType === "video") {
        readBlob(Path.join(path, name), setImageSource);
        return (
          <video src={imgSrc} width='70%' height='100%' draggable={false} />
        );
      }

      if (fileType === undefined)
        return <BsFileEarmarkFill size='2.5rem' color='white' />;
    } else if (type === "link")
      return <GoFileSymlinkFile size='2.5rem' color='white' />;
    else return <FcFolder size='2.5rem' />;
  }, [imgSrc]);

  const handleClick = (e) => {
    e.stopPropagation();
    setIsSelected(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      inputRef.current.blur();
    }
  };

  const handleDragStart = (e) => {
    e.stopPropagation();
    e.dataTransfer.setData(
      "json",
      JSON.stringify({ origin: "Desktop", dragObject: { name, path } })
    );
  };

  const handleDelete = () => {
    if (Object.keys(selectedElements).length)
      Object.values(selectedElements).forEach(({ path, name, type }) => {
        deleteFSO(path, name, type.toLowerCase());
        deleteFromGrid(name);
      });
    else {
      deleteFSO(path, name, type.toLowerCase());
      deleteFromGrid(name);
    }
  };
  const handleOpen = () => {
    openWithDefaultApp(type, path, name, startProcess);
  };

  const handleRightClick = (e) =>
    renderOptions(
      e,
      <DesktopIconContextMenu
        inputRef={inputRef}
        handleDelete={handleDelete}
        handleOpen={handleOpen}
      />
    );

  const stopPropagation = (e) => e.stopPropagation();

  const handleDoubleClick = (e) =>
    openWithDefaultApp(type, path, name, startProcess);

  useEffect(() => {
    const eventHandler = (e) => setIsSelected(false);
    document.addEventListener("click", eventHandler);
    return () => {
      document.removeEventListener("click", eventHandler);
    };
  }, []);

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
    if (!isSelected)
      setSelectedElements(({ [name]: remove, ...rest }) => ({ ...rest }));

    return () =>
      setSelectedElements(({ [name]: remove, ...rest }) => ({ ...rest }));
  }, [isSelected]);

  return (
    <div
      ref={iconRef}
      className={`flex-center desktop-icon${isSelected ? "-selected" : ""}`}
      onMouseDown={stopPropagation}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleRightClick}
      style={{ gridArea: gridPosition }}
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
        onClick={handleClick}
        onInput={handleInputChange}
        onBlur={handleBlur}
        onKeyPress={handleKeyPress}
      >
        {name}
      </div>
    </div>
  );
};

export default DesktopIcon;
