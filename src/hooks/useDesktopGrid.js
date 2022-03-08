import { useState, useEffect } from 'react';

const getItem = (id) => JSON.parse(localStorage.getItem(id));
const setItem = (id, value) => localStorage.setItem(id, JSON.stringify(value));

const useDesktopGrid = ({ maxColumns, maxRows }) => {
  const [grid, setGrid] = useState(getItem('grid') || {});

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

  const makeSpace = async (cellPosition, cellName, newGrid) =>
    new Promise(async (resolve, reject) => {
      if (cellPosition.column === maxColumns && cellPosition.row + 1 > maxRows)
        return resolve({ notEnoughSpace: true });

      const occupiedCellNewPosition = returnToGridIfOutside(
        cellPosition.column,
        cellPosition.row + 1,
        'item'
      );

      const { isOccupied, occupiedCellName } = await checkIsOccupied(
        cellName,
        occupiedCellNewPosition,
        newGrid
      );

      if (isOccupied) {
        newGrid[cellName] = occupiedCellNewPosition;
        resolve(makeSpace(occupiedCellNewPosition, occupiedCellName, newGrid));
      } else {
        newGrid[cellName] = occupiedCellNewPosition;
        resolve({ notEnoughSpace: false });
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

  const returnToGridIfOutside = (newColumnValue, newRowValue, returnItemOrSelection) => {
    if (newColumnValue <= 1) {
      // ako izalzi iz lijevog ruba ekrana
      newColumnValue = 1;
    } else if (newColumnValue > maxColumns) {
      // ako izalzi iz desnog ruba ekrana
      newColumnValue = maxColumns;
    }

    if (newRowValue < 1) {
      // ako izalzi iz gornjeg ruba ekrana
      newRowValue = 1;
    } else if (newRowValue > maxRows) {
      // ako izlazi iz donjeg ruba ekrana
      if (returnItemOrSelection === 'item') {
        newRowValue = 1;
        newColumnValue += 1;
      } else {
        newRowValue = maxRows;
      }
    }

    return {
      row: newRowValue,
      column: newColumnValue,
    };
  };

  const calcSearchDirection = (movedColumns, movedRows) => {
    if (Math.abs(movedRows) > Math.abs(movedColumns)) {
      return 'right';
    } else if (Math.abs(movedRows) < Math.abs(movedColumns)) {
      return 'down';
    } else if (movedRows === 0 && movedColumns === 0) {
      return 'fromTopToBottom';
    } else {
      return Math.round(Math.random() * 1) > 0 ? 'right' : 'down';
    }
  };

  const calcIsInCorner = (cellPosition) => ({
    bottomRight: cellPosition.column === maxColumns && cellPosition.row === maxRows,
    bottomLeft: cellPosition.column === 1 && cellPosition.row === maxRows,
    topLeft: cellPosition.column === 1 && cellPosition.row === 1,
    topRight: cellPosition.column === maxColumns && cellPosition.row === 1,
  });

  const findFirstFreeCell = (name, cellPosition, newGrid, searchDirection, isInCorner) =>
    new Promise(async (resolve, reject) => {
      if (searchDirection === 'down') {
        if (isInCorner.bottomLeft) {
          cellPosition.column += 1;
        } else if (isInCorner.bottomRight) {
          cellPosition.column -= 1;
        } else {
          if (cellPosition.row + 1 <= maxRows) {
            cellPosition.row += 1;
          } else cellPosition.column += 1;
        }
      }

      if (searchDirection === 'right') {
        if (isInCorner.topRight) {
          cellPosition.row += 1;
        } else if (isInCorner.bottomRight) {
          cellPosition.row -= 1;
        } else {
          if (cellPosition.column + 1 <= maxColumns) {
            cellPosition.column += 1;
          } else cellPosition.row += 1;
        }
      }

      if (searchDirection === 'fromTopToBottom') {
        cellPosition.row += 1;
        if (cellPosition.row > maxRows) {
          cellPosition.row = 1;
          cellPosition.column += 1;
        }
      }

      cellPosition = returnToGridIfOutside(cellPosition.column, cellPosition.row);
      const { isOccupied } = await checkIsOccupied(name, cellPosition, newGrid);

      if (isOccupied) {
        resolve(
          findFirstFreeCell(
            name,
            cellPosition,
            newGrid,
            searchDirection,
            Object.values(isInCorner).some((corner) => corner === true)
              ? isInCorner
              : calcIsInCorner(cellPosition)
          )
        );
      } else {
        resolve(cellPosition);
      }
    });

  const addToGrid = async (items, newCellPosition) => {
    if (items.length === 1 && !grid[items[0]]) {
      setGrid({ ...grid, [items[0]]: newCellPosition });
    } else {
      let newGrid = { ...grid };
      let movedColumns = 0;
      let movedRows = 0;

      if (!grid[items[0]]) {
        console.log('adding to grid');
        items.forEach((item) => {
          item && (newGrid[item] = newCellPosition);
        });
      }

      if (newCellPosition.column !== newGrid[items[0]].column) {
        movedColumns = newCellPosition.column - newGrid[items[0]].column;
      }
      if (newCellPosition.row !== newGrid[items[0]].row) {
        movedRows = newCellPosition.row - newGrid[items[0]].row;
      }

      for (let name of items) {
        if (name) {
          console.log(name);
          const newColumnValue = newGrid[name].column + movedColumns;
          const newRowValue = newGrid[name].row + movedRows;

          if (items.length > 1) {
            newGrid[name] = { row: newRowValue, column: newColumnValue };
          }

          if (items.length === 1) {
            const cellPosition = returnToGridIfOutside(
              newCellPosition.column,
              newCellPosition.row,
              'item'
            );
            const { isOccupied, occupiedCellName } = await checkIsOccupied(
              name,
              cellPosition,
              newGrid
            );

            if (isOccupied) {
              newGrid[name] = cellPosition;
              const { notEnoughSpace } = await makeSpace(
                cellPosition,
                occupiedCellName,
                newGrid,
                grid
              );
              if (notEnoughSpace) {
                newGrid = { ...grid };
                if (Math.abs(movedColumns) <= 0) {
                  newGrid[name].row += movedRows;
                  newGrid[occupiedCellName].row -= movedRows;
                }
              }
            } else {
              newGrid[name] = cellPosition;
            }
          }
        }
      }

      for (let name of items) {
        if (name) {
          const cellPosition = returnToGridIfOutside(
            newGrid[name].column,
            newGrid[name].row
          );
          const { isOccupied } = await checkIsOccupied(name, cellPosition, newGrid);

          if (isOccupied) {
            if (items.length > 1) {
              const freeCellPosition = await findFirstFreeCell(
                name,
                cellPosition,
                newGrid,
                calcSearchDirection(movedColumns, movedRows),
                calcIsInCorner(cellPosition)
              );

              newGrid[name] = freeCellPosition;
            }
          } else {
            newGrid[name] = cellPosition;
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

  const deleteFromGrid = (name) => setGrid(({ [name]: remove, ...rest }) => rest);

  const sortGrid = async (sortBy, folderContent) => {
    let sortedGrid = { ...grid };
    let columnOffset = 0;

    if (sortBy === 'Name') {
      let sortedKeys = Object.keys(sortedGrid).sort((a, b) => a.localeCompare(b));

      sortedKeys.forEach((key, index) => {
        sortedGrid[key] = {
          column: 1 + columnOffset,
          row: index + 1 - columnOffset * maxRows,
        };
        (index + 1) % maxRows === 0 && (columnOffset += 1);
      });
    } else {
      console.log(sortBy, folderContent, typeof folderContent[0].size);
      const sortedFolderContents = folderContent.sort((a, b) =>
        typeof a[sortBy] === 'string'
          ? a[sortBy].localeCompare(b[sortBy])
          : a[sortBy] - b[sortBy]
      );

      console.log(sortedFolderContents);

      sortedFolderContents.forEach(({ name }, index) => {
        sortedGrid[name] = {
          column: 1 + columnOffset,
          row: index + 1 - columnOffset * maxRows,
        };
        (index + 1) % maxRows === 0 && (columnOffset += 1);
      });
    }

    setGrid(sortedGrid);
  };

  useEffect(() => {
    setItem('grid', grid);
  }, [grid]);

  return {
    grid,
    addToGrid,
    updateGridItemName,
    deleteFromGrid,
    calculateGridPosition,
    sortGrid,
  };
};

export default useDesktopGrid;
