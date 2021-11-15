import { useState, useEffect } from "react";

const useDesktopGrid = ({ maxRows, maxColumns }) => {
  const [grid, setGrid] = useState({});

  const checkIsOccupied = (cellPosition, temp, name) => {
    let foundNum = 0;
    let cellPositionObj = {
      xStart: 0,
      yStart: 0,
      xEnd: 0,
      yEnd: 0,
    };
    for (let cell in temp) {
      if (temp[cell] === cellPosition && name !== cell) {
        let num = "";
        [...cellPosition].forEach((c, i) => {
          if (!isNaN(c)) {
            num += c;
            i === cellPosition.length - 1 &&
              (cellPositionObj[Object.keys(cellPositionObj)[foundNum]] =
                parseInt(num));
          } else {
            cellPositionObj[Object.keys(cellPositionObj)[foundNum]] =
              parseInt(num);
            num = "";
            foundNum += 1;
          }
        });

        const { xStart, yStart, xEnd, yEnd } = cellPositionObj;
        let newCellPosition = "";
        if (xStart >= maxRows)
          newCellPosition = `${1}/${
            yStart >= maxColumns ? 1 : yStart + 1
          }/${1}/${yStart >= maxColumns ? 1 : yStart + 1}`;
        else newCellPosition = `${xStart + 1}/${yStart}/${xEnd + 1}/${yEnd}`;

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

  const isNameTaken = (temp, name, i) => {
    if (temp.hasOwnProperty(i > 0 ? `${name} (${i})` : name))
      return isNameTaken(temp, name, i === 0 ? i + 2 : i + 1);
    return i > 0 ? `${name} (${i})` : name;
  };

  const addToGrid = (
    name,
    gridPositon,
    checkIsCellOccupied,
    checkIsNameTaken
  ) => {
    const temp = JSON.parse(JSON.stringify(grid));
    checkIsNameTaken && (name = isNameTaken(temp, name, 0));
    temp[name] = gridPositon;
    checkIsCellOccupied && checkIsOccupied(gridPositon, temp, name);
    setGrid(temp);
  };

  const updateGridItemName = (name) => {
    let temp = JSON.parse(JSON.stringify(grid));
    temp[name.new] = temp[name.old];
    console.log(temp);
    name.old !== name.new && delete temp[name.old];
    setGrid(temp);
  };

  return { grid, addToGrid, updateGridItemName, calculateGridPosition };
};

export default useDesktopGrid;
