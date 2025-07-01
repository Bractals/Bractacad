import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function createControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);

  controls.enableRotate = true;
  controls.enablePan = true;
  controls.enableZoom = true;

  // Settings
  controls.zoomSpeed = 1;
  controls.rotateSpeed = 0.5;

  // Remap mouse buttons
  controls.mouseButtons = {
    LEFT: null,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.ROTATE
  };

  // Remap touch gestures
  controls.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.PAN
  };

  return controls;
}
