import * as THREE from 'three';

export default class ControlsManager {
  constructor(app) {
    this.app = app;
    this.controls = app.runtime.controls;

    this.init();
  }

  init() {
    this.enablePan(false);
    this.enableRotate(true);
  }

  // Space key toggles pan mode
  spaceDown(down) {
    this.enablePan(down);
    // debug clipping when panning and resetting alot
    console.log(this.app.runtime.camera.position);
    console.log(this.app.runtime.camera.far);
  }

  setMouseButton(button, action) {
    this.controls.mouseButtons[button] = action;
  }

  setZoomSpeed(speed) {
    this.controls.zoomSpeed = speed;
  }

  setRotateSpeed(speed) {
    this.controls.rotateSpeed = speed;
  }

  enablePan(enabled) {
    this.controls.enablePan = enabled;
  }

  enableZoom(enabled) {
    this.controls.enableZoom = enabled;
  }

  enableRotate(enabled) {
    this.controls.enableRotate = enabled;
  }

  update() {
    this.controls.update();
  }




  
}
