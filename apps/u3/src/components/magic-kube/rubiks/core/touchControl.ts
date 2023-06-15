/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable no-underscore-dangle */
import { PerspectiveCamera, Scene, Vector2, WebGLRenderer } from 'three';

import { Cube } from './cube';
import Control from './control';

export class TouchControl extends Control {
  private lastPos: Vector2 | undefined;

  constructor(
    camera: PerspectiveCamera,
    scene: Scene,
    renderer: WebGLRenderer,
    cube: Cube
  ) {
    super(camera, scene, renderer, cube);

    this.touchStart = this.touchStart.bind(this);
    this.touchMove = this.touchMove.bind(this);
    this.touchEnd = this.touchEnd.bind(this);

    this.init();
  }

  public touchStart(event: TouchEvent) {
    event.preventDefault();

    const { touches } = event;
    if (touches.length === 1) {
      const touch = touches[0];
      this.lastPos = new Vector2(touch.pageX, touch.pageY);
      this.operateStart(touch.pageX, touch.pageY);
    }
  }

  public touchMove(event: TouchEvent) {
    event.preventDefault();
    const { touches } = event;
    if (touches.length === 1 && this.lastPos) {
      const touch = touches[0];
      this.operateDrag(
        touch.pageX,
        touch.pageY,
        touch.pageX - this.lastPos.x,
        touch.pageY - this.lastPos.y
      );
      this.lastPos = new Vector2(touch.pageX, touch.pageY);
    }
  }

  public touchEnd(event: TouchEvent) {
    event.preventDefault();
    this.lastPos = undefined;
    this.operateEnd();
  }

  public init(): void {
    this.domElement.addEventListener('touchstart', this.touchStart);
    this.domElement.addEventListener('touchmove', this.touchMove);
    this.domElement.addEventListener('touchend', this.touchEnd);
  }

  public dispose(): void {
    this.domElement.removeEventListener('touchstart', this.touchStart);
    this.domElement.removeEventListener('touchmove', this.touchMove);
    this.domElement.removeEventListener('touchend', this.touchEnd);
  }
}
