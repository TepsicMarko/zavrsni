import "./MoviesAndTv.css";
import { useState, useEffect, useContext, useRef } from "react";
import Window from "../../system/window/Window";
import WindowContent from "../../system/window/window-content/WindowContent";
import { FileSystemContext } from "../../../contexts/FileSystemContext";
import "rc-slider/assets/index.css";
import useVideoPlayer from "../../../hooks/useVideoPlayer";
import VideoControls from "./video-controls/VideoControls";

const MoviesAndTv = ({ path }) => {
  const videoRef = useRef(null);
  const [src, setSrc] = useState("");
  const { readBlob } = useContext(FileSystemContext);
  const [isMiniplayer, setIsMiniplayer] = useState(false);
  const {
    setVideo,
    isPlaying,
    togglePlay,
    volume,
    isMuted,
    toggleMuted,
    changeVolume,
    skipForwards,
    skipBackwards,
    duration,
    setDuration,
    fullscreenVideo,
  } = useVideoPlayer();

  const handleDurationLoaded = (e) => setDuration(e.target.duration);
  const toggleMiniplayer = () => setIsMiniplayer(!isMiniplayer);

  useEffect(() => {
    path && readBlob(path, (blobSrc) => setSrc(blobSrc));
  }, []);

  useEffect(() => {
    src && setVideo(videoRef.current);
  }, [src]);

  return (
    <Window
      app='Movies And Tv'
      displayAppName={false}
      minWindowWidth='9rem'
      minWindowHeight='10rem'
      titleBar={{ color: "white", backgroundColor: "black", overlay: true }}
    >
      <WindowContent backgroundColor='black' flex flexDirection='column'>
        <div className='video-container'>
          <video
            className='video'
            src={src}
            ref={videoRef}
            onDurationChange={handleDurationLoaded}
          ></video>
          <VideoControls
            videoRef={videoRef}
            duration={duration}
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            toggleMuted={toggleMuted}
            changeVolume={changeVolume}
            skipForwards={skipForwards}
            skipBackwards={skipBackwards}
            volume={volume}
            isMuted={isMuted}
            isMiniplayer={isMiniplayer}
            fullscreenVideo={fullscreenVideo}
            toggleMiniplayer={toggleMiniplayer}
          />
          <div className='controls-overlay'></div>
        </div>
      </WindowContent>
    </Window>
  );
};

export default MoviesAndTv;
