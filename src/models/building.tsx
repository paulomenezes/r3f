import { Clone, CloneProps } from '@react-three/drei';
import { GroupProps } from '@react-three/fiber';
import { useModel } from '../hooks/use-model';
import { useGameState } from '../store/game';
import { SCALE } from '../utils/const';

export function Building(
  props: Omit<GroupProps, 'children' | 'position'> &
    Omit<CloneProps, 'object'> & {
      position: [number, number, number];
      index: number;
    },
) {
  const buildings = [
    useModel('building_A'),
    useModel('building_B'),
    useModel('building_C'),
    useModel('building_D'),
    useModel('building_E'),
    useModel('building_F'),
    useModel('building_G'),
    useModel('building_H'),
  ];

  const map = useGameState((state) => state.map);

  const [x, z, y] = props.position;

  const hasTop = map[x] != null && map[x][y - 1]?.type === 'road';
  const hasBottom = map[x] != null && map[x][y + 1]?.type === 'road';
  const hasRight = map[x + 1] != null && map[x + 1][y]?.type === 'road';
  const hasLeft = map[x - 1] != null && map[x - 1][y]?.type === 'road';

  let rotate = 0;
  if (hasBottom) {
  } else if (hasRight) {
    rotate = Math.PI / 2;
  } else if (hasLeft) {
    rotate = -Math.PI / 2;
  } else if (hasTop) {
    rotate = Math.PI;
  }

  return (
    <Clone
      {...props}
      position={[x, z, y]}
      rotation={[0, rotate, 0]}
      scale={SCALE}
      object={buildings[props.index]}
      castShadow
    />
  );
}
