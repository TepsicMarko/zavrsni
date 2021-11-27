import "./DesktopIcon.css";
import { FcFolder } from "react-icons/fc";
import { AiFillFileText } from "react-icons/ai";
import { GoFileSymlinkFile } from "react-icons/go";
import { useContext, useState, useEffect, useRef } from "react";

import { FileSystemContext } from "../../../../contexts/FileSystemContext";
import { RightClickMenuContext } from "../../../../contexts/RightClickMenuContext";
import useInput from "../../../../hooks/useInput";
import DesktopIconContextMenu from "../../component-specific-context-menus/DesktopIconContextMenu";

const DesktopIcon = ({
  name,
  path,
  type,
  isTextDocument,
  isShortcut,
  gridPosition,
  updateGridItemName,
  deleteFromGrid,
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [display, setDisplay] = useState("-webkit-box");
  const [inputValue, handleInputChange] = useInput(name);
  const { updateFSO, deleteFSO } = useContext(FileSystemContext);
  const { renderOptions, closeMenu } = useContext(RightClickMenuContext);
  const inputRef = useRef(null);

  const handleFocus = (e) => setDisplay("inline-block");
  const handleBlur = (e) => {
    setDisplay("-webkit-box");
    setIsSelected(false);
    if (name !== inputValue && isSelected) {
      updateFSO({ old: name, new: inputValue }, path);
      updateGridItemName({ old: name, new: inputValue });
    }
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
  const handleRightClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const { clientX, clientY } = e;
    const mousePosition = { x: clientX, y: clientY };
    renderOptions(
      mousePosition,
      <DesktopIconContextMenu
        name={name}
        path={path}
        type={type}
        closeMenu={closeMenu}
        deleteFSO={deleteFSO}
        deleteFromGrid={deleteFromGrid}
        inputRef={inputRef}
      />
    );
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
      onContextMenu={handleRightClick}
      style={{ gridArea: gridPosition }}
      draggable
      onDragStart={handleDragStart}
    >
      {renderIcon()}
      <div
        ref={inputRef}
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
