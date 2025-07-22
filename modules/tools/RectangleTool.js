import * as THREE from 'three';
import Tool from './Tool.js';

export default class RectangleTool extends Tool {
  constructor(app) {
    super(app);

    this.geometry = null;

    this.lineMaterial = new THREE.LineBasicMaterial({
      color: 0x0000ff
    });

    this.tempLines = [];

    this.B = null;
    this.C = null;
    this.D = null;

    this.segments = [];

  }

  draw() {
    if (!this.enabled) {
      this.reset();
      return;
    }

    // First click: start rectangle
    if (!this.isDrawing) {
      if (!this.raycast.object || !this.raycast.localPoint) return;
      this.isDrawing = true;
      this.activePlane = this.raycast.object;
      this.start = this.raycast.localPoint.clone();

      // Create preview line
      const geometry = new THREE.BufferGeometry();
      geometry.setFromPoints([this.start, this.start, this.start, this.start, this.start]);
      this.tempLine = new THREE.LineLoop(geometry, this.lineMaterial);
      this.activePlane.add(this.tempLine);
    }
    // Second click: finalize rectangle
    else {
      if (!this.raycast.localPoint) return;
      this.end = this.raycast.localPoint.clone();

      // Compute rectangle corners
      const A = this.start;
      const C = this.end;
      const B = new THREE.Vector3(C.x, A.y, A.z);
      const D = new THREE.Vector3(A.x, C.y, C.z);

      const points = [A, B, C, D, A];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      // Add permanent rectangle
      const permanentLine = new THREE.LineLoop(geometry, this.lineMaterial);
      this.activePlane.add(permanentLine);

      // Remove preview
      if (this.tempLine) {
        this.activePlane.remove(this.tempLine);
        this.tempLine.geometry.dispose();
        this.tempLine = null;
      }
      this.reset();
    }
  }

  onPointerMove() {
    if (!this.enabled || !this.isDrawing || !this.raycast.localPoint || !this.tempLine) return;

    const A = this.start;
    const C = this.raycast.localPoint.clone();
    const B = new THREE.Vector3(C.x, A.y, A.z);
    const D = new THREE.Vector3(A.x, C.y, C.z);

    const points = [A, B, C, D, A];
    this.tempLine.geometry.setFromPoints(points);
    this.tempLine.geometry.attributes.position.needsUpdate = true;
  }

  reset() {
    this.isDrawing = false;
    this.start = null;
    this.end = null;
    this.activePlane = null;

    if (this.tempLine) {
      if (this.tempLine.parent) this.tempLine.parent.remove(this.tempLine);
      this.tempLine.geometry.dispose();
      this.tempLine = null;
    }
  }
}
