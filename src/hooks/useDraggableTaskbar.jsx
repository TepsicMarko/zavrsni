import { useState } from "react";

const useDraggableTaskbar = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const handleDragStart = (e) => {
    setIsDragging(true);
    setOrigin({ x: e.clientX, y: e.clientY });
  };
  const handleDrag = (e) => console.log(e);
  const handleDragEnd = (e) => {
    const { clientWidth, clientHeight } = document.documentElement;
    const { pageX, pageY } = e;
    console.log(clientWidth, clientHeight);
    const safeZones = [
      {
        start: { x: clientWidth * 0.25, y: 0 },
        end: { x: clientHeight * 0.75, y: clientHeight * 0.3 },
      },
    ];
  };

  return { isDragging, handleDragStart, handleDrag, handleDragEnd };
};

export default useDraggableTaskbar;
