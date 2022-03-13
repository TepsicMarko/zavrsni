import { useState, useRef } from 'react';

const useSelectionRectangle = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isSelectionActive, setIsSelectionActive] = useState(false);
  const [selectedElements, setSelectedElements] = useState({});
  const rectRef = useRef(null);

  const enableSelection = (e) => {
    const { top, left } = e.target.getBoundingClientRect();
    setIsSelectionActive(true);
    setPosition({
      x: e.clientX - left,
      y: e.clientY - top,
    });
  };

  const disableSelection = () => {
    setPosition({ x: 0, y: 0 });
    setDimensions({ width: 0, height: 0 });
    setIsSelectionActive(false);
  };

  const handleSelection = (e) => {
    e.stopPropagation();
    const { top, left } = e.target.getBoundingClientRect();
    const newWidth = position.x - e.clientX + left;
    const newHeight = position.y - e.clientY + top;

    if (newWidth !== dimensions.width || newHeight !== dimensions.height) {
      setDimensions({
        width: newWidth,
        height: newHeight,
      });
    }
  };

  const calcRectStyle = () => {
    const { width, height } = dimensions;
    const top = height < 0 ? position.y : position.y - height;
    const left = width < 0 ? position.x : position.x - width;

    return {
      width: Math.abs(width),
      height: Math.abs(height),
      top,
      left,
      display: isSelectionActive ? 'block' : 'none',
    };
  };

  return {
    rectRef: isSelectionActive ? rectRef : null,
    calcRectStyle,
    enableSelection,
    disableSelection,
    handleSelection,
    selectedElements,
    setSelectedElements,
    dimensions,
  };
};

export default useSelectionRectangle;
