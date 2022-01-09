import "./Photos.css";
import Window from "../../system/window/Window";
import WindowContent from "../../system/window/window-content/WindowContent";
import { FileSystemContext } from "../../../contexts/FileSystemContext";
import { ProcessesContext } from "../../../contexts/ProcessesContext";
import { useState, useContext, useEffect, useRef, useMemo } from "react";
import { HiOutlineZoomIn, HiOutlineZoomOut } from "react-icons/hi";
import { BsTrash } from "react-icons/bs";
import { GrRotateRight } from "react-icons/gr";

const Photos = ({ path }) => {
  const [src, setSrc] = useState("");
  // const [zoom, setZoom] = useState(100);
  // const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  // const [aspectRatio, setAspectRatio] = useState(0);
  const [rotation, setRotation] = useState(0);
  const { readFileContent, deleteFSO } = useContext(FileSystemContext);
  const { endProcess } = useContext(ProcessesContext);
  const imageRef = useRef(null);

  const setImageSource = (source) => {
    setSrc(source);
  };

  // const zoomIn = () => {
  //   setZoom(
  //     zoom +
  //       (zoom === 0
  //         ? 1
  //         : parseInt(
  //             `${zoom}`.length < 3 ? `${zoom}`[0] : `${zoom}`.slice(0, -1)
  //           ))
  //   );
  // };

  // const zoomOut = () => {
  //   setZoom(
  //     zoom -
  //       (zoom === 0
  //         ? 1
  //         : parseInt(
  //             `${zoom}`.length < 3 ? `${zoom}`[0] : `${zoom}`.slice(0, -1)
  //           ))
  //   );
  // };

  const deleteImage = () => {
    deleteFSO(path, "");
    endProcess("Photos");
  };

  const rotate = () => {
    setRotation(rotation + 90 !== 360 ? rotation + 90 : 0);
  };

  useEffect(() => {
    path && readFileContent(path, setImageSource);
  }, [path]);

  useEffect(() => {
    console.log("rotation changed");
    // imageRef.current.style.transform = `rotate(${rotation}deg)`;
  }, [rotation]);

  // useEffect(() => {
  //   setAspectRatio(imageRef.current.width / imageRef.current.height);
  //   setDimensions({
  //     width: imageRef.current.width,
  //     height: imageRef.current.height,
  //   });
  // }, [src]);

  return (
    <Window
      app='Photos'
      minWindowWidth='31rem'
      minWindowHeight='20rem'
      titleBar={{ color: "#EFEFEF", backgroundColor: "#2B2B2B" }}
    >
      <WindowContent backgroundColor='#222222' flex flexDirection='column'>
        <div className='flex-center photos-toolbar'>
          <HiOutlineZoomIn
          // onClick={zoomIn}
          />
          <HiOutlineZoomOut
          // onClick={zoomOut}
          />
          <BsTrash onClick={deleteImage} />
          <GrRotateRight onClick={rotate} />
        </div>
        <div className='image-container'>
          <img
            ref={imageRef}
            src={src}
            // style={{
            //   width:
            //     dimensions.width > 0 ? dimensions.width * (zoom / 100) : "",
            //   height:
            //     dimensions.height > 0 ? dimensions.height * (zoom / 100) : "",
            //   maxWidth:
            //     dimensions.width > 0 ? dimensions.width * (zoom / 100) * 6 : "",
            //   maxHeight:
            //     dimensions.height > 0
            //       ? dimensions.height * (zoom / 100) * 6
            //       : "",
            // }}
          />
        </div>
      </WindowContent>
    </Window>
  );
};

export default Photos;
