import { useState, useEffect } from "react";

const useVideoPlayer = (video) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    isPlaying ? video.pause() : video.play();
    setIsPlaying(!isPlaying);
  };

  return { togglePlay };
};

export default useVideoPlayer;
