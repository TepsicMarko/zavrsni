import "./MoviesAndTv.css";
import { useState, useEffect, useContext, useRef } from "react";
import Window from "../../system/window/Window";
import WindowContent from "../../system/window/window-content/WindowContent";
import { FileSystemContext } from "../../../contexts/FileSystemContext";
import "rc-slider/assets/index.css";
import VideoControls from "./video-controls/VideoControls";

const MoviesAndTv = ({ path }) => {
  const videoRef = useRef(null);
  const [src, setSrc] = useState("");
  const { readBlob } = useContext(FileSystemContext);
  const [isMiniplayer, setIsMiniplayer] = useState(false);

  const toggleMiniplayer = () => setIsMiniplayer(!isMiniplayer);

  useEffect(() => {
    path && readBlob(path, (blobSrc) => setSrc(blobSrc));
  }, []);

  return (
    <Window
      app='Movies And Tv'
      displayAppName={false}
      minWindowWidth='9rem'
      minWindowHeight='10rem'
      titleBar={{
        color: "white",
        backgroundColor: !isMiniplayer ? "black" : "transparent",
        overlay: true,
      }}
      parentProcess={isMiniplayer ? "Movies And Tv" : ""}
      zIndex={isMiniplayer ? 1000 : ""}
    >
      <WindowContent backgroundColor='black' flex flexDirection='column'>
        <div className='video-container'>
          <video className='video' src={src} ref={videoRef}></video>
          <VideoControls
            src={src}
            videoRef={videoRef}
            isMiniplayer={isMiniplayer}
            toggleMiniplayer={toggleMiniplayer}
          />
          <div
            className='controls-overlay'
            style={{
              background: isMiniplayer ? "rgba(0, 0, 0, 0.6)" : "",
              height: isMiniplayer ? "100%" : "",
            }}
          ></div>
        </div>
      </WindowContent>
    </Window>
  );
};

export default MoviesAndTv;
