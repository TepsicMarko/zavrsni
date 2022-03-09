import './FileExplorer.css';
import Window from '../../system/window/Window';
import WindowContent from '../../system/window/window-content/WindowContent';
import StatusBar from '../../system/window/status-bar/StatusBar';
import FileExplorerNavbar from './navbar/FileExplorerNavbar';
import FileExplorerRibbon from './ribbon/FileExplorerRibbon';
import { useState, useCallback } from 'react';
import FileExplorerNavigationBar from './navigation-bar/FileExplorerNavigationBar';
import FileExplorerNavigationPane from './navigation-pane/FileExplorerNavigationPane';
import FileExplorerFolderContents from './folder-contents/FileExplorerFolderContents';
import FileExplorerStatusBar from './status-bar/FileExplorerStatusBar';

const FileExplorer = ({
  pid,
  icon,
  customPath,
  mode = 'v',
  endProcess,
  handleSave,
  parentProcess,
  minWidth,
  minHeight,
  openFile,
  endParrentProcess,
  ppid,
  addToGrid,
}) => {
  const [activeTab, setActiveTab] = useState('Home');
  const [path, setPath] = useState(customPath || '/C/users/admin');
  const [searchResults, setSearchResults] = useState([]);
  const [itemCount, setItemCount] = useState('');
  const [expandBranches, setExpandBranches] = useState(false);
  const [selectedFile, setSelectedFile] = useState('');

  const changeTab = (e) => setActiveTab(e.target.textContent);

  const changePath = useCallback(
    (path) => {
      setPath(path);
    },
    [path]
  );

  const resetSearch = () => {
    setSearchResults([]);
  };

  return (
    <Window
      process='File Explorer'
      pid={ppid || pid}
      icon={icon}
      minWindowWidth={minWidth || '14rem'}
      minWindowHeight={minHeight || '16rem'}
      titleBar={{ color: 'white', backgroundColor: 'black' }}
      parentProcess={parentProcess}
    >
      <WindowContent backgroundColor='#202020' flex flexDirection='row'>
        {mode === 'v' && (
          <>
            <FileExplorerNavbar activeTab={activeTab} changeTab={changeTab} />
            <FileExplorerRibbon activeTab={activeTab} />
          </>
        )}
        <FileExplorerNavigationBar
          path={path}
          setPath={changePath}
          changePath={changePath}
          setSearchResults={setSearchResults}
          setExpandBranches={setExpandBranches}
          mode={mode}
        />
        <div
          className='navigation-pane-and-folder-contents-container'
          style={{
            height: `calc(100%${
              mode === 'w' || mode === 'r' ? '' : ' - 1.25rem - 5.25rem'
            } - 2.25rem)`,
          }}
        >
          <FileExplorerNavigationPane
            changePath={changePath}
            basePath='/C/users/admin'
            currentPath={path}
            expandBranches={expandBranches}
            setExpandBranches={setExpandBranches}
            addToGrid={addToGrid}
            resetSearch={searchResults.length ? resetSearch : undefined}
          />
          <FileExplorerFolderContents
            changePath={changePath}
            path={path}
            searchResults={searchResults}
            setItemCount={setItemCount}
            setExpandBranches={setExpandBranches}
            openFile={openFile}
            endProcess={endProcess}
            ppid={ppid}
            addToGrid={addToGrid}
            mode={mode}
            setSelectedFile={setSelectedFile}
          />
        </div>
      </WindowContent>
      <StatusBar backgroundColor='#383838' color='#DEDEDE' flex height='fit-content'>
        <FileExplorerStatusBar
          path={path}
          itemCount={itemCount}
          mode={mode}
          handleSave={handleSave}
          endProcess={endProcess}
          endParrentProcess={endParrentProcess}
          parentProcess={parentProcess}
          openFile={openFile}
          ppid={ppid}
          selectedFile={selectedFile}
          setSearchResults={setSearchResults}
        />
      </StatusBar>
    </Window>
  );
};

export default FileExplorer;
