import "./Photos.css";
import Window from "../../system/window/Window";
import WindowContent from "../../system/window/window-content/WindowContent";
import { FileSystemContext } from "../../../contexts/FileSystemContext";
import { ProcessesContext } from "../../../contexts/ProcessesContext";
import { useState, useContext, useEffect, useRef } from "react";
import { HiOutlineZoomIn, HiOutlineZoomOut } from "react-icons/hi";
import { BsTrash } from "react-icons/bs";
import { AiOutlineExpandAlt } from "react-icons/ai";
import Panzoom from "@panzoom/panzoom";
import useToggle from "../../../hooks/useToggle";
import useFullScreenToggle from "../../../hooks/useFullScreenToggle";

const Photos = ({ path, pid }) => {
  const imageContainerRef = useRef(null);
  const [src, setSrc] = useState("");
  const [zoom, setZoom] = useState(100);
  const [panzoom, setPanzoom] = useState();
  const [isFullScreen, toggleFullScreen] = useFullScreenToggle();
  const { readFileContent, deleteFSO } = useContext(FileSystemContext);
  const { endProcess } = useContext(ProcessesContext);

  const setImageSource = (source) => {
    setSrc(source);
  };

  const zoomIn = () => {
    setZoom(
      zoom + parseFloat(`${zoom}`.slice(0, `${parseInt(zoom)}`.length - 1)) <
        6000
        ? zoom + parseFloat(`${zoom}`.slice(0, `${parseInt(zoom)}`.length - 1))
        : zoom
    );
  };

  const zoomOut = () => {
    setZoom(
      zoom - parseFloat(`${zoom}`.slice(0, `${parseInt(zoom)}`.length - 1)) >=
        100
        ? zoom - parseFloat(`${zoom}`.slice(0, `${parseInt(zoom)}`.length - 1))
        : 100
    );
  };

  const resetZoom = () => setZoom(100);

  const deleteImage = () => {
    deleteFSO(path, "");
    endProcess("Photos");
  };

  const handleMouseWhele = (e) => {
    panzoom.zoomWithWheel(e);
    setZoom(panzoom.getScale() * 100);
  };

  const togglePhotosFullSceen = () => {
    const Photos =
      document.getElementsByClassName("photos-toolbar")[0].parentElement;
    toggleFullScreen(Photos);
  };

  useEffect(() => {
    setPanzoom(
      Panzoom(imageContainerRef.current, {
        maxScale: 60,
        minScale: 1,
        cursor: "default",
        panOnlyWhenZoomed: true,
      })
    );

    const observer = new ResizeObserver(() => {
      resetZoom();
    });

    observer.observe(imageContainerRef.current.parentElement);
  }, []);

  useEffect(() => {
    path && readFileContent(path, setImageSource);
  }, [path]);

  useEffect(() => {
    if (panzoom) {
      panzoom.zoom(zoom / 100, { animate: true });
      if (zoom === 100) {
        panzoom.pan(0, 0, { force: true, animate: true });
      }
    }
  }, [zoom]);

  return (
    <Window
      process='Photos'
      pid={pid}
      minWindowWidth='31rem'
      minWindowHeight='20rem'
      titleBar={{ color: "#EFEFEF", backgroundColor: "#2B2B2B" }}
    >
      <WindowContent backgroundColor='#222222' flex flexDirection='column'>
        <div className='flex-center photos-toolbar'>
          <div className='flex-center'>
            <HiOutlineZoomIn
              onClick={zoomIn}
              size='1.2rem'
              color={zoom >= 5800 ? "gray" : ""}
            />
          </div>
          <div className='flex-center'>
            <HiOutlineZoomOut
              onClick={zoomOut}
              size='1.2rem'
              color={zoom === 100 ? "gray" : ""}
            />
          </div>
          <div className='flex-center'>
            <BsTrash onClick={deleteImage} size='1.2rem' />
          </div>
        </div>
        <div className='image-container' onWheel={handleMouseWhele}>
          <div ref={imageContainerRef} className='performance-wrapper'>
            <img id='test' src={src} />
          </div>
        </div>
        <div className='maximise-photos' onClick={togglePhotosFullSceen}>
          <AiOutlineExpandAlt size='2rem' color='white' />
        </div>
      </WindowContent>
    </Window>
  );
};

export default Photos;
