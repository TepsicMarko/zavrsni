import { useState, useEffect } from "react";

const useDesktopGrid = ({ maxRows, maxColumns }) => {
  const [grid, setGrid] = useState({});

  const checkIsOccupied = (cellPosition, temp, name) => {
    let foundNum = 0;
    for (let cell in temp) {
      if (temp[cell] === cellPosition && name !== cell) {
        const newCellPosition = [...cellPosition]
          .map((c) => {
            if (!isNaN(c)) {
              if (foundNum === 0 || foundNum === 2) {
                foundNum += 1;
                return parseInt(c) + 1;
              }
              foundNum += 1;
            }
            return c;
          })
          .reduce((p, c) => p + c);
        temp[cell] = newCellPosition;
        checkIsOccupied(newCellPosition, temp, cell);
      }
    }
  };

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

  const addToGrid = (name, gridPositon, checkIsCellOccupied) => {
    const temp = JSON.parse(JSON.stringify(grid));
    temp[name] = gridPositon;
    checkIsCellOccupied && checkIsOccupied(gridPositon, temp, name);
    setGrid(temp);
  };

  return { grid, addToGrid, calculateGridPosition };
};

export default useDesktopGrid;
