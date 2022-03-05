import './FileExplorerNavigationPane.css';
import { RiComputerFill } from 'react-icons/ri';
import FolderNavigationBranch from './folder-navigation-branch/FolderNavigationBranch';
import { useState, useRef } from 'react';
import remToPx from '../../../../utils/helpers/remToPx';

const FileExplorerNavigationPane = ({
  changePath,
  basePath,
  currentPath,
  expandBranches,
  setExpandBranches,
}) => {
  const [width, setWidth] = useState(160);
  const [minWidth] = useState(remToPx('5rem'));
  const positionRef = useRef({});

  const handleDragStart = (e) => {
    e.stopPropagation();
    e.dataTransfer.setDragImage(new Image(), 0, 0);
    const { clientX: x } = e;
    positionRef.current = { x: e.target.parentElement.clientWidth - x };
  };
  const handleDrag = (e) => {
    e.stopPropagation();
    const { x } = positionRef.current;
    const { clientX } = e;
    const newWidth = x + clientX;
    setWidth(newWidth <= minWidth ? minWidth : newWidth);
  };

  return (
    <div className='fx-navigation-pane' style={{ width }}>
      <div className='folder-navigation-tree'>
        <FolderNavigationBranch
          branchName='This PC'
          icon={RiComputerFill}
          depth={1}
          basePath={basePath}
          currentPath={currentPath}
          changePath={changePath}
          expandBranches={expandBranches}
          setExpandBranches={setExpandBranches}
          open
        />
      </div>
      <div
        className='resize-navigation-pane'
        draggable
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDrag}
      ></div>
    </div>
  );
};

export default FileExplorerNavigationPane;
