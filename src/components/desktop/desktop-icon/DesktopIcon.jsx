import "./DesktopIcon.css";
import { FcFolder } from "react-icons/fc";
import { AiFillFileText } from "react-icons/ai";
import { GoFileSymlinkFile } from "react-icons/go";
import { useContext, useRef, useEffect } from "react";

import { FileSystemContext } from "../../../contexts/FileSystemContext";
import useInput from "../../../hooks/useInput";

const DesktopIcon = ({
  name,
  path,
  isTextDocument,
  isShortcut,
  gridPosition,
}) => {
  const divRef = useRef(null);
  const [inputValue, handleInputChange] = useInput(name);
  const { updateFSO } = useContext(FileSystemContext);
  const handleFocus = (e) => {
    e.target.style.display = "block";
    // e.target.select();
  };

  const handleBlur = (e) => {
    e.target.style.display = "-webkit-box";
    divRef.current.setAttribute("class", "desktop-icon");
    name !== inputValue && updateFSO({ old: name, new: inputValue }, path);
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

  const handleClick = () => {
    divRef.current.setAttribute("class", "desktop-icon-selected");
  };
  const handleSelect = () => {
    divRef.current.setAttribute("class", "desktop-icon-selected");
  };

  const handleDragStart = (e) => e.dataTransfer.setData("text", name);

  useEffect(() => {
    const eventHandler = (e) => {
      divRef.current.setAttribute("class", "desktop-icon");
    };
    document.addEventListener("mousedown", eventHandler);

    return () => {
      document.removeEventListener("mousedown", eventHandler);
    };
  }, []);

  return (
    <div
      ref={divRef}
      className='desktop-icon'
      onClick={handleClick}
      onSelect={handleSelect}
      onFocusOut={() => divRef.current.setAttribute("class", "desktop-icon")}
      style={{ gridArea: gridPosition }}
      draggable
      onDragStart={handleDragStart}
    >
      {renderIcon()}
      <div
        contentEditable
        className='desktop-icon-name'
        type='text'
        onClick={handleClick}
        onInput={handleDivChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        {inputValue}
      </div>
    </div>
  );
};

export default DesktopIcon;
