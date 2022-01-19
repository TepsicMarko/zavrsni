import "./FsoListItem.css";
import { memo, useRef, useContext } from "react";
import getFileTypeIcon from "../../../../../utils/getFileTypeIcon";
import FsoListItemContextMenu from "../../../../system/component-specific-context-menus/FsoListItemContextMenu";
import selectInputContent from "../../../../../utils/selectInputContent";
import { RightClickMenuContext } from "../../../../../contexts/RightClickMenuContext";
import { ProcessesContext } from "../../../../../contexts/ProcessesContext";
import { path as Path } from "filer";
import useInput from "../../../../../hooks/useInput";
import openWithDefaultApp from "../../../../../helpers/openWithDefaultApp";
import getFileType from "../../../../../helpers/getFileType";

const FsoListItem = ({
  name,
  dateModified,
  type,
  size,
  columnHeadingsWidth,
  path,
  renameFSO,
  deleteFSO,
  changePath,
  location,
  moveFSO,
  setExpandBranches,
  openFile,
  endProcess,
}) => {
  const {
    Name,
    Location,
    ["Date Modified"]: DateModified,
    Size,
    Type,
  } = columnHeadingsWidth;

  const inputRef = useRef(null);
  const { renderOptions } = useContext(RightClickMenuContext);
  const { startProcess } = useContext(ProcessesContext);
  const [inputValue, handleInputChange] = useInput(name);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.target.blur();
    }
    if (e.key === "Backspace") {
      e.stopPropagation();
    }
  };

  const focusInput = (e) => {
    e.stopPropagation();
    inputRef.current.setAttribute("contenteditable", "true");
    inputRef.current.focus();
    selectInputContent(inputRef.current);
  };

  const handleBlur = (e) => {
    e.target.setAttribute("contenteditable", "false");

    if (name !== inputValue && inputValue.length)
      renameFSO(path, { old: name, new: inputValue });
  };

  const handleRightClick = (e) =>
    renderOptions(
      e,
      <FsoListItemContextMenu
        name={name}
        deletePath={path}
        deleteFSO={deleteFSO}
        focusInput={focusInput}
        path={path}
        changePath={changePath}
        type={type}
        Path={Path}
        startProcess={startProcess}
      />
    );

  const handleDoubleClick = (e) => {
    if (openFile) {
      openFile(path, name);
      return endProcess("File Explorer", "Notepad");
    }
    if (type === "DIRECTORY") {
      setExpandBranches(true);
      changePath(location ? location : Path.join(path, name));
    } else openWithDefaultApp(type, path, name, startProcess);
  };

  const handleClick = (e) => {};

  const handleDragStart = (e) => {
    e.dataTransfer.setData(
      "json",
      JSON.stringify({
        origin: "File Explorer",
        dragObject: {
          name,
          type,
          path: location ? location : path,
        },
      })
    );
  };

  const preventDefault = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    const dataTransfer = JSON.parse(e.dataTransfer.getData("json"));
    const dragObject = dataTransfer.dragObject;
    console.log(dragObject, path);
    if (type === "DIRECTORY") {
      moveFSO(
        Path.join(dragObject.path, dragObject.name),
        Path.join(path, name, dragObject.name)
      );
    }
  };

  return (
    <div
      draggable
      onDragEnter={preventDefault}
      onDragOver={preventDefault}
      onDrop={handleDrop}
      className='fso-list-item'
      style={{
        maxWidth: "inherit",
      }}
      onContextMenu={handleRightClick}
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
      onDragStart={handleDragStart}
    >
      <div style={{ minWidth: Name, maxWidth: Name }}>
        <span className='fso-list-item-icon'>
          {" "}
          {getFileTypeIcon(
            type === "FILE" ? getFileType(Path.extname(name)) : type
          )}
        </span>
        <span
          className='fso-list-item-name-input'
          ref={inputRef}
          suppressContentEditableWarning={true}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          style={{ maxWidth: "calc(inherit - 2rem)" }}
          onInput={handleInputChange}
          onDoubleClick={(e) => e.stopPropagation()}
        >
          {name}
        </span>
      </div>
      {location && (
        <div style={{ minWidth: Location, maxWidth: Location }}>{location}</div>
      )}
      <div style={{ minWidth: DateModified, maxWidth: DateModified }}>
        {dateModified}
      </div>
      <div style={{ minWidth: Type, minWidth: Type }}>{type.toLowerCase()}</div>
      <div style={{ minWidth: Size, minWidth: Size }}>{size}</div>
    </div>
  );
};

export default memo(FsoListItem);
