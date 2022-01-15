import { useState } from "react";

const useFullScreenToggle = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const openFullscreen = (el) => {
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    }
  };

  const closeFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  const toggleFullScreen = (target) => {
    isFullScreen ? closeFullscreen() : openFullscreen(target);
    setIsFullScreen(!isFullScreen);
  };

  return [isFullScreen, toggleFullScreen];
};

export default useFullScreenToggle;
