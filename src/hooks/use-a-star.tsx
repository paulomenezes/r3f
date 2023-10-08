import { MapCell, MapCellType } from '../types/map-cell';
import { PathfindPoint } from '../types/pathfind';

export function generatePath(
  map: MapCell[][],
  startPosition: [number, number],
  endPosition: [number, number],
) {
  let grid: PathfindPoint[][] = [];

  let openSet: PathfindPoint[] = [];
  let closedSet: PathfindPoint[] = [];

  let path: PathfindPoint[] = [];

  function heuristic(
    position0: {
      x: number;
      y: number;
    },
    position1: {
      x: number;
      y: number;
    },
  ) {
    let d1 = Math.abs(position1.x - position0.x);
    let d2 = Math.abs(position1.y - position0.y);

    return d1 + d2;
  }

  function createPoint(x: number, y: number, type: MapCellType): PathfindPoint {
    return {
      x: x,
      y: y,
      f: 0,
      g: 0,
      h: 0,
      type,
      neighbors: [],
    };
  }

  function updateNeighbors(point: PathfindPoint, grid: PathfindPoint[][]) {
    let i = point.x;
    let j = point.y;

    const neighbors: PathfindPoint[] = [];

    if (i < map.length - 1) {
      neighbors.push(grid[i + 1][j]);
    }
    if (i > 0) {
      neighbors.push(grid[i - 1][j]);
    }
    if (j < map.length - 1) {
      neighbors.push(grid[i][j + 1]);
    }
    if (j > 0) {
      neighbors.push(grid[i][j - 1]);
    }

    return neighbors.filter((neighbor) => neighbor.type === 'road');
  }

  function init() {
    for (let i = 0; i < map.length; i++) {
      const row: PathfindPoint[] = [];

      for (let j = 0; j < map[i].length; j++) {
        row.push(createPoint(i, j, map[i][j].type));
      }

      grid.push(row);
    }

    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        grid[i][j].neighbors = updateNeighbors(grid[i][j], grid);
      }
    }

    const start = grid[startPosition[0]][startPosition[1]];

    openSet.push(start);
  }

  function search() {
    init();

    while (openSet.length > 0) {
      //assumption lowest index is the first one to begin with
      let lowestIndex = 0;

      for (let i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[lowestIndex].f) {
          lowestIndex = i;
        }
      }

      let current = openSet[lowestIndex];

      if (current.x === endPosition[0] && current.y === endPosition[1]) {
        let temp = current;
        path.push(temp);

        while (temp.parent) {
          path.push(temp.parent);
          temp = temp.parent;
        }

        // return the traced path
        const finalPath = path.reverse();
        // const firstPath = finalPath[0];
        // const lastPath = finalPath.at(-1);

        // if (firstPath) {
        //   let firstX = firstPath.x;
        //   let firstY = firstPath.y;

        //   if (firstPath.x === 0) {
        //     firstX = -1;
        //   } else if (firstPath.y === 0) {
        //     firstY = -1;
        //   } else if (firstPath.x === map.length - 1) {
        //     firstX = map.length;
        //   } else if (firstPath.y === map.length - 1) {
        //     firstY = map.length;
        //   }

        //   finalPath.slice(0, 1).unshift({
        //     x: firstX,
        //     y: firstY,
        //     f: 0,
        //     g: 0,
        //     h: 0,
        //     type: 'road',
        //     neighbors: [],
        //   });
        // }

        // if (lastPath) {
        //   let lastX = lastPath.x;
        //   let lastY = lastPath.y;

        //   if (lastPath.x === 0) {
        //     lastX = -1;
        //   } else if (lastPath.y === 0) {
        //     lastY = -1;
        //   } else if (lastPath.x === map.length - 1) {
        //     lastX = map.length;
        //   } else if (lastPath.y === map.length - 1) {
        //     lastY = map.length;
        //   }

        //   finalPath.push({
        //     x: lastX,
        //     y: lastY,
        //     f: 0,
        //     g: 0,
        //     h: 0,
        //     type: 'road',
        //     neighbors: [],
        //   });
        // }

        return finalPath;
      }

      //remove current from openSet
      openSet.splice(lowestIndex, 1);

      //add current to closedSet
      closedSet.push(current);

      let neighbors = current.neighbors;

      for (let i = 0; i < neighbors.length; i++) {
        let neighbor = neighbors[i];

        if (!closedSet.includes(neighbor)) {
          let possibleG = current.g + 1;

          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
          } else if (possibleG >= neighbor.g) {
            continue;
          }

          neighbor.g = possibleG;
          neighbor.h = heuristic(neighbor, {
            x: endPosition[0],
            y: endPosition[1],
          });
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.parent = current;
        }
      }
    }

    //no solution by default
    return [];
  }

  return search();
}
