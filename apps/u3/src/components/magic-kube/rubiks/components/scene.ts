import { Color, Scene, ColorRepresentation } from 'three';

const createScene = (bgColor: ColorRepresentation) => {
  const scene = new Scene();

  scene.background = null;

  return scene;
};

export default createScene;
