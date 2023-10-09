import { a, useSpring } from '@react-spring/three';
import { Clone, CloneProps } from '@react-three/drei';
import { GroupProps, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { Group } from 'three';
import { generateUUID } from 'three/src/math/MathUtils';
import { generatePath } from '../hooks/use-a-star';
import { useModel } from '../hooks/use-model';
import { useGameState } from '../store/game';
import { Car as CarType, Direction, Turn } from '../types/car';
import { SCALE } from '../utils/const';
import { generateCarPositions } from '../utils/functions';

function calculateRotation(
  current: {
    x: number;
    z: number;
  },
  next: {
    x: number;
    y: number;
  },
) {
  if (next.x > current.x) {
    return Math.PI / 2;
  } else if (next.x < current.x) {
    return -Math.PI / 2;
  }

  if (next.y > current.z) {
    return 0;
  } else if (next.y < current.z) {
    return Math.PI;
  }

  return 0;
}

export function Car(
  props: Omit<GroupProps, 'children' | 'position'> &
    Omit<CloneProps, 'object'> &
    Omit<CarType, 'id'> & {
      carId: string;
    },
) {
  const car_options = [
    'car_hatchback',
    'car_police',
    'car_sedan',
    'car_stationwagon',
    'car_taxi',
  ];

  const selectedCar = car_options[props.carIndex];

  const car = useModel(`${selectedCar}`);
  const wheelFrontLeft = useModel(`${selectedCar}_wheel_front_left`);
  const wheelFrontRight = useModel(`${selectedCar}_wheel_front_right`);
  const wheelRearLeft = useModel(`${selectedCar}_wheel_rear_left`);
  const wheelRearRight = useModel(`${selectedCar}_wheel_rear_right`);

  const { map, updateCar } = useGameState();
  const carRef = useRef<Group>(null!);

  const [path] = useState(() =>
    generatePath(
      map,
      [props.position[0], props.position[2]],
      [props.destination[0], props.destination[2]],
    ),
  );

  const nextDestination = useRef(1);
  const previousDirection = useRef<Direction | undefined>(undefined);

  const [x, py, z] = props.position;
  const y = py + 0.07;

  const [movement, api] = useSpring(() => ({
    mx: x,
    mz: z,
    ry: calculateRotation(
      { x, z },
      {
        x: path[nextDestination.current ?? 0]?.x ?? 0,
        y: path[nextDestination.current ?? 0]?.y ?? 0,
      },
    ),
  }));

  useFrame(() => {
    if (nextDestination.current && path[nextDestination.current]) {
      const x = path[nextDestination.current]?.x ?? 0;
      const z = path[nextDestination.current]?.y ?? 0;

      api.start({
        mx: x,
        mz: z,
        config: {
          duration: 600,
          precision: 0.0001,
        },
      });

      let direction: Direction | undefined;

      const dx = path[nextDestination.current - 1]?.x ?? 0;
      const dz = path[nextDestination.current - 1]?.y ?? 0;

      if (x - dx > 0) {
        direction = 'bottom-right';
      } else if (x - dx < -0) {
        direction = 'top-left';
      }
      if (z - dz > 0) {
        direction = 'bottom-left';
      } else if (z - dz < -0) {
        direction = 'top-right';
      }

      if (
        previousDirection.current &&
        direction !== previousDirection.current
      ) {
        if (nextDestination.current && path[nextDestination.current]) {
          const HALF_TURN = Math.PI / 2;

          api.start(() => {
            const prevRX = movement.ry.get();

            let ry = prevRX;

            if (previousDirection.current && direction) {
              const value: Turn = `${previousDirection.current}-${direction}`;

              switch (value) {
                case 'top-left-bottom-left':
                case 'top-right-top-left':
                case 'bottom-right-top-right':
                case 'bottom-left-bottom-right':
                  ry = prevRX + HALF_TURN;
                  break;
                case 'top-left-top-right':
                case 'top-right-bottom-right':
                case 'bottom-left-top-left':
                case 'bottom-right-bottom-left':
                  ry = prevRX - HALF_TURN;
                  break;
                default:
                  console.log('Invalid turn', value);
                  return undefined;
              }
            }

            return {
              ry,
              config: {
                duration: 200,
              },
            };
          });
        }
      } else if (!movement.mx.isAnimating && !movement.mz.isAnimating) {
        nextDestination.current = nextDestination.current + 1;
      }

      if (direction) {
        previousDirection.current = direction;
      }

      if (nextDestination.current === path.length) {
        const { position, destination } = generateCarPositions(map);

        updateCar(props.carId, {
          ...props,
          id: generateUUID(),
          position,
          destination,
        });
      }
    }
  });

  return (
    <>
      <a.group
        ref={carRef}
        position-x={movement.mx}
        position-y={y}
        position-z={movement.mz}
        rotation-y={movement.ry}
        scale={SCALE}
      >
        <group position={[-0.3, 0, -0.3]}>
          <group>
            <Clone
              object={[
                car,
                wheelFrontLeft,
                wheelFrontRight,
                wheelRearLeft,
                wheelRearRight,
              ]}
              receiveShadow
            />
          </group>
        </group>
      </a.group>

      {/* {props.destination && (
        <mesh
          position={[props.destination[0], 0.2, props.destination[2]]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={0.1}
        >
          <circleGeometry />
          <meshBasicMaterial />
        </mesh>
      )} */}
    </>
  );
}
