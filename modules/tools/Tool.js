import * as THREE from 'three';

export default class Tool {
  constructor(app) {
    this.app = app;
    this.scene = app.runtime.scene;
    this.raycast = app.runtime.raycast;

    this.enabled = false;
    this.isDrawing = false;
    this.clicks = 0;
    this.activePlane = null;
    this.localStart = null;
  }

  enable() {
    this.enabled = true;
    this.reset();
  }

  disable() {
    this.enabled = false;
    this.reset();
  }

  toggle() {
    this.enabled = !this.enabled;
    this.reset();
  }

  // Child classes must override these
  onPointerMove() {}
  draw() {}
  reset() {}
}
