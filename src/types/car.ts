export type Direction =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';
export type Turn = `${Direction}-${Direction}`;

export type Car = {
  id: string;
  position: [number, number, number];
  destination: [number, number, number];
  carIndex: number;
};
