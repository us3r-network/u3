/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable no-underscore-dangle */
import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';

import { Cube } from './cube';
import Control from './control';

export class MouseControl extends Control {
  constructor(
    camera: PerspectiveCamera,
    scene: Scene,
    renderer: WebGLRenderer,
    cube: Cube
  ) {
    super(camera, scene, renderer, cube);

    this.mousedownHandle = this.mousedownHandle.bind(this);
    this.mouseupHandle = this.mouseupHandle.bind(this);
    this.mousemoveHandle = this.mousemoveHandle.bind(this);
    this.mouseoutHandle = this.mouseoutHandle.bind(this);

    this.init();
  }

  // mousedown 90 155
  // mousemove 281 196 0 0
  // 237 237 1 0

  // 87 212
  // 241 301 0 0

  // 100 265
  // 252 316 0 0

  // 191 174
  // 186 339 0 0

  // 255 149
  // 269 325 0 0

  // 314 137
  // 300 241 0 1
  public mousedownHandle(event: MouseEvent) {
    event.preventDefault();
    console.log('mousedown', event.offsetX, event.offsetY);

    this.operateStart(event.offsetX, event.offsetY);
  }

  public mouseupHandle(event: MouseEvent) {
    event.preventDefault();

    this.operateEnd();
  }

  public mouseoutHandle(event: MouseEvent) {
    event.preventDefault();
    this.operateEnd();
  }

  public mousemoveHandle(event: MouseEvent) {
    event.preventDefault();

    this.operateDrag(
      event.offsetX,
      event.offsetY,
      event.movementX,
      event.movementY
    );
  }

  public init(): void {
    this.domElement.addEventListener('mousedown', this.mousedownHandle);
    this.domElement.addEventListener('mouseup', this.mouseupHandle);
    this.domElement.addEventListener('mousemove', this.mousemoveHandle);
    this.domElement.addEventListener('mouseout', this.mouseoutHandle);
  }

  public dispose(): void {
    this.domElement.removeEventListener('mousedown', this.mousedownHandle);
    this.domElement.removeEventListener('mouseup', this.mouseupHandle);
    this.domElement.removeEventListener('mousemove', this.mousemoveHandle);
    this.domElement.removeEventListener('mouseout', this.mouseoutHandle);
  }
}
