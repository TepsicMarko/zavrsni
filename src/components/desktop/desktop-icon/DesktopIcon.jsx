import "./DesktopIcon.css";
import { FcFolder } from "react-icons/fc";
import { AiFillFileText } from "react-icons/ai";
import { useContext } from "react";
import { FileSystemContext } from "../../../contexts/FileSystemContext";
import useInput from "../../../hooks/useInput";

const DesktopIcon = ({ name, path, isFolder }) => {
  const [inputValue, handleInputChange] = useInput(name);
  const { updateFSO } = useContext(FileSystemContext);
  const handleClick = (e) => {
    e.target.select();
  };

  const handleBlur = () => {
    updateFSO({ old: name, new: inputValue }, path);
  };

  return (
    <div className='desktop-icon'>
      {isFolder ? (
        <FcFolder size='3rem' />
      ) : (
        <AiFillFileText size='3rem' color='white' />
      )}
      <input
        className='desktop-icon-name'
        type='text'
        value={inputValue}
        onChange={handleInputChange}
        onClick={handleClick}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default DesktopIcon;
