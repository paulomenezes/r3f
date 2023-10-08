export type MapCellType = 'none' | 'road' | 'building';

export type MapCell = {
  type: MapCellType;
  i: number;
  j: number;
  id: number;
  buildingIndex?: number;
};
