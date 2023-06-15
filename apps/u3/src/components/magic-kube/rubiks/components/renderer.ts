import { WebGLRenderer } from 'three';

const createRenderer = () => {
  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setClearColor(0x000000, 0);

  return renderer;
};

export default createRenderer;
