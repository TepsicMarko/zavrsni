import { useState, useEffect, useRef } from "react";
import { BsVolumeUp, BsVolumeMute } from "react-icons/bs";
import {
  MdOutlineForward30,
  MdReplay10,
  MdOutlineSubtitles,
} from "react-icons/md";
import { FiPlay } from "react-icons/fi";
import { AiOutlinePause } from "react-icons/ai";
import { CgMiniPlayer } from "react-icons/cg";
import { AiOutlineExpandAlt } from "react-icons/ai";
import Slider from "rc-slider";

const VideoControls = ({
  videoRef,
  duration,
  isPlaying,
  togglePlay,
  toggleMuted,
  changeVolume,
  skipForwards,
  skipBackwards,
  volume,
  isMuted,
  isMiniplayer,
  fullscreenVideo,
  toggleMiniplayer,
}) => {
  const volumeSettingsRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [volumeSliderVisibility, setVolumeSiderVisibility] = useState(false);

  const formatTime = (ms) => {
    if (!ms) return "0:00:00";

    const hh = Math.floor(ms / 3600);
    const mm = Math.floor(ms / 60);
    const ss = Math.abs(Math.ceil(hh * 3600 + mm * 60 - ms));

    return `${hh}:${mm < 10 ? "0" + mm : mm}:${
      ss === 60 ? "00" : ss < 10 ? "0" + ss : ss
    }`;
  };

  const handleSliderChange = (ms) => {
    setCurrentTime(ms);
    videoRef.current.currentTime = ms;
  };

  const toggleVolumeSettings = () => {
    setVolumeSiderVisibility(!volumeSliderVisibility);
  };

  useEffect(() => {
    videoRef.current.ontimeupdate = (e) => setCurrentTime(e.target.currentTime);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        volumeSettingsRef.current &&
        volumeSettingsRef.current.contains(e.target)
      ) {
        return;
      }
      setVolumeSiderVisibility(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
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
        {/* <div className='remaning-time'>{formatTime(duration)}</div> */}
      </div>
      <div className='video-controls-btn'>
        {volumeSliderVisibility && (
          <div ref={volumeSettingsRef} className='flex-center volume-slider'>
            <div className='video-controls-btn'>
              {isMuted ? (
                <BsVolumeMute
                  color='white'
                  size='1.5rem'
                  onClick={toggleMuted}
                />
              ) : (
                <BsVolumeUp color='white' size='1.5rem' onClick={toggleMuted} />
              )}
            </div>
            <Slider
              min={0}
              max={100}
              value={volume}
              onChange={changeVolume}
              step={1}
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
              }}
              railStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.25)",
                height: "2px",
              }}
            />
            <div className='flex-center'>{volume}</div>
          </div>
        )}
        <BsVolumeUp
          color='white'
          size='1.5rem'
          onClick={toggleVolumeSettings}
        />
      </div>
      <div className='video-controls-btn'>
        <MdOutlineSubtitles color='white' size='1.5rem' />
      </div>

      <div className='flex-center video-main-controls'>
        <MdReplay10 color='white' size='1.75rem' onClick={skipBackwards} />
        <div className='video-controls-btn'>
          {!isPlaying ? (
            <FiPlay color='white' size='1.25rem' onClick={togglePlay} />
          ) : (
            <AiOutlinePause color='white' size='1.5rem' onClick={togglePlay} />
          )}
        </div>
        <MdOutlineForward30
          color='white'
          size='1.75rem'
          onClick={skipForwards}
        />
      </div>

      <div className='video-controls-btn'>
        <CgMiniPlayer color='white' size='1.5rem' onClick={toggleMiniplayer} />
      </div>
      <div className='video-controls-btn'>
        <AiOutlineExpandAlt
          color='white'
          size='1.5rem'
          onClick={fullscreenVideo}
        />
      </div>
    </div>
  );
};
export default VideoControls;
