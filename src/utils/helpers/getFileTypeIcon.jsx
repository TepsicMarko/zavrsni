import { AiFillFileText } from 'react-icons/ai';
import mime from 'mime';
import imageFile from '../../assets/icons/file-icons/imageFile.ico';
import videoFile from '../../assets/icons/file-icons/videoFile.ico';
import unknownFile from '../../assets/icons/file-icons/unknownFile.ico';
import pdfFile from '../../assets/icons/file-icons/pdfFile.jpg';
import htmlFile from '../../assets/icons/app-icons/chrome.svg';
import zipFile from '../../assets/icons/file-icons/zipFile.ico';
import rtfFile from '../../assets/icons/file-icons/rtfFile.ico';

const fileTypeIcons = {
  text: <AiFillFileText size='100%' color='white' />,
  image: <img src={imageFile} />,
  video: <img src={videoFile} />,
  'application/pdf': <img src={pdfFile} />,
  'application/zip': <img src={zipFile} />,
  'application/rtf': <img src={rtfFile} />,
  'text/html': <img src={htmlFile} />,
};

const getFileTypeIcon = (name) => {
  const mimeType = mime.lookup(name);
  console.log(mimeType, mimeType.split('/')[0]);
  return (
    fileTypeIcons[mimeType] ||
    fileTypeIcons[mimeType.split('/')[0]] || <img src={unknownFile} />
  );
};

export default getFileTypeIcon;
