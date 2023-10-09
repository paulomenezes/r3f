export type MapCellType = 'none' | 'road' | 'building' | 'park';

export type ParkType =
  | 'complex'
  | 'single'
  | 'vertical'
  | 'horizontal'
  | 'square'
  | 'L'
  | 'road';

export type MapCell = {
  type: MapCellType;
  i: number;
  j: number;
  id: number;
  buildingIndex?: number;
  parkType?: ParkType;
  withWalls?: boolean;
  isMapEdgeLeft?: boolean;
  isMapEdgeRight?: boolean;
  isMapEdgeTop?: boolean;
  isMapEdgeBottom?: boolean;
};
