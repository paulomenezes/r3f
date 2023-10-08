import { Grid, OrbitControls, Sky, SoftShadows } from '@react-three/drei';
import { Cars } from './models/cars';
import { Map } from './models/map';

export function App() {
  return (
    <>
      <Sky />
      <SoftShadows />

      <OrbitControls makeDefault />
      <directionalLight position={[1, 2, 3]} intensity={3.5} />
      <ambientLight intensity={1.5} />

      <Grid infiniteGrid />

      <Map>
        <Cars />
      </Map>
    </>
  );
}
