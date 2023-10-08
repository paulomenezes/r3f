import { Clone, CloneProps } from '@react-three/drei';
import { GroupProps } from '@react-three/fiber';
import { useModel } from '../hooks/use-model';
import { SCALE } from '../utils/const';

export function Base(
  props: Omit<GroupProps, 'children' | 'position'> &
    Omit<CloneProps, 'object'> & {
      position: [number, number, number];
    },
) {
  const base = useModel('base');

  const [x, y, z] = props.position;

  return (
    <Clone
      {...props}
      position={[x, y, z]}
      scale={SCALE}
      object={base}
      receiveShadow
    />
  );
}
