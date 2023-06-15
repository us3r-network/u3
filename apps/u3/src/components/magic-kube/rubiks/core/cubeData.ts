/* eslint-disable no-underscore-dangle */
import { Vector3 } from 'three';
import { randomData } from './randomData';

type ColorRepresentation = string | number;

export interface CubeElement {
  color: ColorRepresentation;
  pos: Vector3;
  normal: Vector3;
  withLogo?: boolean;
}

type CubeColor = [
  ColorRepresentation,
  ColorRepresentation,
  ColorRepresentation,
  ColorRepresentation,
  ColorRepresentation,
  ColorRepresentation
];

class CubeData {
  /**
   * 魔方阶级
   */
  public cubeOrder: number;

  /**
   * 魔方颜色：top、bottom、left、right、front、back
   */
  private colors: CubeColor;

  private _size = 1;

  public get elementSize() {
    return this._size;
  }

  public elements: CubeElement[] = [];

  public constructor(
    cubeOrder = 3,
    colors: CubeColor = [
      // '#E54D21',
      // '#836C78',
      // '#ffffff',
      // '#F6CF3A',
      // '#A21F30',
      // '#643981',
      // ------------
      // '#0046FF',
      // '#CDFF00',
      // '#D03DCA',
      // '#9DFBC7',
      // '#5904C6',
      // '#387CFF',
      // ------------
      '#0046FF',
      '#8F00FF',
      '#D03DCA',
      '#0500FF',
      '#5904C6',
      '#0085FF',
    ]
  ) {
    this.cubeOrder = cubeOrder;
    this.colors = colors;
    this.initElements();
  }

  /**
   * 初始化数据
   * @param localDataFirst 是否从 localStorage 读取数据
   */
  private initElements(localDataFirst = true) {
    if (localDataFirst && localStorage) {
      this.elements = this.getLocalData();
    }

    if (this.elements.length === this.cubeOrder * this.cubeOrder * 6) {
      return;
    }

    this.initialFinishData();
  }

  /**
   * 创建复原的数据
   */
  public initialFinishData() {
    this.elements = [];
    const border = (this.cubeOrder * this._size) / 2 - 0.5;

    // top and bottom
    for (let x = -border; x <= border; x++) {
      for (let z = -border; z <= border; z++) {
        this.elements.push({
          color: this.colors[0],
          pos: new Vector3(x, border + this._size * 0.5, z),
          normal: new Vector3(0, 1, 0),
          // withLogo: x === 0 && z === 0,
        });

        this.elements.push({
          color: this.colors[1],
          pos: new Vector3(x, -border - this._size * 0.5, z),
          normal: new Vector3(0, -1, 0),
        });
      }
    }

    // left and right
    for (let y = -border; y <= border; y++) {
      for (let z = -border; z <= border; z++) {
        this.elements.push({
          color: this.colors[2],
          pos: new Vector3(-border - this._size * 0.5, y, z),
          normal: new Vector3(-1, 0, 0),
          // withLogo: y === 0 && z === 0,
        });

        this.elements.push({
          color: this.colors[3],
          pos: new Vector3(border + this._size * 0.5, y, z),
          normal: new Vector3(1, 0, 0),
        });
      }
    }

    // front and back
    for (let x = -border; x <= border; x++) {
      for (let y = -border; y <= border; y++) {
        this.elements.push({
          color: this.colors[4],
          pos: new Vector3(x, y, border + this._size * 0.5),
          normal: new Vector3(0, 0, 1),
          // withLogo: x === 0 && y === 0,
        });

        this.elements.push({
          color: this.colors[5],
          pos: new Vector3(x, y, -border - this._size * 0.5),
          normal: new Vector3(0, 0, -1),
        });
      }
    }

    // this.elements.forEach((ele) => console.log(ele.pos));
  }

  /**
   * 保存数据至 localStorage
   */
  public saveDataToLocal() {
    const data = JSON.stringify(this.elements);

    if (localStorage) {
      localStorage.setItem(`${this.cubeOrder}-Rubik`, data);
    }
  }

  /**
   * 从 localStorage 读取数据
   * @returns
   */
  public getLocalData() {
    const r = randomInt(0, randomData.length - 1);
    let parseData: {
      color: ColorRepresentation;
      pos: {
        x: number;
        y: number;
        z: number;
      };
      normal: {
        x: number;
        y: number;
        z: number;
      };
    }[] = [];
    if (localStorage) {
      const data = localStorage.getItem(`${this.cubeOrder}-Rubik`);
      if (data) {
        parseData = JSON.parse(data);
      }
    }

    parseData.forEach((item) => {
      item.normal = new Vector3(item.normal.x, item.normal.y, item.normal.z);
      item.pos = new Vector3(item.pos.x, item.pos.y, item.pos.z);
    });

    return parseData as CubeElement[];
  }
}

export default CubeData;

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
