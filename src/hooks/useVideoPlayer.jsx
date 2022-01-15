import { useState, useEffect } from "react";
import useFullScreenToggle from "./useFullScreenToggle";

const useVideoPlayer = () => {
  const [video, setVideo] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullScreen, toggleFullScreen] = useFullScreenToggle();
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState("0");
  const [duration, setDuration] = useState();

  const togglePlay = () => {
    isPlaying ? video.pause() : video.play();
    setIsPlaying(!isPlaying);
  };

  const skipForwards = () => {
    const newTime = currentTime + 30;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skipBackwards = () => {
    const newTime = currentTime - 10;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleFullScreenVideo = () => toggleFullScreen(video.parentElement);

  const changeVolume = (vol) => {
    setVolume(vol);
    video.volume = vol / 100;
  };

  const toggleMuted = () => {
    setIsMuted(!isMuted);
    video.muted = !isMuted;
  };

  useEffect(() => {
    if (video) {
      video.currentTime !== currentTime && (video.currentTime = currentTime);
    }
  }, [currentTime]);

  return {
    setVideo,
    isPlaying,
    togglePlay,
    volume,
    isMuted,
    toggleMuted,
    changeVolume,
    currentTime,
    skipForwards,
    skipBackwards,
    setCurrentTime,
    duration,
    setDuration,
    toggleFullScreenVideo,
  };
};

export default useVideoPlayer;
