import * as THREE from 'three';

export default class Camera extends THREE.OrthographicCamera {
  constructor() {
    const aspect = window.innerWidth / window.innerHeight;

    let frustrumSize = 50;

    const halfW = aspect * frustrumSize / 2;
    const halfH = frustrumSize / 2;

    super(-halfW, halfW, halfH, -halfH);

    this.frustrumSize = frustrumSize;

    this.aspect = aspect;
  }




  
}
