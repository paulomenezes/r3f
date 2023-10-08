import { MapCellType } from './map-cell';

export type PathfindPoint = {
  x: number;
  y: number;
  // total cost function
  f: number;
  // cost function from start to the current grid point
  g: number;
  // heuristic estimated cost function from current grid point to the goal
  h: number;
  // neighbors of the current grid point
  neighbors: PathfindPoint[];
  // immediate source of the current grid point
  parent?: PathfindPoint;
  type: MapCellType;
};
