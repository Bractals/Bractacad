import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { app } from './app.js';

export class Sketch extends THREE.Group {
  constructor(lines, plane) {
    super();
    // planes from cube
    this.planes = app.cube.planes;

    this.sketch = null;
    this.plane = plane;
    this.lines = lines;

    this.init();
  }

  init() {

  }

  add() {
    // for each vertex, if any lines[] vertexes
    // don't overlay existing vertexes of sketch, it's a separate sketch.


  }

  remove() {
    
  }

  build() {
    // called from add() to send to build.js to be turned into 3d object.
  }
}