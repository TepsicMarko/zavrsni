import './Notepad.css';
import Window from '../../system/window/Window';
import WindowContent from '../../system/window/window-content/WindowContent';
import StatusBar from '../../system/window/status-bar/StatusBar';
import NotepadNavbar from './navbar/NotepadNavbar';
import { useState, memo, useEffect, useContext, useRef } from 'react';
import { FileSystemContext } from '../../../contexts/FileSystemContext';
import { ProcessesContext } from '../../../contexts/ProcessesContext';
import { nanoid } from 'nanoid';
import { path as Path } from 'filer';

const Notepad = ({ icon, path = '', pid }) => {
  const [filePath, setFilePath] = useState(path);
  const [text, setText] = useState({ content: '', lines: 1 });
  const [wordWrap, setWordWrap] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [dialogID] = useState(nanoid());
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

  const createFile = (createPath, name) => {
    createFSO(createPath, name, 'txt', text.content);
    setFilePath(Path.join(createPath, name));
  };

  const handleSave = (callback) => {
    if (!filePath) {
      endProcess('Unsaved Changes Dialog', pid, 'Notepad');
      startChildProcess('Notepad', pid, 'File Explorer', {
        customPath: '/C/users/admin/Documents',
        mode: 'w',
        parentProcess: 'Notepad',
        endProcess,
        endParrentProcess: !callback ? true : false,
        createFile: callback
          ? (createPath, name) => {
              createFile(createPath, name);
              callback();
            }
          : createFile,
        minWidth: '31rem',
        minHeight: '17rem',
        ppid: pid,
      });
    } else {
      saveFile(filePath.replace(/\.[^/.]+$/, ''), Path.extname(filePath), text.content);
      endProcess('Unsaved Changes Dialog', pid, 'Notepad');
      callback ? callback() : endProcess('Notepad', pid);
    }
  };

  const handleDontSave = (callback) => {
    endProcess('Unsaved Changes Dialog', pid, 'Notepad');
    callback ? callback() : endProcess('Notepad', pid);
  };

  const handleCancel = () => {
    endProcess('Unsaved Changes Dialog', pid, 'Notepad');
  };

  const openUnsavedChangesDialog = (callback) =>
    startChildProcess('Notepad', pid, 'Unsaved Changes Dialog', {
      icon,
      handleSave: () => handleSave(callback),
      handleDontSave: () => handleDontSave(callback),
      handleCancel,
      filePath,
      ppid: pid,
      parentProcess: 'Notepad',
    });

  const isContentSame = (fileContent) => {
    if (fileContent === text.content) {
      endProcess('Notepad', pid);
    } else {
      openUnsavedChangesDialog();
    }
  };

  const onClose = () => {
    if (!filePath) {
      text.content.length ? openUnsavedChangesDialog() : endProcess('Notepad', pid);
    } else {
      readFileContent(filePath, isContentSame);
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
        />
        <div
          className='notepad-text-content-container'
          onClick={focusTextContent}
          style={{
            overflowX: wordWrap ? 'initial' : '',
            paddingBottom: wordWrap ? '1rem' : '',
          }}
        >
          <div
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
          ></div>
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
