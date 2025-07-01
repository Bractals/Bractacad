import * as THREE from 'three';
import ray from './ray.js';
import { app } from './app.js';

// 2D screen point
const pointer = new THREE.Vector2();

// Keep all state inside raycast.
let raycast = {
  point: null,
  object: null
};


// map of plan objects
let planes;

let intersection;

// Convert world point to local point
let localPoint;

function onPointerMove(e) {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
}

document.addEventListener('pointermove', onPointerMove, false);

export function castRay() {
  // find intersections
  ray.setFromCamera(pointer, app.camera);

  planes = app.cube.planes;

  // all scene children, recursive = false
  const intersects = ray.intersectObjects(app.scene.children, true);
  
  //console.log('Pointer:', pointer);
  if (intersects.length > 0) {

    if (isObjectVisible(intersects[0].object)) {
      intersection = intersects[0];
      raycast.point = intersection.point;
      raycast.object = intersection.object;
    }
  } else {
    raycast.point = null;
    raycast.object = null;
  }
}

function isObjectVisible(obj) {
  while (obj) {
    if (!obj.visible) return false;
    obj = obj.parent;
  }
  return true;
}

export default raycast;