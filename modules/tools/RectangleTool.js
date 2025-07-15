import * as THREE from 'three';
import Tool from './Tool.js';

export default class RectangleTool extends Tool {
  constructor(app) {
    super(app);
    this.tempLines = [];

    this.lineMaterial = new THREE.LineBasicMaterial({
      color: 0x0000ff
    });
  }

  draw() {
    if (!this.enabled || !this.raycast.plane) {
      this.reset();
      return;
    }

    if (this.clicks === 0) {
      this.clicks++;
      this.isDrawing = true;
      this.activePlane = this.raycast.plane;
      this.localStart = this.activePlane.worldToLocal(this.raycast.point.clone());

      for (let i = 0; i < 4; i++) {
        const geometry = new THREE.BufferGeometry().setFromPoints([
          this.localStart,
          this.localStart.clone()
        ]);
        const line = new THREE.Line(geometry, this.lineMaterial);
        this.activePlane.add(line);
        this.tempLines.push(line);
      }

    } else if (this.clicks === 1 && this.activePlane === this.raycast.plane) {
      // Final position could be stored or converted to shape later
      this.clicks = 0;
      this.isDrawing = false;
    }
  }

  onPointerMove() {
    if (!this.enabled || !this.isDrawing || !this.activePlane) return;

    const end = this.raycast.localPoint;
    const A = this.localStart;
    const B = new THREE.Vector3(end.x, A.y, A.z);
    const C = new THREE.Vector3(end.x, end.y, end.z);
    const D = new THREE.Vector3(A.x, end.y, end.z);

    const points = [
      [A, B],
      [B, C],
      [C, D],
      [D, A]
    ];

    for (let i = 0; i < 4; i++) {
      this.tempLines[i].geometry.setFromPoints(points[i]);
      this.tempLines[i].geometry.attributes.position.needsUpdate = true;
    }
  }

  reset() {
    this.isDrawing = false;
    this.clicks = 0;

    this.tempLines.forEach(line => {
      if (this.activePlane) this.activePlane.remove(line);
      line.geometry.dispose();
    });

    this.tempLines = [];
    this.activePlane = null;
  }
}
