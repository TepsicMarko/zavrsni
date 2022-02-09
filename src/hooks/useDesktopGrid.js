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
      const occupiedCellNewPosition = calcCellPosition(
        cellPosition.column,
        cellPosition.row + 1
      );

      if (!occupiedCellNewPosition.isAtAndOfGrid) {
        const { isOccupied, occupiedCellName } = await checkIsOccupied(
          occupiedCell,
          occupiedCellNewPosition,
          newGrid
        );

        if (isOccupied) {
          newGrid[occupiedCell] = occupiedCellNewPosition;
          resolve(
            makeSpace(occupiedCellNewPosition, occupiedCellName, newGrid)
          );
        } else resolve((newGrid[occupiedCell] = occupiedCellNewPosition));
      }
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

  const calcCellPosition = (newColumnValue, newRowValue) => {
    let isAtAndOfGrid = false;
    if (newColumnValue <= 1) {
      // ako izalzi iz lijevog ruba ekrana
      newColumnValue = 1;
    } else if (newColumnValue > maxColumns) {
      // ako izalzi iz desnog ruba ekrana
      newColumnValue = maxColumns;
    }

    if (newRowValue === 1) {
      // ako izalzi iz gornjeg ruba ekrana
      newRowValue = 1;
    } else if (newRowValue < 1) {
      newColumnValue += 1;
    } else if (newRowValue > maxRows) {
      // ako izlazi iz donjeg ruba ekrana
      if (newColumnValue + 1 <= maxColumns) {
        // ako izlazi iz desnog ruba ekrana
        newRowValue = 1;
        newColumnValue += 1;
      } else {
        newRowValue -= 1;
        isAtAndOfGrid = true;
      }
    }

    return {
      column: newColumnValue,
      row: newRowValue,
      isAtAndOfGrid,
    };
  };

  const findFirstFreeCell = (name, cellPosition, newGrid) =>
    new Promise(async (resolve, reject) => {
      const { isOccupied } = await checkIsOccupied(name, cellPosition, newGrid);
      if (isOccupied) {
        resolve(
          findFirstFreeCell(
            name,
            calcCellPosition(cellPosition.column, cellPosition.row + 1)
          ),
          newGrid
        );
      } else {
        resolve(cellPosition);
      }
    });

  const addToGrid = async (items, newCellPosition) => {
    if (!Object.keys(grid).length || !grid[items[0]]) {
      setGrid({ ...grid, [items[0]]: newCellPosition });
    } else {
      let newGrid = { ...grid };
      let movedColumns = 0;
      let movedRows = 0;
      if (newCellPosition.column !== grid[items[0]].column) {
        movedColumns = newCellPosition.column - grid[items[0]].column;
      }
      if (newCellPosition.row !== grid[items[0]].row) {
        movedRows = newCellPosition.row - grid[items[0]].row;
      }

      for (let name of items) {
        const newColumnValue = newGrid[name].column + movedColumns;
        const newRowValue = newGrid[name].row + movedRows;
        const cellPosition = calcCellPosition(newColumnValue, newRowValue);

        if (items.length > 1) newGrid[name] = cellPosition;
        if (items.length === 1) {
          const { isOccupied, occupiedCellName } = await checkIsOccupied(
            name,
            cellPosition,
            newGrid
          );
          if (isOccupied) {
            newGrid[name] = cellPosition;
            await makeSpace(cellPosition, occupiedCellName, newGrid);
          } else {
            newGrid[name] = cellPosition;
          }
        }
      }

      for (let name of items) {
        const { isOccupied } = await checkIsOccupied(
          name,
          newGrid[name],
          newGrid
        );
        if (isOccupied) {
          if (items.length > 1) {
            const freeCellPosition = await findFirstFreeCell(
              name,
              calcCellPosition(newGrid[name].column, newGrid[name].row + 1),
              newGrid
            );
            newGrid[name] = freeCellPosition;
          }
        }
      }

      setGrid(newGrid);
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
