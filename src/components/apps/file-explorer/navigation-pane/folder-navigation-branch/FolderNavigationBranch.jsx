import "./FolderNavigationBranch.css";
import { useState, useEffect } from "react";
import useToggle from "../../../../../hooks/useToggle";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { FcFolder } from "react-icons/fc";

const FolderNavigationBranch = ({
  branchName,
  childFolders,
  icon,
  depth,
  open,
  changePath,
  path,
}) => {
  const [isOpen, toggleOpen] = useToggle(open);
  const [childBranches, setChildBranches] = useState([]);

  const handleClick = (e) => {
    e.stopPropagation();
    toggleOpen();
    changePath(path, branchName);
  };

  useEffect(() => {
    let branches = [];
    for (let folder in childFolders) {
      branches.push(folder);
    }
    setChildBranches(branches);
  }, [childFolders]);

  return (
    <>
      <div
        className='folder-navigation-branch'
        style={{ paddingLeft: depth * 0.5 * 16 }}
        onClick={handleClick}
      >
        <div className='branch-name'>
          {isOpen ? <IoIosArrowDown /> : <IoIosArrowForward />}
          {icon ? icon() : <FcFolder />}
          {branchName}
        </div>
      </div>
      {isOpen &&
        childBranches.map((branch) => (
          <FolderNavigationBranch
            branchName={branch}
            childFolders={childFolders[branch]}
            depth={depth + 1}
            changePath={changePath}
            path={
              branchName === "This PC"
                ? `${path}\\admin`
                : `${path}\\${branchName}`
            }
          />
        ))}
    </>
  );
};

export default FolderNavigationBranch;
