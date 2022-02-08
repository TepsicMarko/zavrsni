import "./FsoListItem.css";
import { memo, useRef, useContext, useEffect, useState } from "react";
import getFileTypeIcon from "../../../../../utils/helpers/getFileTypeIcon";
import FsoListItemContextMenu from "../../../../system/component-specific-context-menus/FsoListItemContextMenu";
import selectInputContent from "../../../../../utils/helpers/selectInputContent";
import { RightClickMenuContext } from "../../../../../contexts/RightClickMenuContext";
import { ProcessesContext } from "../../../../../contexts/ProcessesContext";
import { path as Path } from "filer";
import useInput from "../../../../../hooks/useInput";
import openWithDefaultApp from "../../../../../utils/helpers/openWithDefaultApp";
import getFileType from "../../../../../utils/helpers/getFileType";
import isInSelection from "../../../../../utils/helpers/isInSelection";
import useClickOutside from "../../../../../hooks/useClickOutside";

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
  ppid,
  rectRef,
  selectedElements,
  setSelectedElements,
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
  const [isSelected, setIsSelected] = useState(false);
  const fsoRef = useClickOutside("click", () => setIsSelected(false));

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

  const handleDelete = () => {
    if (Object.keys(selectedElements).length)
      Object.values(selectedElements).forEach(({ path, name, type }) => {
        deleteFSO(path, name, type.toLowerCase());
      });
    else deleteFSO(path, name, type.toLowerCase());
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
        Path={Path}
        startProcess={startProcess}
      />
    );

  const handleDoubleClick = (e) => {
    if (openFile) {
      openFile(path, name);
      return endProcess("File Explorer", ppid, "Notepad");
    }
    if (type === "DIRECTORY") {
      setExpandBranches(true);
      changePath(location ? location : Path.join(path, name));
    } else openWithDefaultApp(type, path, name, startProcess);
  };

  const handleClick = (e) => {
    setIsSelected(true);
  };

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
      ref={fsoRef}
      draggable
      onDragEnter={preventDefault}
      onDragOver={preventDefault}
      onDrop={handleDrop}
      className='fso-list-item'
      style={{
        maxWidth: "inherit",
        backgroundColor: isSelected ? "gray" : "",
      }}
      onContextMenu={handleRightClick}
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
      onDragStart={handleDragStart}
    >
      <div style={{ minWidth: Name, maxWidth: Name }}>
        <span className='fso-list-item-icon'>
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
