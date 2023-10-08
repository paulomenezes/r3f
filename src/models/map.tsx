import { Text } from '@react-three/drei';
import { button, useControls } from 'leva';
import { ReactNode, useEffect } from 'react';
import { useGameState } from '../store/game';
import { MAP_SIZE } from '../utils/const';
import { generateMap } from '../utils/generate-map';
import { Base } from './base';
import { Building } from './building';
import { Street } from './street';

function createNewMap(mapSize?: number) {
  const newMap = generateMap(mapSize ?? MAP_SIZE);

  localStorage.setItem('mapSize', `${mapSize ?? MAP_SIZE}`);
  localStorage.setItem('map', JSON.stringify(newMap));

  return newMap;
}

export function Map({ children }: { children?: ReactNode }) {
  const { map, setMap } = useGameState();

  useEffect(() => {
    const savedMap = localStorage.getItem('map');

    if (savedMap) {
      const newMap = JSON.parse(savedMap);

      setMap(newMap);
    } else {
      const newMap = createNewMap();

      setMap(newMap);
    }
  }, []);

  useControls({
    GenerateMap: button((get) => {
      const newMap = createNewMap(get('MapSize'));

      setMap(newMap);
    }),
    MapSize: {
      value: Number(localStorage.getItem('mapSize') ?? MAP_SIZE),
      step: 2,
      onEditEnd: (value) => {
        const newMap = createNewMap(value);

        setMap(newMap);
      },
    },
  });

  if (map.length === 0) {
    return <Text>Generating map...</Text>;
  }

  return (
    <>
      <group position={[-((map.length - 1) / 2), 0, -((map.length - 1) / 2)]}>
        {map.map((row, rowIndex) => (
          <group key={rowIndex}>
            {row.map((col, colIndex) => (
              <group key={colIndex}>
                {col.type === 'road' ? (
                  <Street position={[rowIndex, 0, colIndex]} />
                ) : col.type === 'none' ? (
                  <Base position={[rowIndex, 0, colIndex]} />
                ) : (
                  <Building
                    position={[rowIndex, 0, colIndex]}
                    index={col.buildingIndex ?? 0}
                  />
                )}
              </group>
            ))}
          </group>
        ))}

        {children}
      </group>
    </>
  );
}
