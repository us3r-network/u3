/* eslint-disable no-empty */
/* eslint-disable no-underscore-dangle */
import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import createCamera from './components/camera';
import createScene from './components/scene';
import createRenderer from './components/renderer';
import { Cube } from './core/cube';
import Control from './core/control';
import { MouseControl } from './core/mouseControl';
import { TouchControl } from './core/touchControl';
import { RandomControl } from './core/randomControl';

const RANDOM_TIME = 1000;
const setSize = (
  container: Element,
  camera: PerspectiveCamera,
  renderer: WebGLRenderer
) => {
  // Set the camera's aspect ratio
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  // update the size of the renderer AND the canvas
  renderer.setSize(container.clientWidth, container.clientHeight);

  // set the pixel ratio (for mobile devices)
  renderer.setPixelRatio(window.devicePixelRatio);
};

class Rubiks {
  private camera: PerspectiveCamera;

  private scene: Scene;

  private cube: Cube | undefined;

  private renderer: WebGLRenderer;

  private _controls: Control[] = [];

  randomControl: RandomControl;

  public constructor(container: Element) {
    this.camera = createCamera();
    this.scene = createScene('');
    this.renderer = createRenderer();
    container.appendChild(this.renderer.domElement);

    // auto resize
    // window.addEventListener('resize', () => {
    //   setSize(container, this.camera, this.renderer);
    //   this.render();
    // });
    setSize(container, this.camera, this.renderer);
    this.setOrder(3);

    this.startAnimation();
  }

  public setOrder(order: number) {
    this.scene.remove(...this.scene.children);
    if (this._controls.length > 0) {
      this._controls.forEach((control) => control.dispose());
    }

    const cube = new Cube(order);
    this.scene.add(cube);
    this.cube = cube;
    this.render();

    const winW = this.renderer.domElement.clientWidth;
    const winH = this.renderer.domElement.clientHeight;
    const coarseSize = cube.getCoarseCubeSize(this.camera, {
      w: winW,
      h: winH,
    });

    const ratio = Math.max(
      2.2 / (winW / coarseSize),
      2.2 / (winH / coarseSize)
    );
    this.camera.position.z *= ratio;
    this._controls.push(
      new MouseControl(this.camera, this.scene, this.renderer, cube),
      new TouchControl(this.camera, this.scene, this.renderer, cube)
    );

    this.render();
  }

  public randomMove() {
    // mouseDown
    const startX = randomInt(100, 300);
    const startY = 400 - startX;
    const mousedownEvent = new MouseEvent('mousedown', {
      clientX: startX,
      clientY: startY,
    });
    this.randomControl.mousedownHandle(mousedownEvent);

    // mouseMove
    const endX = randomInt(80 + startX, 80 + startX);
    const mousemoveEvent = new MouseEvent('mousemove', {
      clientX: endX,
      clientY: 600 - endX,
      movementX: 0,
      movementY: 0,
    });
    this.randomControl.moveHandle(mousemoveEvent);

    // mouseUp
    const mouseupEvent = new MouseEvent('mouseup', {});
    this.randomControl.mouseupHandle(mouseupEvent);
  }

  /**
   * 打乱
   */
  public disorder(step = 10) {
    if (this.cube) {
      this.randomControl = new RandomControl(
        this.camera,
        this.scene,
        this.renderer,
        this.cube
      );
      const timer = setInterval(() => {
        step -= 1;
        this.randomMove();
        if (step < 0) {
          clearInterval(timer);
        }
      }, RANDOM_TIME);
    }
  }

  /**
   * 还原
   */
  public restore() {
    if (this.cube) {
      this.cube.restore();
      this.render();
    } else {
      console.error('RESTORE_ERROR: this.cube is undefined.');
    }
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
  }

  private startAnimation() {
    const animation = (time: number) => {
      time /= 1000; // convert to seconds
      if (this.cube) {
        if (time < 2) {
          this.cube.position.z = (-1 + time / 2) * 100;
        } else {
          this.cube.position.z = 0;
        }
        const dis = time;
        this.cube.position.y = Math.sin(dis) * 0.3;
      }

      this.render();
      requestAnimationFrame(animation);
    };

    requestAnimationFrame(animation);
  }
}

export default Rubiks;

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomDirection() {
  let x = randomInt(0, 1);
  if (x === 0) x = -1;
  return x;
}
