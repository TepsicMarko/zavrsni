import './Notepad.css';
import Window from '../../system/window/Window';
import WindowContent from '../../system/window/window-content/WindowContent';
import StatusBar from '../../system/window/status-bar/StatusBar';
import NotepadNavbar from './navbar/NotepadNavbar';
import { useState, memo, useEffect, useContext, useRef } from 'react';
import { FileSystemContext } from '../../../contexts/FileSystemContext';
import { ProcessesContext } from '../../../contexts/ProcessesContext';
import { path as Path } from 'filer';

const Notepad = ({ icon, path = '', pid, addToGrid }) => {
  const [filePath, setFilePath] = useState(path);
  const [text, setText] = useState({ content: '', lines: 1 });
  const [wordWrap, setWordWrap] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [statusBarVisible, setStatusBarVisibility] = useState(true);
  const { readFileContent, createFSO, saveFile } = useContext(FileSystemContext);
  const { startChildProcess, endProcess } = useContext(ProcessesContext);
  const divRef = useRef(null);

  const handleChange = (e) => {
    setText({
      content: e.target.innerHTML,
      lines: (e.target.innerHTML.match(/<div>/g) || '').length + 1,
      chars: e.target.textContent.length,
    });
  };

  const focusTextContent = (e) => {
    e.target.firstChild.focus();
  };

  const stopPropagation = (e) => e.stopPropagation();
  const setTextContent = (content) => {
    const textInfo = document.createElement('div');
    textInfo.innerHTML = content;
    setText({
      content,
      lines: (`${content}`.match(/<div>/g) || '').length + 1,
      chars: textInfo.textContent.length,
    });
    divRef.current.innerHTML = content;
    textInfo.remove();
  };

  const createFile = (createPath, name, type) => {
    createFSO(createPath, name, type, text.content);
    setFilePath(Path.join(createPath, name + type));
    if (createPath === '/C/users/admin/Desktop')
      addToGrid([name + type, undefined], { row: 1, column: 1 });
  };

  const handleSave = (callback, endParrentProcess = true) => {
    if (!filePath) {
      startChildProcess('Notepad', pid, 'File Explorer', {
        customPath: '/C/users/admin/Documents',
        mode: 'w',
        parentProcess: 'Notepad',
        endParrentProcess,
        handleSave: callback
          ? (createPath, name, type, startChildProcess, endProcess) => {
              createFile(createPath, name, type);
              callback(startChildProcess, endProcess);
            }
          : createFile,
        minWidth: '31rem',
        minHeight: '17rem',
        ppid: pid,
      });
    }

    if (filePath) {
      saveFile(filePath.replace(/\.[^/.]+$/, ''), Path.extname(filePath), text.content);
      callback ? callback(startChildProcess) : endProcess('Notepad', pid);
    }
  };

  const openUnsavedChangesDialog = ({
    openFileSelection,
    resetNotepad,
    endParrentProcess,
  }) =>
    startChildProcess('Notepad', pid, 'Unsaved Changes Dialog', {
      icon,
      save: () => handleSave(openFileSelection || resetNotepad, endParrentProcess),
      dontSave: () =>
        openFileSelection
          ? openFileSelection(startChildProcess)
          : endProcess('Notepad', pid),
      filePath,
      ppid: pid,
      parentProcess: 'Notepad',
    });

  const onClose = async () => {
    if (!filePath) {
      text.content.length ? openUnsavedChangesDialog({}) : endProcess('Notepad', pid);
    } else {
      const fileContent = await readFileContent(filePath);
      fileContent === text.content
        ? endProcess('Notepad', pid)
        : openUnsavedChangesDialog({});
    }
  };

  const resetNotepad = () => {
    setFilePath('');
    setText({ content: '', lines: 1, chars: 0 });
    divRef.current.innerHTML = '';
  };

  useEffect(() => {
    filePath.length && readFileContent(filePath, setTextContent);
  }, [filePath]);

  return (
    <Window
      process='Notepad'
      pid={pid}
      icon={icon}
      minWindowWidth='9rem'
      minWindowHeight='8.2rem'
      titleBar={{
        color: 'black',
        backgroundColor: 'white',
        title: filePath ? Path.basename(filePath) + ' - Notepad' : '*Untilted - Notepad',
      }}
      onClose={onClose}
    >
      <WindowContent backgroundColor='white' flex flexDirection='column' flexWrap='wrap'>
        <NotepadNavbar
          textContent={text.content}
          filePath={filePath}
          setFilePath={setFilePath}
          divRef={divRef}
          setWordWrap={setWordWrap}
          wordWrap={wordWrap}
          statusBarVisible={statusBarVisible}
          setStatusBarVisibility={setStatusBarVisibility}
          zoom={zoom}
          setZoom={setZoom}
          openUnsavedChangesDialog={openUnsavedChangesDialog}
          resetNotepad={resetNotepad}
          pid={pid}
          addToGrid={addToGrid}
        />
        <div
          className='notepad-text-content-container'
          onClick={focusTextContent}
          style={{
            overflowX: wordWrap ? 'initial' : '',
            paddingBottom: wordWrap ? '1rem' : '',
          }}
        >
          <pre
            ref={divRef}
            className='notepad-text-content'
            contentEditable
            suppressContentEditableWarning
            onInput={handleChange}
            onClick={stopPropagation}
            style={{
              maxWidth: wordWrap ? 'calc(100% - 4px)' : '',
              fontSize: `${zoom}%`,
            }}
          ></pre>
        </div>
      </WindowContent>
      {statusBarVisible && (
        <StatusBar
          backgroundColor='#f1f1f1'
          color='black'
          flex
          borderColor='#DBDBDB'
          borderStyle='solid'
          borderWidth='1px 0 0 0'
          fontWeight='400'
          position='relative'
        >
          <div className='line-count'>Ln {text.lines}, </div>
          <div className='word-count'>Col {text.chars}</div>
          <div className='font-size'>{zoom}%</div>
          <div className='clrf'>Windows(CRLF)</div>
          <div className='file-format'>UTF-8</div>
        </StatusBar>
      )}
    </Window>
  );
};

export default memo(Notepad);
