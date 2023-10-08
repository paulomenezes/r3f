import { MapCell } from '../types/map-cell';

export function randomRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateCarPositions(map: MapCell[][]): {
  position: [number, number, number];
  destination: [number, number, number];
} {
  let position: [number, number, number] = [0, 0, 0];
  let destination: [number, number, number] = [0, 0, 0];

  const options: [number, number, number][] = [];

  for (let colIndex = 0; colIndex < map.length; colIndex++) {
    for (let rowIndex = 0; rowIndex < map[colIndex].length; rowIndex++) {
      if (
        map[colIndex][rowIndex].type === 'road' &&
        (colIndex === 0 ||
          rowIndex === 0 ||
          colIndex === map.length - 1 ||
          rowIndex === map.length - 1)
      ) {
        options.push([colIndex, 0, rowIndex]);
      }
    }
  }

  position = options[randomRange(0, options.length - 1)];

  while (true) {
    destination = options[randomRange(0, options.length - 1)];

    if (position[0] !== destination[0] && position[2] !== destination[2]) {
      break;
    }
  }

  return {
    position,
    destination,
  };
}
