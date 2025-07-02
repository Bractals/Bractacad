import * as THREE from 'three';
import { app } from './app.js';

// Axis planes
export class Plane extends THREE.Group {
  constructor(size) {
    super();

    this.size = size;

    init();
  }

  init() {

    // Plane elements
    this.planeGeometry = new THREE.PlaneGeometry(this.size, this.size);
    this.planeMaterial = this.createPlaneMaterial();


  }




}

export default Plane;