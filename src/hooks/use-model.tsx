import { useLoader } from '@react-three/fiber';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

export function useModel(name: string) {
  const material = useLoader(MTLLoader, `obj/${name}.mtl`);
  const model = useLoader(OBJLoader, `obj/${name}.obj`, (loader) => {
    material.preload();
    loader.setMaterials(material);
  });

  return model;
}
