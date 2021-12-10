import "./FolderNavigationBranch.css";
import { useContext, useMemo } from "react";
import useToggle from "../../../../../hooks/useToggle";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { FcFolder } from "react-icons/fc";
import useWatchFolder from "../../../../../hooks/useWatchFolder";
import { path as Path } from "filer";
import { RightClickMenuContext } from "../../../../../contexts/RightClickMenuContext";
import NavigationPaneBranchContextMenu from "../../../../system/component-specific-context-menus/NavigationPaneBranchContextMenu";
import { FileSystemContext } from "../../../../../contexts/FileSystemContext";
import useInput from "../../../../../hooks/useInput";

const FolderNavigationBranch = ({
  branchName,
  icon,
  depth,
  open,
  changePath,
  path,
  width,
}) => {
  const { watch, getFolder, createFSO, deleteFSO } =
    useContext(FileSystemContext);
  const [isOpen, toggleOpen] = useToggle(open);
  const [folderContent] = useWatchFolder(
    Path.join(path, branchName === "This PC" ? "" : branchName),
    watch,
    getFolder
  );
  const { renderOptions } = useContext(RightClickMenuContext);
  const [inputValue, handleInputChange] = useInput(branchName);

  const handleClick = (e) => {
    e.stopPropagation();
    changePath(Path.join(path, branchName === "This PC" ? "" : branchName));
  };

  const toggleChildBranches = (e) => {
    e.stopPropagation();
    toggleOpen();
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
      />
    );
  };

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
            contentEditable
            suppressContentEditableWarning={true}
            className='branch-name-input'
            onClick={(e) => e.preventDefault()}
            style={{
              width: "fit-content",
              maxWidth: `calc(${width}px - ${depth * 0.5}rem - 28px - 0.65rem)`,
            }}
          >
            {inputValue}
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
