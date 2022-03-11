import './FileExplorerStatusBar.css';
import { useState, memo, useEffect, useContext, useRef } from 'react';
import { FileSystemContext } from '../../../../contexts/FileSystemContext';
import { path as Path } from 'filer';

const FileExplorerStatusBar = ({
  path,
  itemCount,
  mode,
  handleSave,
  parentProcess,
  openFile,
  endParrentProcess,
  pid,
  ppid,
  selectedFile,
  setSearchResults,
  endProcess,
  startChildProcess,
}) => {
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('.txt');
  const [encoding, setEncoding] = useState('Auto-Detect');
  const { getFolder, exists } = useContext(FileSystemContext);
  const inputRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inputRef.current.value) {
      inputRef.current.focus();
    } else {
      try {
        await exists(Path.join(path, fileName + fileType));

        alert('File already exists');
        inputRef.current.focus();
        inputRef.current.select();
      } catch {
        endParrentProcess
          ? endProcess(parentProcess, ppid)
          : endProcess('File Explorer', pid, parentProcess, ppid);
        handleSave(path, fileName, fileType, startChildProcess, endProcess);
      }
    }
  };

  const closeWindow = (e) => {
    e.stopPropagation();
    endProcess('File Explorer', pid, parentProcess, ppid);
  };

  const handleChange = (e) => {
    if (e.target.name === 'name') {
      setFileName(e.target.value);
    }
    if (e.target.name === 'type') {
      setFileType(e.target.value);
    }
    if (e.target.name === 'encoding') {
      setEncoding(e.target.value);
    }
  };

  const loadFile = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inputRef.current.value) {
      inputRef.current.focus();
    } else {
      try {
        await exists(Path.join(path, fileName + fileType));

        endProcess('File Explorer', pid, parentProcess, ppid);
        openFile(path, fileName, fileType);
      } catch (e) {
        startChildProcess('File Explorer', pid, 'Warning Dialog', {
          icon: <div></div>,
          title: 'Open',
          warning: (
            <div>
              {fileName} <br /> File not found. <br /> Check the file name and try again.
            </div>
          ),
          ppid: pid,
        });
        inputRef.current.focus();
        inputRef.current.select();
      }
    }
  };

  const stopPropagation = (e) => e.stopPropagation();

  useEffect(async () => {
    if (mode !== 'v') {
      const folderContent = await getFolder(path);

      setSearchResults(
        folderContent.filter(
          (fso) => fso.type === 'DIRECTORY' || fso.name.endsWith(fileType)
        )
      );
    }
  }, [fileType, path]);

  useEffect(() => {
    setFileName(selectedFile);
  }, [selectedFile]);

  return (
    <>
      {mode === 'v' && <div className='item-count'>{itemCount}</div>}
      {mode === 'w' && (
        <form className='new-file-form' onSubmit={handleSubmit}>
          <label>
            <span>File name:</span>
            <input
              ref={inputRef}
              type='text'
              name='name'
              value={fileName}
              onChange={handleChange}
            />
          </label>
          <label>
            <span>Save as type:</span>
            <select name='type' value={fileType} onChange={handleChange}>
              <option value='.txt'>Text Document (*.txt)</option>
              <option value=''>All Files</option>
            </select>
          </label>
          <div className='encoding'>
            <label>
              <span>Encoding:</span>
              <select name='encoding' value={encoding} onChange={handleChange}>
                <option value='UTF-8'>UTF-8</option>
              </select>
            </label>
          </div>
          <div className='save-or-cancel'>
            <button onClick={stopPropagation}>Save</button>
            <button onClick={closeWindow}>Cancel</button>
          </div>
        </form>
      )}
      {mode === 'r' && (
        <form className='open-file-form' onSubmit={loadFile}>
          <div className='file-name-and-encoding'>
            <label>
              <span>File name:</span>
              <input
                ref={inputRef}
                type='text'
                name='name'
                value={fileName}
                onChange={handleChange}
              />
            </label>
            <label>
              <span>Encoding:</span>
              <select name='encoding' value={encoding} onChange={handleChange}>
                <option value='Auto-Detec'>Auto-Detect</option>
              </select>
            </label>
          </div>
          <div className='file-type-and-save-or-cancel'>
            <label>
              <select name='type' value={fileType} onChange={handleChange}>
                <option value='.txt'>Text Document (*.txt)</option>
                <option value=''>All Files</option>
              </select>
            </label>
            <div className='open-or-cancel'>
              <button onclick={stopPropagation}>Open</button>
              <button onClick={closeWindow}>Cancel</button>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default memo(FileExplorerStatusBar);
