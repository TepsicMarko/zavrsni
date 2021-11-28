import "./FolderNavigationBranch.css";
import { useContext } from "react";
import useToggle from "../../../../../hooks/useToggle";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { FcFolder } from "react-icons/fc";
import useWatchFolder from "../../../../../hooks/useWatchFolder";
import { path as Path } from "filer";
import { RightClickMenuContext } from "../../../../../contexts/RightClickMenuContext";
import NavigationPaneBranchContextMenu from "../../../../system/component-specific-context-menus/NavigationPaneBranchContextMenu";
import { FileSystemContext } from "../../../../../contexts/FileSystemContext";

const FolderNavigationBranch = ({
  branchName,
  icon,
  depth,
  open,
  changePath,
  path,
}) => {
  const { watch, getFolder, createFSO, deleteFSO } =
    useContext(FileSystemContext);
  const [isOpen, toggleOpen] = useToggle(open);
  const [folderContent] = useWatchFolder(
    Path.join(path, branchName === "This PC" ? "" : branchName),
    watch,
    getFolder
  );
  const { renderOptions, closeMenu } = useContext(RightClickMenuContext);

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
          {isOpen ? (
            <IoIosArrowDown onClick={toggleChildBranches} />
          ) : (
            <IoIosArrowForward onClick={toggleChildBranches} />
          )}
          {icon ? icon() : <FcFolder />}
          {branchName}
        </div>
      </div>
      {isOpen &&
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
            />
          ))}
    </>
  );
};

export default FolderNavigationBranch;
