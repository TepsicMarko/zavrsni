import { FcFolder } from "react-icons/fc";
import { AiFillFileText } from "react-icons/ai";
import {
  BsFillFileEarmarkImageFill,
  BsFillFileEarmarkPlayFill,
  BsFileEarmarkFill,
} from "react-icons/bs";

const fileTypeIcons = {
  text: <AiFillFileText size='0.9rem' />,
  directory: <FcFolder size='0.9rem' />,
  image: <BsFillFileEarmarkImageFill size='0.9rem' />,
  video: <BsFillFileEarmarkPlayFill size='0.9rem' />,
};

const getFileTypeIcon = (fileType) => {
  return fileType ? (
    fileTypeIcons[fileType.toLowerCase()]
  ) : (
    <BsFileEarmarkFill size='0.9rem' />
  );
};

export default getFileTypeIcon;
