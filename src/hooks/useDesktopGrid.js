import { useState, useEffect } from "react";

// const calcGridDimensions = () => ({
//   maxRows: Math.floor(
//     (document.documentElement.clientHeight - evalTaskbarHeight()) / 80 - 1
//   ),
//   maxColumns: Math.floor(document.documentElement.clientWidth / 68),
// });

const useDesktopGrid = ({ maxColumns, maxRows }) => {
  const [grid, setGrid] = useState({});
  // const [{ maxRows, maxColumns }, setGridDimensions] = useState(
  //   calcGridDimensions()
  // );

  const checkIsOccupied = (cellName, cellPosition, newGrid) =>
    new Promise((resolve, reject) => {
      for (let occupiedCellName in newGrid) {
        if (cellName !== occupiedCellName) {
          const occupiedCell = newGrid[occupiedCellName];
          if (
            cellPosition.column === occupiedCell.column &&
            cellPosition.row === occupiedCell.row
          ) {
            resolve({ isOccupied: true, occupiedCellName });
          }
        }
      }

      resolve({ isOccupied: false });
    });

  const makeSpace = async (cellPosition, occupiedCell, newGrid) =>
    new Promise(async (resolve, reject) => {
      const newRowValue = cellPosition.row + 1;
      const newColumnValue =
        newRowValue > maxRows ? cellPosition.column + 1 : cellPosition.column;
      const occupiedCellNewPosition = {
        row: newRowValue > maxRows ? 1 : newRowValue,
        column: newColumnValue,
      };
      const { isOccupied, occupiedCellName } = await checkIsOccupied(
        occupiedCellNewPosition,
        newGrid
      );

      if (isOccupied) {
        newGrid[occupiedCell] = occupiedCellNewPosition;
        resolve(makeSpace(occupiedCellNewPosition, occupiedCellName, newGrid));
      } else resolve((newGrid[occupiedCell] = occupiedCellNewPosition));
    });

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

    return { row, column };
  };

  const isNameTaken = (temp, name, i) => {
    if (temp.hasOwnProperty(i > 0 ? `${name} (${i})` : name))
      return isNameTaken(temp, name, i === 0 ? i + 2 : i + 1);
    return i > 0 ? `${name} (${i})` : name;
  };

  const calcCellPosition = (newColumnValue, newRowValue) => {
    if (newColumnValue <= 1) {
      // ako izalzi iz lijevog ruba ekrana
      newColumnValue = 1;
    } else {
      // ako ne izalzi iz lijevog ruba ekrana
      if (newRowValue < 1 || newRowValue > maxRows) {
        // a izlazi iz gornjeg
        newColumnValue = newColumnValue; // dodaj 1 ak je okupirano
        // ako izlazi iz donjeg ruba ekarana
        if (newRowValue > maxRows) {
          newRowValue = maxRows;
        }
      }

      // ak izlazi iz desnog ruba ekrana
    }

    if (newRowValue <= 1) {
      // ako izalzi iz gornjeg ruba ekrana
      newRowValue = 1;
    } else {
      // ako ne izlazi iz gornjeg ruba ekarana
      if (newColumnValue < 1 || newColumnValue > maxColumns) {
        // a izlazi iz lijevog ili desnog ruba ekrana
        newRowValue = newRowValue; // dodaj 1 ak je okupirano
        if (newColumnValue > maxColumns) {
          newColumnValue = maxColumns;
        }
      }

      // ako izalzi iz gornjeg ruba ekrana
    }

    return {
      column: newColumnValue,
      row: newRowValue,
    };
  };

  const addToGrid = async (
    items,
    newCellPosition,
    checkIsCellOccupied,
    checkIsNameTaken
  ) => {
    if (!Object.keys(grid).length || !grid[items[0]]) {
      setGrid({ ...grid, [items[0]]: newCellPosition });
    } else {
      let newGrid = { ...grid };
      let movedColumns = 0;
      let movedRows = 0;
      // checkIsNameTaken && (name = isNameTaken(newGrid, name, 0));
      if (newCellPosition.column !== grid[items[0]].column) {
        movedColumns = newCellPosition.column - grid[items[0]].column;
      }
      if (newCellPosition.row !== grid[items[0]].row) {
        movedRows = newCellPosition.row - grid[items[0]].row;
      }

      // console.log(movedColumns, movedRows);

      for (let name of items.slice(0).reverse()) {
        // console.log(items);
        const newColumnValue = newGrid[name].column + movedColumns;
        const newRowValue = newGrid[name].row + movedRows;
        console.log(name, newColumnValue, newRowValue);
        const cellPosition = calcCellPosition(newColumnValue, newRowValue);
        const { isOccupied, occupiedCellName } = await checkIsOccupied(
          name,
          cellPosition,
          newGrid
        );
        // console.log(
        //   isOccupied,
        //   name,
        //   grid[name].column,
        //   newCellPosition.column,
        //   newColumnValue
        // );
        if (isOccupied) {
          console.log(cellPosition, newGrid);
          newGrid[name] = cellPosition;
          // if (items.length === 1)
          await makeSpace(cellPosition, occupiedCellName, newGrid);
        } else {
          newGrid[name] = cellPosition;
          console.log(cellPosition, { ...newGrid });
        }
      }

      setGrid(newGrid);
      // newGrid[name] = gridPositon;
      // checkIsCellOccupied && checkIsOccupied(gridPositon, newGrid, name);
      // setGrid(newGrid);
    }
  };

  const updateGridItemName = (name) => {
    let temp = { ...grid };
    temp[name.new] = temp[name.old];
    delete temp[name.old];
    setGrid(temp);
  };

  const deleteFromGrid = (name) =>
    setGrid(({ [name]: remove, ...rest }) => rest);

  return {
    grid,
    addToGrid,
    updateGridItemName,
    deleteFromGrid,
    calculateGridPosition,
  };
};

export default useDesktopGrid;
