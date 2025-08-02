import * as THREE from 'three';

export default class Camera extends THREE.OrthographicCamera {
  constructor(frustrumSize = 50) {
    const aspect = window.innerWidth / window.innerHeight;
    const halfW = aspect * frustrumSize / 2;
    const halfH = frustrumSize / 2;
    super(-halfW, halfW, halfH, -halfH, -1000, 1000);

    this.frustrumSize = frustrumSize;
    this.aspect = aspect;
  }

  resize(width, height) {
    this.aspect = width / height;
    const halfW = this.aspect * this.frustrumSize / 2;
    const halfH = this.frustrumSize / 2;
    this.left = -halfW;
    this.right = halfW;
    this.top = halfH;
    this.bottom = -halfH;
    this.updateProjectionMatrix();
  }
}