import { useControls } from 'leva';
import { useEffect } from 'react';
import { generateUUID } from 'three/src/math/MathUtils';
import { useGameState } from '../store/game';
import { Car as CarType } from '../types/car';
import { MapCell } from '../types/map-cell';
import { CAR_QUANTITY } from '../utils/const';
import { generateCarPositions, randomRange } from '../utils/functions';
import { Car } from './car';

function createNewCar(map: MapCell[][]): CarType {
  const { position, destination } = generateCarPositions(map);

  return {
    id: generateUUID(),
    position,
    destination,
    carIndex: randomRange(0, CAR_QUANTITY),
  };
}

export function Cars() {
  const { cars, map, setCars } = useGameState();

  const { Cars } = useControls({
    Cars: 5,
  });

  useEffect(() => {
    setCars(Array.from({ length: Cars }).map(() => createNewCar(map)));
  }, [map, Cars]);

  return (
    <>
      {cars.map((car) => (
        <Car
          key={car.id}
          carId={car.id}
          position={car.position}
          destination={car.destination}
          carIndex={car.carIndex}
        />
      ))}
    </>
  );
}
