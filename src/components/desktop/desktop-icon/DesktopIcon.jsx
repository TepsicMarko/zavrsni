import "./DesktopIcon.css";
import { FcFolder } from "react-icons/fc";
import { AiFillFileText } from "react-icons/ai";
import { GoFileSymlinkFile } from "react-icons/go";
import { useContext, useState, useEffect } from "react";

import { FileSystemContext } from "../../../contexts/FileSystemContext";
import useInput from "../../../hooks/useInput";

const DesktopIcon = ({
  name,
  path,
  isTextDocument,
  isShortcut,
  gridPosition,
  updateGridItemName,
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [display, setDisplay] = useState("-webkit-box");
  const [inputValue, handleInputChange] = useInput(name);
  const { updateFSO } = useContext(FileSystemContext);

  const handleFocus = (e) => setDisplay("inline-block");
  const handleBlur = (e) => {
    setDisplay("-webkit-box");
    setIsSelected(false);
    name !== inputValue && updateFSO({ old: name, new: inputValue }, path);
    updateGridItemName({ old: name, new: inputValue });
  };

  const renderIcon = () => {
    if (isTextDocument) return <AiFillFileText size='2.5rem' color='white' />;
    else if (isShortcut)
      return <GoFileSymlinkFile size='2.5rem' color='white' />;
    else return <FcFolder size='2.5rem' />;
    //convert this to object when it becomes more complicated
  };

  const handleDivChange = (e) => {
    handleInputChange({ target: { value: e.target.textContent } });
  };

  const handleClick = () => setIsSelected(true);

  const handleDragStart = (e) => e.dataTransfer.setData("text", name);
  const stopPropagation = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    const eventHandler = (e) => setIsSelected(false);
    document.addEventListener("mousedown", eventHandler);
    return () => {
      document.removeEventListener("mousedown", eventHandler);
    };
  }, []);

  return (
    <div
      className={`desktop-icon${isSelected ? "-selected" : ""}`}
      onClick={handleClick}
      onContextMenu={stopPropagation}
      style={{ gridArea: gridPosition }}
      draggable
      onDragStart={handleDragStart}
    >
      {renderIcon()}
      <div
        contentEditable
        className='desktop-icon-name'
        style={{ display }}
        onClick={handleClick}
        onInput={handleDivChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        {name}
      </div>
    </div>
  );
};

export default DesktopIcon;
