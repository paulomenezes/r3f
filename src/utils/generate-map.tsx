import { MapCell, MapCellType, ParkType } from '../types/map-cell';
import { BUILDING_QUANTITY } from './const';
import { randomRange } from './functions';

function shuffle(array: MapCell[]) {
  let copy = [];
  let n = array.length;
  let i;

  // While there remain elements to shuffle…
  while (n) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * array.length);

    // If not already shuffled, move it to the new array.
    if (i in array) {
      copy.push(array[i]);
      delete array[i];
      n--;
    }
  }

  return copy;
}

function getAllCells(mapSize: number, grid: MapCell[][]) {
  const cells: MapCell[] = [];

  for (let i = 0; i < mapSize; i += 2) {
    for (let j = 0; j < mapSize; j += 2) {
      cells.push(grid[i][j]);
    }
  }

  return cells;
}

function isInBounds(mapSize: number, i: number, j: number) {
  return !(i < 0 || i >= mapSize || j < 0 || j >= mapSize);
}

// Check if the neighbor to the right or below is a road and if so replace self as a road cell
function checkIfRoad(mapSize: number, grid: MapCell[][], i: number, j: number) {
  if (isInBounds(mapSize, i + 1, j) && grid[i + 1][j].id != grid[i][j].id) {
    grid[i][j].type = 'road';
  }

  if (isInBounds(mapSize, i, j + 1) && grid[i][j + 1].id != grid[i][j].id) {
    grid[i][j].type = 'road';
  }
}

