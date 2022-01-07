import "./DesktopIcon.css";
import { FcFolder } from "react-icons/fc";
import { AiFillFileText } from "react-icons/ai";
import { GoFileSymlinkFile } from "react-icons/go";
import { useContext, useState, useEffect, useRef } from "react";
import { FileSystemContext } from "../../../../contexts/FileSystemContext";
import { RightClickMenuContext } from "../../../../contexts/RightClickMenuContext";
import useInput from "../../../../hooks/useInput";
import DesktopIconContextMenu from "../../component-specific-context-menus/DesktopIconContextMenu";
import openWithDefaultApp from "../../../../helpers/openWithDefaultApp";

const DesktopIcon = ({
  name,
  path,
  type,
  gridPosition,
  updateGridItemName,
  deleteFromGrid,
  startProcess,
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [inputValue, handleInputChange] = useInput(name);
  const { updateFSO, deleteFSO } = useContext(FileSystemContext);
  const { renderOptions } = useContext(RightClickMenuContext);
  const inputRef = useRef(null);

  const handleBlur = (e) => {
    if (name !== inputValue && inputValue.length && isSelected) {
      updateFSO({ old: name, new: inputValue }, path);
      updateGridItemName({ old: name, new: inputValue });
    }
  };

  const renderIcon = () => {
    if (type === "file") return <AiFillFileText size='2.5rem' color='white' />;
    else if (type === "link")
      return <GoFileSymlinkFile size='2.5rem' color='white' />;
    else return <FcFolder size='2.5rem' />;
    //convert this to object when it becomes more complicated
  };

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

  const handleDragStart = (e) =>
    e.dataTransfer.setData(
      "json",
      JSON.stringify({ origin: "Desktop", dragObject: { name, path } })
    );
  const handleRightClick = (e) =>
    renderOptions(
      e,
      <DesktopIconContextMenu
        name={name}
        path={path}
        type={type}
        deleteFSO={deleteFSO}
        deleteFromGrid={deleteFromGrid}
        inputRef={inputRef}
        openWithDefaultApp={openWithDefaultApp}
        startProcess={startProcess}
      />
    );

  const handleDoubleClick = (e) =>
    openWithDefaultApp(type, path, name, startProcess);

  useEffect(() => {
    const eventHandler = (e) => setIsSelected(false);
    document.addEventListener("click", eventHandler);
    return () => {
      document.removeEventListener("click", eventHandler);
    };
  }, []);

  return (
    <div
      className={`desktop-icon${isSelected ? "-selected" : ""}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleRightClick}
      style={{ gridArea: gridPosition }}
      draggable
      onDragStart={handleDragStart}
    >
      {renderIcon()}
      <div
        ref={inputRef}
        contentEditable={isSelected}
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
