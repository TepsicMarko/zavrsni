import "./MoviesAndTv.css";
import { useState, useEffect, useContext, useRef } from "react";
import Window from "../../system/window/Window";
import WindowContent from "../../system/window/window-content/WindowContent";
import { FileSystemContext } from "../../../contexts/FileSystemContext";
import "rc-slider/assets/index.css";
import VideoControls from "./video-controls/VideoControls";
import { path as Path } from "filer";

const MoviesAndTv = ({ path, pid }) => {
  const videoRef = useRef(null);
  const [src, setSrc] = useState("");
  const { readBlob } = useContext(FileSystemContext);
  const [isMiniplayer, setIsMiniplayer] = useState(false);
  const [videoContorlsVisibility, setVideoContorlsVisibility] = useState(true);
  const lastVideoVisibilityChnage = useRef();

  const toggleMiniplayer = () => setIsMiniplayer(!isMiniplayer);

  const handleMouseMove = () =>
    Date.now() - lastVideoVisibilityChnage.current > 1000 &&
    setVideoContorlsVisibility(true);

  const handleClick = () =>
    setVideoContorlsVisibility(!videoContorlsVisibility);

  useEffect(() => {
    path && readBlob(path, (blobSrc) => setSrc(blobSrc));
  }, []);

  useEffect(() => {
    lastVideoVisibilityChnage.current = Date.now();
  }, [videoContorlsVisibility]);

  return (
    <Window
      process='Movies And TV'
      pid={pid}
      displayTitle={false}
      minWindowWidth='9rem'
      minWindowHeight='10rem'
      titleBar={{
        color: "white",
        backgroundColor: !isMiniplayer ? "black" : "transparent",
        overlay: true,
      }}
      limitedWindowControls={isMiniplayer}
      zIndex={isMiniplayer ? 1000 : null}
    >
      <WindowContent backgroundColor='black' flex flexDirection='column'>
        <div
          className='video-container'
          onMouseMove={handleMouseMove}
          onClick={handleClick}
        >
          <video className='video' src={src} ref={videoRef}></video>
          <VideoControls
            src={src}
            videoRef={videoRef}
            videoName={Path.basename(path, Path.extname(path))}
            isMiniplayer={isMiniplayer}
            toggleMiniplayer={toggleMiniplayer}
            videoContorlsVisibility={videoContorlsVisibility}
            setVideoContorlsVisibility={setVideoContorlsVisibility}
          />
          {videoContorlsVisibility && (
            <div
              className='controls-overlay'
              style={{
                background: isMiniplayer ? "rgba(0, 0, 0, 0.6)" : "",
                height: isMiniplayer ? "100%" : "",
              }}
            ></div>
          )}
        </div>
      </WindowContent>
    </Window>
  );
};

export default MoviesAndTv;
