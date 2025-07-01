import * as THREE from 'three';

export default class Camera extends THREE.OrthographicCamera {
  constructor(defaultOrbit, center, far) {
    const aspect = window.innerWidth / window.innerHeight;
    const frustrumSize = 50;

    const halfW = aspect * frustrumSize / 2;
    const halfH = frustrumSize / 2;

    super(-halfW, halfW, halfH, -halfH, 0.01, far);

    this.defaultOrbit = defaultOrbit;
    this.center = center;


    this.frustrumSize = 50;
    this.aspect = aspect;

    // Apply changes
    this.refresh();
  }

  setPos(vector) {
    this.position.copy(vector);
    this.refresh();
  }

  setTarget(vector) {
    this.lookAt(vector);
    if (this.controls) {
      this.controls.target.copy(vector);
      this.controls.update();
    }
    this.refresh();
  }

  setDefaultPos() {
    this.setPos(this.defaultOrbit);
  }

  setTargetCenter() {
    this.setTarget(this.center);
  }

  refresh() {
    this.updateProjectionMatrix();
    this.updateMatrixWorld();
    if (this.controls) this.controls.update();
  }

  attachControls(controls) {
    this.controls = controls;
  }

  // Optional split screen
  clone() {
    const newCam = new Camera(this.frustrumSize, this.aspect);
    newCam.copy(this, true);
    if (this.controls) newCam.controls = this.controls; // optional
    return newCam;
  }
}
