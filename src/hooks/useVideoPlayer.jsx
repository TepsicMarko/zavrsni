import { useState, useEffect } from "react";

const useVideoPlayer = () => {
  const [video, setVideo] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [watched, setWatched] = useState("0");
  const [duration, setDuration] = useState();

  const togglePlay = () => {
    isPlaying ? video.pause() : video.play();
    setIsPlaying(!isPlaying);
  };

  return {
    setVideo,
    isPlaying,
    togglePlay,
    volume,
    watched,
    setWatched,
    duration,
    setDuration,
  };
};

export default useVideoPlayer;
