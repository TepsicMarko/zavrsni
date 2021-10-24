import { useState } from "react";

const useDraggableTaskbar = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [taskbarPosition, setTaskbarPosition] = useState({});

  const handleDragStart = (e) => {
    var img = new Image();
    img.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
    e.dataTransfer.setDragImage(img, 0, 0);
    setIsDragging(true);
  };
  const updateStateIfNeeded = (position) =>
    Object.keys(taskbarPosition)[0] !== Object.keys(position)[0] &&
    setTaskbarPosition(position);

  const calcTaskbarPosition = (e) => {
    const { clientWidth, clientHeight } = document.documentElement;
    const { pageX, pageY } = e;
    // prvi kvadrant
    if (pageY <= clientHeight / 2 && pageX >= clientWidth / 2) {
      if (clientWidth - pageX < pageY)
        updateStateIfNeeded({
          right: `calc(${-clientWidth}px / 2 + ${e.target.style.height} / 2)`,
        });
      if (clientWidth - pageX > pageY) updateStateIfNeeded({ top: 0 });
    }
    // drugi kvadrant
    if (pageY <= clientHeight / 2 && pageX <= clientWidth / 2) {
      console.log(e.target.style.height);
      if (pageX < pageY)
        updateStateIfNeeded({
          left: `calc(${-clientWidth}px / 2 + ${e.target.style.height} / 2)`,
        });
      if (pageX > pageY) updateStateIfNeeded({ top: 0 });
    }
    // treci kvadrant
    if (pageY >= clientHeight / 2 && pageX <= clientWidth / 2) {
      if (pageX < clientHeight - pageY)
        updateStateIfNeeded({
          left: `calc(${-clientWidth}px / 2 + ${e.target.style.height} / 2)`,
        });
      if (pageX > clientHeight - pageY) updateStateIfNeeded({ bottom: 0 });
    }
    // cetvrti kvadrant
    if (pageY >= clientHeight / 2 && pageX >= clientWidth / 2) {
      if (clientWidth - pageX < clientHeight - pageY)
        updateStateIfNeeded({
          right: `calc(${-clientWidth}px / 2 + ${e.target.style.height} / 2)`,
        });
      if (clientWidth - pageX > clientHeight - pageY)
        updateStateIfNeeded({ bottom: 0 });
    }
  };

  const handleDrag = (e) => calcTaskbarPosition(e);
  const handleDragEnd = (e) => calcTaskbarPosition(e);

  return {
    isDragging,
    taskbarPosition,
    handleDragStart,
    handleDrag,
    handleDragEnd,
  };
};

export default useDraggableTaskbar;