export function generateMap(mapSize: number) {
  // Generate the grid
  const grid: MapCell[][] = [];

  for (let i = 0; i < mapSize; i++) {
    grid[i] = [];
    for (let j = 0; j < mapSize; j++) {
      grid[i][j] = {
        id: -1,
        type: 'none',
        i,
        j,
        buildingIndex: randomRange(0, BUILDING_QUANTITY),
      };
    }
  }

  // Get a random order to loop through the cells
  const checkOrder = shuffle(getAllCells(mapSize, grid));
  const minSize = 4;
  const maxSize = 6;

  for (let id = 1; id < checkOrder.length; id++) {
    const curTile = checkOrder[id];

    if (curTile.type == 'none') {
      const direction = Math.random() > 0.5 ? 1 : 0;
      const squareWidth = randomRange(minSize, direction ? maxSize : minSize);
      const squareHeight = randomRange(minSize, direction ? minSize : maxSize);

      const zone: MapCellType = Math.random() > 0.3 ? 'building' : 'park';

      for (let i = 0; i < squareWidth; i += 2) {
        for (let j = 0; j < squareHeight; j += 2) {
          if (isInBounds(mapSize, curTile.i + i + 1, curTile.j + j + 1)) {
            grid[curTile.i + i][curTile.j + j].id = id; // [x] O
            grid[curTile.i + i][curTile.j + j].type = zone; //	O  O

            grid[curTile.i + i + 1][curTile.j + j].id = id; //	x [O]
            grid[curTile.i + i + 1][curTile.j + j].type = zone; //	O  O

            grid[curTile.i + i][curTile.j + j + 1].id = id; //	x  O
            grid[curTile.i + i][curTile.j + j + 1].type = zone; // [O] O

            grid[curTile.i + i + 1][curTile.j + j + 1].id = id; //  x  O
            grid[curTile.i + i + 1][curTile.j + j + 1].type = zone; // 	O [O]
          }
        }
      }
    }
  }

  for (let i = 0; i < mapSize; i++) {
    for (let j = 0; j < mapSize; j++) {
      checkIfRoad(mapSize, grid, i, j);
    }
  }

  for (let i = 0; i < mapSize; i++) {
    for (let j = 0; j < mapSize; j++) {
      if (grid[i][j].type != 'road' && grid[i][j].type != 'park') {
        const neighbors = [];

        if (isInBounds(mapSize, i - 1, j)) neighbors.push(grid[i - 1][j]);
        if (isInBounds(mapSize, i + 1, j)) neighbors.push(grid[i + 1][j]);
        if (isInBounds(mapSize, i, j - 1)) neighbors.push(grid[i][j - 1]);
        if (isInBounds(mapSize, i, j + 1)) neighbors.push(grid[i][j + 1]);

        let isRoad = false;
        for (let k = 0; k < neighbors.length; k++) {
          if (neighbors[k].type == 'road') {
            isRoad = true;
            break;
          }
        }

        if (!isRoad) {
          grid[i][j].type = 'none';
        }
      }
    }
  }

  const parks: [number, number][] = [];

  for (let i = 0; i < mapSize; i++) {
    for (let j = 0; j < mapSize; j++) {
      if (grid[i][j].type === 'park') {
        parks.push([i, j]);
      }
    }
  }

  const parksArray: [number, number][][] = [[parks.pop()!]];

  do {
    const [px, py] = parks.pop()!;

    let included = false;

    for (const currentPark of parksArray) {
      const alreadyIncluded = currentPark.some(([cx, cy]) => {
        return cx === px && cy === py;
      });

      if (!alreadyIncluded) {
        const isAdjacent = currentPark.some(([cx, cy]) => {
          return (
            (cx === px && cy === py - 1) ||
            (cx === px && cy === py + 1) ||
            (cx === px - 1 && cy === py) ||
            (cx === px + 1 && cy === py)
          );
        });

        if (isAdjacent) {
          currentPark.push([px, py]);
          included = true;
        }
      }
    }

    if (!included) {
      parksArray.push([[px, py]]);
    }
  } while (parks.length > 0);

  for (const park of parksArray) {
    let type: ParkType = 'complex';
    let index = 0;

    let withWalls = false;

    if (park.length === 1) {
      type = 'single';
      index = randomRange(0, 6);
    } else {
      const xValues = park.map(([x]) => x);
      const yValues = park.map(([, y]) => y);

      const allX = [...new Set(xValues)];
      const allY = [...new Set(yValues)];

      if (xValues.every((x) => x === xValues[0])) {
        type = 'vertical';
      } else if (yValues.every((y) => y === yValues[0])) {
        type = 'horizontal';
      } else {
        const groupYbyX = park.reduce(
          (acc, [x, y]) => {
            if (!acc[x]) {
              acc[x] = [];
            }

            acc[x].push(y);

            return acc;
          },
          {} as Record<number, number[]>,
        );

        const allYhasSameLength = Object.values(groupYbyX).every(
          (yValues) => yValues.length === Object.values(groupYbyX)[0].length,
        );

        if (allYhasSameLength) {
          console.log(park);

          type = 'square';
          withWalls = allX.length > 2 && allY.length > 2;
          // (allX.length > 3 || allY.length > 3);
        } else {
          if (allX.length + allY.length === park.length + 1) {
            type = 'L';
          } else {
            // console.log('complex park', park);
          }
        }
      }
    }

    for (const [x, y] of park) {
      grid[x][y].parkType = type;
      grid[x][y].withWalls = withWalls;

      if (type === 'vertical' || type === 'horizontal' || type === 'L') {
        grid[x][y].buildingIndex = randomRange(0, 2);
      } else if (type === 'square') {
        if (
          (x % 2 === 1 || y % 2 === 1) &&
          x !== 0 &&
          y !== 0
          // x !== mapSize - 1 &&
          // y !== mapSize - 1
        ) {
          grid[x][y].parkType = 'road';
        }
      } else if (type === 'complex') {
        grid[x][y].buildingIndex = randomRange(0, 2);
      } else {
        grid[x][y].buildingIndex = index;
      }

      grid[x][y].isMapEdgeLeft = x === 0;
      grid[x][y].isMapEdgeRight = x === mapSize - 1;
      grid[x][y].isMapEdgeTop = y === 0;
      grid[x][y].isMapEdgeBottom = y === mapSize - 1;
    }
  }

  return grid;
}
