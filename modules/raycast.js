import * as THREE from 'three';
import ray from './ray.js';
import { app } from './app.js';

// 2D screen point
const pointer = new THREE.Vector2();

// Keep all state inside raycast.
let raycast = {
  point: null,
  object: null,
  face: null,
  clicked: false,
  localPoint: null
};

let currIntersection = null;

function onPointerMove(e) {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
}
document.addEventListener('pointermove', onPointerMove, { passive: true });

export function castRay() {
  // find intersections
  ray.setFromCamera(pointer, app.runtime.camera);

  // all scene children, recursive
  const intersects = ray.intersectObjects(app.runtime.scene.children, true);
  
  let validIntersection = null;

  for (const intersect of intersects) {
    if (intersect.object.userData.type === 'ignore') continue;
    if (!isObjectVisible(intersect.object)) continue;
    validIntersection = intersect;
    break;
  }

  if (validIntersection) {
    if (currIntersection !== validIntersection) {
      raycast.point = validIntersection.point;
      raycast.object = validIntersection.object;
      raycast.face = validIntersection.face;
    }

    currIntersection = validIntersection;

    raycast.localPoint = raycast.object.parent.worldToLocal(validIntersection.point.clone());

  } else {
    raycast.point = null;
    raycast.object = null;
    raycast.face = null;
    raycast.localPoint = null;
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