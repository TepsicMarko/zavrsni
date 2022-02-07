import { useState, useRef } from "react";

const useSelectionRectangle = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isSelectionActive, setIsSelectionActive] = useState(false);
  const rectRef = useRef(null);

  const enableSelection = (e) => {
    setIsSelectionActive(true);
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const disableSelection = () => {
    setPosition({ x: 0, y: 0 });
    setDimensions({ width: 0, height: 0 });
    setIsSelectionActive(false);
  };

  const handleSelection = (e) => {
    setDimensions({
      width: position.x - e.clientX,
      height: position.y - e.clientY,
    });
  };

  const calcRectStyle = () => {
    const { width, height } = dimensions;
    const top = height < 0 ? position.y : position.y - height;
    const left = width < 0 ? position.x : position.x - width;

    return { width: Math.abs(width), height: Math.abs(height), top, left };
  };

  return {
    rectRef: isSelectionActive ? rectRef : null,
    calcRectStyle,
    enableSelection,
    disableSelection,
    handleSelection,
  };
};

export default useSelectionRectangle;
