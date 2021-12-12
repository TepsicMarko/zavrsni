import { FcFolder } from "react-icons/fc";
import { AiFillFileText } from "react-icons/ai";

const fileTypeIcons = {
  file: <AiFillFileText size='0.9rem' />,
  directory: <FcFolder size='0.9rem' />,
};

const getFileTypeIcon = (fileType) => {
  return fileTypeIcons[fileType.toLowerCase()];
};

export default getFileTypeIcon;
