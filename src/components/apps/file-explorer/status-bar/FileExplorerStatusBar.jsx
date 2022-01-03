import { useState, memo } from "react";

const FileExplorerStatusBar = ({
  path,
  itemCount,
  mode,
  createFile,
  endProcess,
  parentProcess,
}) => {
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("Text Document (*.txt)");
  const [encoding, setEncoding] = useState("UTF-8");

  const handleSubmit = (e) => {
    e.preventDefault();
    createFile(path, fileName);
    endProcess("File Explorer", parentProcess);
  };

  const closeWindow = () => endProcess("File Explorer", parentProcess);

  const handleChange = (e) => {
    if (e.target.name === "name") {
      setFileName(e.target.value);
    }
    if (e.target.name === "type") {
      setFileType(e.target.value);
    }
    if (e.target.name === "encoding") {
      setEncoding(e.target.value);
    }
  };

  return (
    <>
      {mode === "v" && <div className='item-count'>{itemCount}</div>}
      {mode === "w" && (
        <form className='new-file-form' onSubmit={handleSubmit}>
          <label>
            <span>File name:</span>
            <input
              type='text'
              name='name'
              value={fileName}
              onChange={handleChange}
            />
          </label>
          <label>
            <span>Save as type:</span>
            <select name='type' value={fileType} onChange={handleChange}>
              <option value='Text Document (*.txt)'>
                Text Document (*.txt)
              </option>
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
    </>
  );
};

export default memo(FileExplorerStatusBar);
