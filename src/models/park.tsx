import { Clone, CloneProps, Text } from '@react-three/drei';
import { GroupProps } from '@react-three/fiber';
import { useModel } from '../hooks/use-model';
import { useGameState } from '../store/game';
import { MapCell } from '../types/map-cell';
import { SCALE } from '../utils/const';

export function Park(
  props: Omit<GroupProps, 'children' | 'position'> &
    Omit<CloneProps, 'object'> & {
      position: [number, number, number];
      mapCell?: MapCell;
    },
) {
  const map = useGameState((state) => state.map);
  // const base = useModel('park_base');

  const singleParks = [
    'base',
    'baseDecoratedBushes',
    'baseDecoratedTrees',
    'roadJunction',
    'roadJunctionDecoratedA',
    'roadJunctionDecoratedB',
    'roadJunctionDecoratedC',
  ] as const;

  const complexPark = [
    'base',
    'baseDecoratedBushes',
    'baseDecoratedTrees',
  ] as const;

  const straightParks = [
    'roadStraight',
    'roadStraightDecoratedA',
    'roadStraightDecoratedB',
  ] as const;

  const parks = {
    base: useModel('park_base'),
    baseDecoratedBushes: useModel('park_base_decorated_bushes'),
    baseDecoratedTrees: useModel('park_base_decorated_trees'),
    roadCorner: useModel('park_road_corner'),
    roadCornerDecorated: useModel('park_road_corner_decorated'),
    roadJunction: useModel('park_road_junction'),
    roadJunctionDecoratedA: useModel('park_road_junction_decorated_A'),
    roadJunctionDecoratedB: useModel('park_road_junction_decorated_B'),
    roadJunctionDecoratedC: useModel('park_road_junction_decorated_C'),
    roadStraight: useModel('park_road_straight'),
    roadStraightDecoratedA: useModel('park_road_straight_decorated_A'),
    roadStraightDecoratedB: useModel('park_road_straight_decorated_B'),
    roadTsplit: useModel('park_road_tsplit'),
    roadTsplitDecorated: useModel('park_road_tsplit_decorated'),
    wallEntry: useModel('park_wall_entry'),
    wallEntryDecorated: useModel('park_wall_entry_decorated'),
    wallInnerCorner: useModel('park_wall_innerCorner'),
    wallInnerCornerDecorated: useModel('park_wall_innerCorner_decorated'),
    wallOuterCorner: useModel('park_wall_outerCorner'),
    wallOuterCornerDecorated: useModel('park_wall_outerCorner_decorated'),
    wallStraight: useModel('park_wall_straight'),
    wallStraightDecorated: useModel('park_wall_straight_decorated'),
  };

  const [x, z, y] = props.position;

  const hasTopRoad =
    (map[x] != null && map[x][y - 1]?.type === 'road') ||
    props.mapCell?.isMapEdgeTop;
  const hasBottomRoad =
    (map[x] != null && map[x][y + 1]?.type === 'road') ||
    props.mapCell?.isMapEdgeBottom;
  const hasRightRoad =
    (map[x + 1] != null && map[x + 1][y]?.type === 'road') ||
    props.mapCell?.isMapEdgeRight;
  const hasLeftRoad =
    (map[x - 1] != null && map[x - 1][y]?.type === 'road') ||
    props.mapCell?.isMapEdgeLeft;

  const hasTopRoadPark = map[x] != null && map[x][y - 1]?.parkType === 'road';
  const hasBottomRoadPark =
    map[x] != null && map[x][y + 1]?.parkType === 'road';
  const hasRightRoadPark =
    map[x + 1] != null && map[x + 1][y]?.parkType === 'road';
  const hasLeftRoadPark =
    map[x - 1] != null && map[x - 1][y]?.parkType === 'road';

  let rotate = 0;
  let park: keyof typeof parks = 'base';

  if (props.mapCell?.parkType === 'single') {
    park = singleParks[props.mapCell?.buildingIndex ?? 0];
  } else if (props.mapCell?.parkType === 'vertical') {
    park = straightParks[props.mapCell?.buildingIndex ?? 0];

    if (hasBottomRoad && hasLeftRoad && hasRightRoad) {
      park = 'wallEntryDecorated';
    } else if (hasTopRoad && hasLeftRoad && hasRightRoad) {
      rotate = Math.PI;
      park = 'wallEntryDecorated';
    }
  } else if (props.mapCell?.parkType === 'horizontal') {
    rotate = -Math.PI / 2;
    park = straightParks[props.mapCell?.buildingIndex ?? 0];

    if (hasLeftRoad && hasTopRoad && hasBottomRoad) {
      park = 'wallEntryDecorated';
    } else if (hasRightRoad && hasTopRoad && hasBottomRoad) {
      rotate = Math.PI / 2;
      park = 'wallEntryDecorated';
    }
  } else if (props.mapCell?.parkType === 'L') {
    if (hasTopRoad && hasBottomRoad) {
      rotate = -Math.PI / 2;
      park = straightParks[props.mapCell?.buildingIndex ?? 0];
    } else if (hasLeftRoad && hasRightRoad) {
      park = straightParks[props.mapCell?.buildingIndex ?? 0];
    } else {
      if (hasTopRoad) {
        rotate = -Math.PI / 2;
      } else if (hasLeftRoad) {
        rotate = Math.PI / 2;
      } else {
        rotate = Math.PI;
      }

      park = 'roadCornerDecorated';
    }
  } else if (props.mapCell?.parkType === 'square' && props.mapCell.withWalls) {
    if (hasTopRoad && hasBottomRoad && hasRightRoad && hasLeftRoad) {
      park = 'roadJunctionDecoratedC';
    } else if (hasTopRoad && hasBottomRoad && hasRightRoad) {
      rotate = -Math.PI / 2;
      park = 'roadStraightDecoratedA';
    } else if (hasTopRoad && hasBottomRoad && hasLeftRoad) {
      rotate = -Math.PI / 2;
      park = 'roadStraightDecoratedA';
    } else if (hasTopRoad && hasRightRoad && hasLeftRoad) {
      park = 'wallEntryDecorated';
      rotate = Math.PI;
    } else if (hasBottomRoad && hasRightRoad && hasLeftRoad) {
      park = 'wallEntryDecorated';
    } else if (hasTopRoad && hasBottomRoad) {
      rotate = -Math.PI / 2;
      park = 'roadStraightDecoratedB';
    } else if (hasRightRoad && hasLeftRoad) {
      park = 'roadStraightDecoratedA';
    } else if (hasTopRoad && hasRightRoad) {
      rotate = Math.PI / 2;
      park = 'wallOuterCornerDecorated';
    } else if (hasTopRoad && hasLeftRoad) {
      park = 'wallOuterCornerDecorated';
      rotate = Math.PI;
    } else if (hasBottomRoad && hasRightRoad) {
      park = 'wallOuterCornerDecorated';
    } else if (hasBottomRoad && hasLeftRoad) {
      park = 'wallOuterCornerDecorated';
      rotate = -Math.PI / 2;
    } else if (hasLeftRoad) {
      park = 'wallStraight';
      rotate = Math.PI;
    } else if (hasRightRoad) {
      park = 'wallStraight';
    } else if (hasBottomRoad) {
      rotate = -Math.PI / 2;
      park = 'wallStraight';
    } else if (hasTopRoad) {
      park = 'wallStraight';
      rotate = Math.PI / 2;
    }
  } else if (props.mapCell?.parkType === 'road') {
    if (
      hasTopRoadPark &&
      hasBottomRoadPark &&
      hasRightRoadPark &&
      hasLeftRoadPark
    ) {
      park = 'roadJunctionDecoratedB';
    } else if (hasTopRoadPark && hasBottomRoadPark && hasRightRoadPark) {
      park = 'roadTsplitDecorated';
      rotate = Math.PI / 2;
    } else if (hasTopRoadPark && hasRightRoadPark && hasLeftRoadPark) {
      park = 'roadTsplitDecorated';
      rotate = Math.PI;
    } else if (hasRightRoadPark && hasBottomRoadPark && !hasLeftRoadPark) {
      park = 'roadCornerDecorated';
    } else if (hasTopRoadPark && hasBottomRoadPark && hasLeftRoadPark) {
      park = 'roadTsplitDecorated';
      rotate = -Math.PI / 2;
    } else if (hasLeftRoadPark && hasRightRoad && hasTopRoadPark) {
      park = 'roadCornerDecorated';
      rotate = -Math.PI;
    } else if (hasLeftRoadPark && hasRightRoad && hasBottomRoadPark) {
      park = 'roadCornerDecorated';
      rotate = -Math.PI / 2;
    } else if (hasLeftRoadPark && hasRightRoadPark && hasBottomRoadPark) {
      park = 'roadTsplitDecorated';
    } else if (hasTopRoadPark && hasRightRoadPark) {
      park = 'roadCornerDecorated';
      rotate = Math.PI / 2;
    } else if (hasRightRoadPark && hasLeftRoad) {
      if (props.mapCell.withWalls) {
        park = 'wallEntryDecorated';
      } else {
        park = 'roadStraight';
      }
      rotate = -Math.PI / 2;
    } else if (hasLeftRoadPark && hasRightRoad) {
      if (props.mapCell.withWalls) {
        park = 'wallEntryDecorated';
      } else {
        park = 'roadStraight';
      }
      rotate = Math.PI / 2;
    } else if (hasBottomRoadPark && hasTopRoad) {
      if (props.mapCell.withWalls) {
        park = 'wallEntryDecorated';
      } else {
        park = 'roadStraight';
      }
      rotate = Math.PI;
    } else if (hasBottomRoad && hasTopRoadPark) {
      if (props.mapCell.withWalls) {
        park = 'wallEntryDecorated';
      } else {
        park = 'roadStraight';
      }
    } else if (hasLeftRoadPark && hasRightRoadPark) {
      rotate = Math.PI / 2;
      park = 'roadStraight';
    } else if (hasLeftRoadPark) {
      park = 'roadStraightDecoratedB';
      rotate = Math.PI / 2;
    } else if (hasTopRoadPark) {
      park = 'roadStraightDecoratedA';
    } else {
      park = 'roadStraight';
    }
  } else if (props.mapCell?.parkType === 'complex') {
    park = complexPark[props.mapCell?.buildingIndex ?? 0];
  }

  return (
    <>
      <Clone
        {...props}
        position={[x, z, y]}
        rotation={[0, rotate, 0]}
        scale={SCALE}
        object={parks[park]}
        receiveShadow
      />

      {/* <Text
        position={[x, 0.2, y]}
        fontSize={0.2}
        color={'black'}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {x} - {y}
      </Text> */}

      {/* <Text
        position={[x, 0.2, y]}
        fontSize={0.2}
        color={'black'}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {props.mapCell?.parkType}
      </Text> */}
    </>
  );
}
