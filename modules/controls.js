import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function controls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);

  // Settings
  controls.zoomSpeed = 1;
  controls.rotateSpeed = 0.5;

  // Remap mouse buttons
  controls.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.ROTATE
  };

  // Remap touch gestures
  controls.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY
  };

  return controls;
}
