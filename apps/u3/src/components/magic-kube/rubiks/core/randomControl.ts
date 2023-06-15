/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable no-underscore-dangle */
import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';

import { Cube } from './cube';
import Control from './control';

export class RandomControl extends Control {
  couldRandom: boolean;

  constructor(
    camera: PerspectiveCamera,
    scene: Scene,
    renderer: WebGLRenderer,
    cube: Cube
  ) {
    super(camera, scene, renderer, cube);
    this.couldRandom = true;
    this.init();
  }

  public mousedownHandle(event: MouseEvent) {
    event.preventDefault();
    if (this.couldRandom) {
      this.operateStart(event.offsetX, event.offsetY);
    }
  }

  public mouseupHandle(event: MouseEvent) {
    event.preventDefault();
    if (this.couldRandom) {
      this.operateEnd();
    }
  }

  public moveHandle(event: MouseEvent) {
    event.preventDefault();
    if (this.couldRandom) {
      this.operateDrag(
        event.offsetX,
        event.offsetY,
        event.movementX,
        event.movementY
      );
    }
  }

  public init(): void {
    this.domElement.addEventListener('mouseenter', () => {
      this.couldRandom = false;
    });
  }

  public dispose(): void {}
}
