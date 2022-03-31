import './FileExplorer.css';
import Window from '../../system/window/Window';
import StatusBar from '../../system/window/status-bar/StatusBar';
import FileExplorerNavbar from './navbar/FileExplorerNavbar';
import FileExplorerRibbon from './ribbon/FileExplorerRibbon';
import { useState, useCallback, useContext } from 'react';
import FileExplorerNavigationBar from './navigation-bar/FileExplorerNavigationBar';
import FileExplorerNavigationPane from './navigation-pane/FileExplorerNavigationPane';
import FileExplorerFolderContents from './folder-contents/FileExplorerFolderContents';
import FileExplorerStatusBar from './status-bar/FileExplorerStatusBar';
import { ProcessesContext } from '../../../contexts/ProcessesContext';

const FileExplorer = ({
  pid,
  icon,
  customPath,
  mode = 'v',
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
  const [path, setPath] = useState(customPath || '/C/Users/Public');
  const [searchResults, setSearchResults] = useState([]);
  const [itemCount, setItemCount] = useState('');
  const [expandBranches, setExpandBranches] = useState(false);
  const [selectedFile, setSelectedFile] = useState('');
  const { startChildProcess, endProcess, processes } = useContext(ProcessesContext);

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
      parentProcess={parentProcess}
      pid={pid}
      ppid={ppid}
      icon={icon}
      minWindowWidth={minWidth || '26rem'}
      minWindowHeight={minHeight || '16rem'}
      titleBar={{ color: 'white', backgroundColor: 'black' }}
      limitedWindowControls={mode !== 'v'}
    >
      <div
        className='file-explorer-window-content'
        draggable
        onDragStart={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {mode === 'v' && (
          <>
            <FileExplorerNavbar activeTab={activeTab} changeTab={changeTab} />
            <FileExplorerRibbon activeTab={activeTab} />
          </>
        )}
        <FileExplorerNavigationBar
          pid={pid}
          path={path}
          setPath={changePath}
          changePath={changePath}
          setSearchResults={setSearchResults}
          setExpandBranches={setExpandBranches}
          startChildProcess={startChildProcess}
          mode={mode}
        />
        <div className='navigation-pane-and-folder-contents-container'>
          <FileExplorerNavigationPane
            changePath={changePath}
            basePath='/C/Users/Public'
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
            endProcess={mode !== 'v' ? endProcess : undefined}
            pid={pid}
            ppid={ppid}
            addToGrid={addToGrid}
            mode={mode}
            setSelectedFile={setSelectedFile}
            isFocused={processes['File Explorer'][pid].isFocused}
          />
        </div>
      </div>
      <StatusBar backgroundColor='#383838' color='#DEDEDE' flex height='fit-content'>
        <FileExplorerStatusBar
          path={path}
          itemCount={itemCount}
          mode={mode}
          handleSave={handleSave}
          endParrentProcess={endParrentProcess}
          parentProcess={parentProcess}
          openFile={openFile}
          pid={pid}
          ppid={ppid}
          selectedFile={selectedFile}
          setSearchResults={setSearchResults}
          endProcess={mode !== 'v' ? endProcess : undefined}
          startChildProcess={mode !== 'v' ? startChildProcess : undefined}
        />
      </StatusBar>
    </Window>
  );
};

export default FileExplorer;
