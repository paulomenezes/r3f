import { Clone, CloneProps } from '@react-three/drei';
import { GroupProps } from '@react-three/fiber';
import { useModel } from '../hooks/use-model';
import { useGameState } from '../store/game';
import { SCALE } from '../utils/const';

export function Street(
  props: Omit<GroupProps, 'children' | 'position'> &
    Omit<CloneProps, 'object'> & {
      position: [number, number, number];
    },
) {
  const map = useGameState((state) => state.map);

  const roads = {
    corner_curved: useModel('road_corner_curved'),
    junction: useModel('road_junction'),
    straight_crossing: useModel('road_straight_crossing'),
    straight: useModel('road_straight'),
    tsplit: useModel('road_tsplit'),
  };

  const [x, z, y] = props.position;

  const hasTop = map[x] != null && map[x][y - 1]?.type === 'road';
  const hasBottom = map[x] != null && map[x][y + 1]?.type === 'road';
  const hasRight = map[x + 1] != null && map[x + 1][y]?.type === 'road';
  const hasLeft = map[x - 1] != null && map[x - 1][y]?.type === 'road';

  let rotate = 0;
  let road: keyof typeof roads = 'straight';

  if (hasTop && hasBottom && hasRight && hasLeft) {
    road = 'junction';
  } else if (hasTop && hasBottom && hasRight) {
    road = 'tsplit';
  } else if (hasTop && hasBottom && hasLeft) {
    rotate = Math.PI;
    road = 'tsplit';
  } else if (hasTop && hasRight && hasLeft) {
    rotate = Math.PI / 2;
    road = 'tsplit';
  } else if (hasBottom && hasRight && hasLeft) {
    rotate = -Math.PI / 2;
    road = 'tsplit';
  } else if (hasTop && hasBottom) {
    rotate = 0;
  } else if (hasRight && hasLeft) {
    rotate = Math.PI / 2;
  } else if (hasTop && hasRight) {
    rotate = Math.PI / 2;
    road = 'corner_curved';
  } else if (hasTop && hasLeft) {
    road = 'corner_curved';
    rotate = Math.PI;
  } else if (hasBottom && hasRight) {
    road = 'corner_curved';
  } else if (hasBottom && hasLeft) {
    road = 'corner_curved';
    rotate = -Math.PI / 2;
  } else if (hasLeft) {
    rotate = Math.PI / 2;
  } else if (hasRight) {
    rotate = -Math.PI / 2;
  }

  return (
    <Clone
      {...props}
      position={[x, z, y]}
      scale={SCALE}
      object={roads[road]}
      rotation={[0, rotate, 0]}
      receiveShadow
    />
  );
}
