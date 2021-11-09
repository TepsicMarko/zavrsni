import { useState, useEffect } from "react";

const useDesktopGrid = ({ maxRows, maxColumns }) => {
  const [grid, setGrid] = useState({});

  const calculateGridPosition = ({ x, y }) => {
    let rowStart = 3.3;
    let columnStart = 0;
    let row = 0;
    let column = 0;
    while (rowStart <= y) {
      row > 0 ? (rowStart += 88) : (rowStart += 80);
      row += 1;
    }
    while (columnStart <= x) {
      row > 0 ? (columnStart += 69) : (columnStart += 68);
      column += 1;
    }
    row > maxRows && (row = maxRows);
    column > maxColumns && (column = maxColumns);
    return `${row}/${column}/${row}/${column}`;
  };

  const addToGrid = (name, gridPositon) => {
    const temp = JSON.parse(JSON.stringify(grid));
    temp[name] = gridPositon;
    setGrid(temp);
  };

  return { grid, addToGrid, calculateGridPosition };
};

export default useDesktopGrid;
