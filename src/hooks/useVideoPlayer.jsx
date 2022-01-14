import { useState, useEffect } from "react";

const useVideoPlayer = () => {
  const [video, setVideo] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState("0");
  const [duration, setDuration] = useState();

  const togglePlay = () => {
    isPlaying ? video.pause() : video.play();
    setIsPlaying(!isPlaying);
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
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
  };
};

export default useVideoPlayer;
