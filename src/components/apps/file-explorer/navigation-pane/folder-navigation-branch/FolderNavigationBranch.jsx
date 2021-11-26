import "./FolderNavigationBranch.css";
import { useState, useEffect } from "react";
import useToggle from "../../../../../hooks/useToggle";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { FcFolder } from "react-icons/fc";

const FolderNavigationBranch = ({ branchName, childFolders, icon, depth }) => {
  const [isOpen, toggleOpen] = useToggle();
  const [childBranches, setChildBranches] = useState([]);

  const toggle = (e) => {
    e.stopPropagation();
    toggleOpen();
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
        onClick={toggle}
        style={{ paddingLeft: depth * 0.5 * 16 }}
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
          />
        ))}
    </>
  );
};

export default FolderNavigationBranch;
