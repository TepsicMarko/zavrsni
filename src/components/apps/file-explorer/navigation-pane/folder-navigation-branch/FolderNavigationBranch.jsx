import "./FolderNavigationBranch.css";
import { useContext, useMemo, useRef, useEffect } from "react";
import useToggle from "../../../../../hooks/useToggle";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { FcFolder } from "react-icons/fc";
import useWatchFolder from "../../../../../hooks/useWatchFolder";
import { path as Path } from "filer";
import { RightClickMenuContext } from "../../../../../contexts/RightClickMenuContext";
import NavigationPaneBranchContextMenu from "../../../../system/component-specific-context-menus/NavigationPaneBranchContextMenu";
import { FileSystemContext } from "../../../../../contexts/FileSystemContext";
import useInput from "../../../../../hooks/useInput";
import selectInputContent from "../../../../../utils/selectInputContent";

const FolderNavigationBranch = ({
  branchName,
  icon,
  depth,
  open,
  changePath,
  path,
  width,
}) => {
  const { watch, getFolder, createFSO, deleteFSO, updateFSO } =
    useContext(FileSystemContext);
  const [isOpen, toggleOpen] = useToggle(open);
  const [folderContent] = useWatchFolder(
    Path.join(path, branchName === "This PC" ? "" : branchName),
    watch,
    getFolder
  );
  const { renderOptions } = useContext(RightClickMenuContext);
  const [inputValue, handleInputChange] = useInput(branchName);
  const inputRef = useRef(null);

  const handleClick = (e) => {
    e.stopPropagation();
    changePath(Path.join(path, branchName === "This PC" ? "" : branchName));
  };

  const toggleChildBranches = (e) => {
    e.stopPropagation();
    toggleOpen();
  };

  const focusInput = (e) => {
    e.stopPropagation();
    inputRef.current.setAttribute("contenteditable", "true");
    inputRef.current.focus();
    selectInputContent(inputRef.current);
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { clientX, clientY } = e;
    const mousePosition = { x: clientX, y: clientY };
    renderOptions(
      mousePosition,
      <NavigationPaneBranchContextMenu
        name={branchName}
        deletePath={path}
        createPath={Path.join(path, branchName === "This PC" ? "" : branchName)}
        isOpen={isOpen}
        toggleOpen={toggleOpen}
        deleteFSO={deleteFSO}
        createFSO={createFSO}
        focusInput={focusInput}
      />
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      inputRef.current.blur();
    }
  };

  const handleBlur = (e) => {
    inputRef.current.setAttribute("contenteditable", "false");

    if (branchName !== inputValue && inputValue.length)
      updateFSO({ old: branchName, new: inputValue }, path);
  };

  useEffect(() => {
    const eventHandler = (e) => {
      inputRef?.current?.setAttribute("contenteditable", "false");
    };

    document.addEventListener("click", eventHandler);
    return () => {
      document.removeEventListener("click", eventHandler);
    };
  }, []);

  return (
    <>
      <div
        className='folder-navigation-branch'
        style={{ paddingLeft: depth * 0.5 * 16 }}
        onClick={handleClick}
        onContextMenu={handleRightClick}
      >
        <div className='branch-name'>
          {useMemo(
            () =>
              isOpen ? (
                <IoIosArrowDown onClick={toggleChildBranches} />
              ) : (
                <IoIosArrowForward onClick={toggleChildBranches} />
              ),
            [isOpen]
          )}
          {useMemo(() => (icon ? icon() : <FcFolder size='0.9rem' />), [])}
          <div
            ref={inputRef}
            suppressContentEditableWarning={true}
            className='branch-name-input'
            onKeyPress={handleKeyPress}
            onBlur={handleBlur}
            onInput={handleInputChange}
            style={{
              width: "fit-content",
              maxWidth: `calc(${width}px - ${depth * 0.5}rem - 28px - 0.65rem)`,
            }}
          >
            {branchName}
          </div>
        </div>
      </div>
      {useMemo(
        () =>
          isOpen &&
          folderContent
            .filter((fso) => fso.type === "DIRECTORY")
            .map((branch) => (
              <FolderNavigationBranch
                branchName={branch.name}
                depth={depth + 1}
                changePath={changePath}
                path={
                  branchName === "This PC" ? path : Path.join(path, branchName)
                }
                width={width}
              />
            )),
        [isOpen, folderContent]
      )}
    </>
  );
};

export default FolderNavigationBranch;
