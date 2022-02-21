import { useState } from 'react';

const useDraggableTaskbar = () => {
  const [taskbarPosition, setTaskbarPosition] = useState('bottom');
  const [taskbarOrientation, setTaskbarOrientation] = useState('horizontal');

  const handleDragStart = (e) => {
    var img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  const calcTaskbarPosition = (e) => {
    const { clientWidth, clientHeight } = document.documentElement;
    const { pageX, pageY } = e;
    // prvi kvadrant
    if (pageY <= clientHeight / 2 && pageX >= clientWidth / 2) {
      if (clientWidth - pageX < pageY) {
        setTaskbarPosition('right');
        setTaskbarOrientation('vertical');
      }
      if (clientWidth - pageX > pageY) {
        setTaskbarPosition('top');
        setTaskbarOrientation('horizontal');
      }
    }
    // drugi kvadrant
    if (pageY <= clientHeight / 2 && pageX <= clientWidth / 2) {
      if (pageX < pageY) {
        setTaskbarPosition('left');
        setTaskbarOrientation('vertical');
      }
      if (pageX > pageY) {
        setTaskbarPosition('top');
        setTaskbarOrientation('horizontal');
      }
    }
    // treci kvadrant
    if (pageY >= clientHeight / 2 && pageX <= clientWidth / 2) {
      if (pageX < clientHeight - pageY) {
        setTaskbarPosition('left');
        setTaskbarOrientation('vertical');
      }
      if (pageX > clientHeight - pageY) {
        setTaskbarPosition('bottom');
        setTaskbarOrientation('horizontal');
      }
    }
    // cetvrti kvadrant
    if (pageY >= clientHeight / 2 && pageX >= clientWidth / 2) {
      if (clientWidth - pageX < clientHeight - pageY) {
        setTaskbarPosition('right');
        setTaskbarOrientation('vertical');
      }
      if (clientWidth - pageX > clientHeight - pageY) {
        setTaskbarPosition('bottom');
        setTaskbarOrientation('horizontal');
      }
    }
  };

  const handleDrag = (e) => calcTaskbarPosition(e);
  const handleDragEnd = (e) => calcTaskbarPosition(e);

  return {
    taskbarPosition,
    taskbarOrientation,
    handleDragStart,
    handleDrag,
    handleDragEnd,
  };
};

export default useDraggableTaskbar;
