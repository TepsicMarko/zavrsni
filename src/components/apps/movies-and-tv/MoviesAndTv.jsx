import "./MoviesAndTv.css";
import { useState, useEffect, useContext, useRef } from "react";
import Window from "../../system/window/Window";
import WindowContent from "../../system/window/window-content/WindowContent";
import { FileSystemContext } from "../../../contexts/FileSystemContext";
import { BsVolumeUp } from "react-icons/bs";
import {
  MdOutlineForward30,
  MdReplay10,
  MdOutlineSubtitles,
} from "react-icons/md";
import { FiPlay } from "react-icons/fi";
import { AiOutlinePause } from "react-icons/ai";
import { CgMiniPlayer, CgPushUp } from "react-icons/cg";
import { AiOutlineExpandAlt } from "react-icons/ai";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import useVideoPlayer from "../../../hooks/useVideoPlayer";

const MoviesAndTv = ({ path }) => {
  const videoRef = useRef(null);
  const [src, setSrc] = useState("");
  const { readBlob } = useContext(FileSystemContext);
  const {
    setVideo,
    isPlaying,
    togglePlay,
    volume,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
  } = useVideoPlayer();

  const handleDurationLoaded = (e) => setDuration(e.target.duration);
  const handleProgressChnage = (e) => setCurrentTime(e.target.currentTime);

  const formatTime = (ms) => {
    if (!ms) return "0:00:00";

    const hh = Math.round(ms / 3600);
    const mm = Math.round(ms / 60);
    const ss = Math.round(ms);

    return `${hh}:${mm < 10 ? "0" + mm : mm}:${ss < 10 ? "0" + ss : ss}`;
  };

  const handleSliderChange = (ms) => setCurrentTime(ms);

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
            onTimeUpdate={handleProgressChnage}
          ></video>
          <div className='flex-center video-controls'>
            <div className='playback-bar'>
              <Slider
                min={0}
                max={duration}
                value={currentTime}
                onChange={handleSliderChange}
                step={0.01}
                handleStyle={{
                  height: 20,
                  width: 20,
                  marginTop: -8.5,
                  marginLeft: 0,
                  backgroundColor: "transparent",
                  border: "2px solid #5CDCE6",
                }}
                trackStyle={{
                  background: "#5CDCE6",
                  marginTop: -1,
                  borderRadius: "0",
                }}
                railStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.25)",
                  height: "2px",
                }}
              />
              <div className='watched-time'>{formatTime(currentTime)}</div>
              <div className='remaning-time'>{formatTime(duration)}</div>
            </div>
            <div className='video-controls-btn'>
              <BsVolumeUp color='white' size='1.5rem' />
            </div>
            <div className='video-controls-btn'>
              <MdOutlineSubtitles color='white' size='1.5rem' />
            </div>

            <div className='flex-center video-main-controls'>
              <MdReplay10 color='white' size='1.75rem' />
              <div className='video-controls-btn'>
                {!isPlaying ? (
                  <FiPlay color='white' size='1.25rem' onClick={togglePlay} />
                ) : (
                  <AiOutlinePause
                    color='white'
                    size='1.5rem'
                    onClick={togglePlay}
                  />
                )}
              </div>
              <MdOutlineForward30 color='white' size='1.75rem' />
            </div>

            <div className='video-controls-btn'>
              <CgMiniPlayer color='white' size='1.5rem' />
            </div>
            <div className='video-controls-btn'>
              <AiOutlineExpandAlt color='white' size='1.5rem' />
            </div>
          </div>
          <div className='controls-overlay'></div>
        </div>
      </WindowContent>
    </Window>
  );
};

export default MoviesAndTv;
