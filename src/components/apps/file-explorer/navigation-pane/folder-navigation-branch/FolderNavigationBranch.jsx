import "./FolderNavigationBranch.css";
import { useState, useEffect } from "react";
import useToggle from "../../../../../hooks/useToggle";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { FcFolder } from "react-icons/fc";
import useWatchFolder from "../../../../../hooks/useWatchFolder";
import { path as Path } from "filer";

const FolderNavigationBranch = ({
  branchName,
  icon,
  depth,
  open,
  changePath,
  path,
}) => {
  const [isOpen, toggleOpen] = useToggle(open);
  const [folderContent] = useWatchFolder(
    Path.join(path, branchName === "This PC" ? "" : branchName)
  );

  const handleClick = (e) => {
    e.stopPropagation();
    changePath(Path.join(path, branchName === "This PC" ? "" : branchName));
  };

  const toggleChildBranches = (e) => {
    e.stopPropagation();
    toggleOpen();
  };

  return (
    <>
      <div
        className='folder-navigation-branch'
        style={{ paddingLeft: depth * 0.5 * 16 }}
        onClick={handleClick}
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
      {folderContent.map((branch) => console.log(branch))}
      {isOpen &&
        folderContent.map((branch) => (
          <FolderNavigationBranch
            branchName={branch.name}
            depth={depth + 1}
            changePath={changePath}
            path={branchName === "This PC" ? path : Path.join(path, branchName)}
          />
        ))}
    </>
  );
};

export default FolderNavigationBranch;
