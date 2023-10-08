import { create } from 'zustand';
import { Car } from '../types/car';
import { MapCell } from '../types/map-cell';

export type GameState = {
  map: MapCell[][];
  cars: Car[];
  setMap: (map: MapCell[][]) => void;
  setCars: (cars: Car[]) => void;
  addCar: (car: Car) => void;
  removeCar: (carId: string) => void;
  updateCar: (carId: string, car: Car) => void;
};

export const useGameState = create<GameState>((set) => ({
  map: [],
  cars: [],
  setMap: (map) => set({ map }),
  setCars: (cars) => set({ cars }),
  addCar: (car) => set((state) => ({ cars: [...state.cars, car] })),
  removeCar: (carId) =>
    set((state) => ({
      cars: state.cars.filter((car) => car.id !== carId),
    })),
  updateCar: (carId, car) =>
    set((state) => ({
      cars: state.cars.map((c) => (c.id === carId ? car : c)),
    })),
}));
