import "./FsoListItem.css";
import { memo, useRef, useContext } from "react";
import remToPx from "../../../../../helpers/remToPx";
import getFileTypeIcon from "../../../../../utils/getFileTypeIcon";
import FsoListItemContextMenu from "../../../../system/component-specific-context-menus/FsoListItemContextMenu";
// import useInput from "../../../../../hooks/useInput";
import selectInputContent from "../../../../../utils/selectInputContent";
import { RightClickMenuContext } from "../../../../../contexts/RightClickMenuContext";
import { path as Path } from "filer";
import useInput from "../../../../../hooks/useInput";

const FsoListItem = ({
  name,
  dateModified,
  type,
  size,
  columnHeadingsWidth,
  path,
  updateFSO,
  deleteFSO,
  changePath,
  maxWidth,
  location,
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
  const [inputValue, handleInputChange] = useInput(name);

  const getMaxWidth = () =>
    Object.keys(columnHeadingsWidth)
      .map((key) => columnHeadingsWidth[key])
      .reduce((prev, curr) => {
        if (`${prev}`.includes("rem")) prev = remToPx(prev);
        else prev = parseFloat(prev);

        if (`${curr}`.includes("rem")) curr = remToPx(curr);
        else curr = parseFloat(curr);

        return prev + curr;
      });

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
      updateFSO({ old: name, new: inputValue }, path);
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
        type={type.toLowerCase()}
        Path={Path}
      />
    );

  const handleDoubleClick = (e) => {
    changePath(Path.join(path, name));
  };

  return (
    <div
      className='fso-list-item'
      style={{
        maxWidth: getMaxWidth(),
      }}
      onContextMenu={handleRightClick}
      onDoubleClick={handleDoubleClick}
    >
      <div style={{ minWidth: Name, maxWidth: Name }}>
        <span className='fso-list-item-icon'> {getFileTypeIcon(type)}</span>
        <span
          className='fso-list-item-name-input'
          ref={inputRef}
          suppressContentEditableWarning={true}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          style={{ maxWidth: maxWidth - remToPx("2rem") }}
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
