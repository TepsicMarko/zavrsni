import "./FolderNavigationBranch.css";
import { useContext, useMemo, useRef, useEffect, memo } from "react";
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
  basePath,
  currentPath,
  expandBranches,
  setExpandBranches,
}) => {
  const { watch, getFolder, createFSO, deleteFSO, renameFSO, moveFSO } =
    useContext(FileSystemContext);
  const [isOpen, toggleOpen, setToggleState] = useToggle(open);
  const [folderContent] = useWatchFolder(
    Path.join(basePath, branchName === "This PC" ? "" : branchName),
    watch,
    getFolder
  );
  const { renderOptions } = useContext(RightClickMenuContext);
  const [inputValue, handleInputChange] = useInput(branchName);
  const inputRef = useRef(null);

  const handleClick = (e) => {
    // e.stopPropagation();
    changePath(Path.join(basePath, branchName === "This PC" ? "" : branchName));
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

  const handleRightClick = (e) =>
    renderOptions(
      e,
      <NavigationPaneBranchContextMenu
        name={branchName}
        deletePath={basePath}
        createPath={Path.join(
          basePath,
          branchName === "This PC" ? "" : branchName
        )}
        isOpen={isOpen}
        toggleOpen={toggleOpen}
        deleteFSO={deleteFSO}
        createFSO={createFSO}
        focusInput={focusInput}
      />
    );

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      inputRef.current.blur();
    }
  };

  const handleBlur = (e) => {
    inputRef.current.setAttribute("contenteditable", "false");

    if (branchName !== inputValue && inputValue.length)
      renameFSO(basePath, { old: branchName, new: inputValue });
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData(
      "json",
      JSON.stringify({
        origin: "File Explorer",
        dragObject: {
          name: branchName === "This PC" ? "" : branchName,
          path: basePath,
        },
      })
    );
  };

  const preventDefault = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    const dataTransfer = JSON.parse(e.dataTransfer.getData("json"));
    const dragObject = dataTransfer.dragObject;
    console.log(dragObject, basePath);
    moveFSO(
      Path.join(dragObject.path, dragObject.name),
      Path.join(
        basePath,
        branchName === "This PC" ? "" : branchName,
        dragObject.name
      )
    );
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

  useEffect(() => {
    (currentPath === Path.join(basePath, branchName) ||
      currentPath.includes(Path.join(basePath, branchName))) &&
      expandBranches &&
      setToggleState(true);
    expandBranches && setExpandBranches(false);
  }, [currentPath]);

  useEffect(() => {
    (currentPath === Path.join(basePath, branchName) ||
      currentPath.includes(Path.join(basePath, branchName))) &&
      setToggleState(true);
  }, []);

  return (
    <>
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnter={preventDefault}
        onDragOver={preventDefault}
        onDrop={handleDrop}
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
              maxWidth: `calc(100% - ${depth * 0.5}rem)`,
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
                currentPath={currentPath}
                basePath={
                  branchName === "This PC"
                    ? basePath
                    : Path.join(basePath, branchName)
                }
                expandBranches={expandBranches}
                setExpandBranches={setExpandBranches}
              />
            )),
        [isOpen, folderContent, currentPath]
      )}
    </>
  );
};

export default memo(FolderNavigationBranch);
