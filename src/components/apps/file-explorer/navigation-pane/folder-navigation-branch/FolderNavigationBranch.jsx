import "./FolderNavigationBranch.css";
import { useState, useEffect } from "react";
import useToggle from "../../../../../hooks/useToggle";

const FolderNavigationBranch = ({ branchName, childFolders, depth }) => {
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
  }, []);

  return (
    <div
      className='folder-navigation-branch'
      onClick={toggle}
      style={{ zIndex: depth }}
    >
      {branchName}
      <div className='child-branches'>
        {isOpen &&
          childBranches.map((branch) => (
            <FolderNavigationBranch
              branchName={branch}
              childFolders={childFolders[branch]}
              depth={depth + 1}
            />
          ))}
      </div>
    </div>
  );
};

export default FolderNavigationBranch;
