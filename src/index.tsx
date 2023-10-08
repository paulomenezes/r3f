import { Canvas } from '@react-three/fiber';
import { App } from './App';
import './App.css';
import { Leva } from 'leva';
import { Perf } from 'r3f-perf';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Canvas
      shadows
      orthographic
      camera={{
        zoom: 50,
        near: 0.1,
        far: 200000,
        position: [40, 40, 40],
      }}
    >
      <Perf position="top-left" />
      <App />
    </Canvas>
    <Leva collapsed />
  </StrictMode>,
);
