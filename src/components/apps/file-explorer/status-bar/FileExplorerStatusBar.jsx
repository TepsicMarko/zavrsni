import './FileExplorerStatusBar.css';
import { useState, memo, useEffect, useContext } from 'react';
import { FileSystemContext } from '../../../../contexts/FileSystemContext';

const FileExplorerStatusBar = ({
  path,
  itemCount,
  mode,
  handleSave,
  endProcess,
  parentProcess,
  openFile,
  endParrentProcess,
  ppid,
  selectedFile,
  setSearchResults,
}) => {
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('.txt');
  const [encoding, setEncoding] = useState('Auto-Detec');
  const { getFolder } = useContext(FileSystemContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave(path, fileName, fileType);
    endProcess('File Explorer', ppid, parentProcess);
    endParrentProcess && endProcess('Notepad', ppid);
  };

  const closeWindow = () => endProcess('File Explorer', ppid, parentProcess);

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

  const loadFile = (e) => {
    e.preventDefault();
    openFile(path, fileName, fileType);
    endProcess('File Explorer', ppid, parentProcess);
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
            <input type='text' name='name' value={fileName} onChange={handleChange} />
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
            <button>Save</button>
            <button onClick={closeWindow}>Cancel</button>
          </div>
        </form>
      )}
      {mode === 'r' && (
        <form className='open-file-form' onSubmit={loadFile}>
          <div className='file-name-and-encoding'>
            <label>
              <span>File name:</span>
              <input type='text' name='name' value={fileName} onChange={handleChange} />
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
