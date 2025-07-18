import * as THREE from 'three';

export default class CameraManager {
  constructor(app) {
    this.app = app;
    this.camera = app.runtime.camera;
    this.camera.controls = app.runtime.controls;
  }

  setZoom(zoom) {
    this.camera.zoom = zoom; 
  }

  setFar(far) {
    this.camera.far = far;
  }

  setPosition(vector) {
    this.camera.position.copy(vector);
    this.refresh();
  }

  setTarget(vector) {
    this.camera.lookAt(vector);
    if (this.camera.controls) {
      this.camera.controls.target.copy(vector);
      this.camera.controls.update();
    }
    this.refresh();
  }

  refresh() {
    this.camera.up.set(0, 1, 0);
    this.camera.updateProjectionMatrix();
    this.camera.updateMatrixWorld();
    if (this.camera.controls) this.camera.controls.update();
  }

  attach(feature) {
    this.camera.add(feature);
  }




  
}
