import { FcFolder } from "react-icons/fc";
import { AiFillFileText } from "react-icons/ai";
import { BsFillFileEarmarkImageFill } from "react-icons/bs";

const fileTypeIcons = {
  text: <AiFillFileText size='0.9rem' />,
  directory: <FcFolder size='0.9rem' />,
  image: <BsFillFileEarmarkImageFill size='0.9rem' />,
};

const getFileTypeIcon = (fileType) => {
  return fileTypeIcons[fileType.toLowerCase()];
};

export default getFileTypeIcon;
