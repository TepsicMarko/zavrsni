import "./Photos.css";
import Window from "../../system/window/Window";
import WindowContent from "../../system/window/window-content/WindowContent";
import { FileSystemContext } from "../../../contexts/FileSystemContext";
import { useState, useContext, useEffect, useRef } from "react";
import { HiOutlineZoomIn, HiOutlineZoomOut } from "react-icons/hi";
import { BsTrash } from "react-icons/bs";
import { GrRotateRight } from "react-icons/gr";

const Photos = ({ path }) => {
  const [src, setSrc] = useState("");
  const { readFileContent } = useContext(FileSystemContext);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const imageRef = useRef(null);

  const setImageSource = (source) => {
    setSrc(source);
  };

  useEffect(() => {
    path && readFileContent(path, setImageSource);
  }, [path]);

  useEffect(() => {
    const { clientWidth, clientHeight } = imageRef.current;
    console.log(clientWidth);
    setImageDimensions({ width: clientWidth, height: clientHeight });
  }, [src]);

  return (
    <Window
      app='Photos'
      minWindowWidth='31rem'
      minWindowHeight={imageDimensions.height + 80}
      titleBar={{ color: "#EFEFEF", backgroundColor: "#2B2B2B" }}
    >
      <WindowContent backgroundColor='#222222' flex flexDirection='column'>
        <div className='flex-center photos-toolbar'>
          <HiOutlineZoomIn />
          <HiOutlineZoomOut />
          <BsTrash />
          <GrRotateRight />
        </div>
        <div className='image-container'>
          <img ref={imageRef} src={src} />
        </div>
      </WindowContent>
    </Window>
  );
};

export default Photos;
