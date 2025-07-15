import * as THREE from 'three';
import Tool from './Tool.js';

export default class LineTool extends Tool {
  constructor(app) {
    super(app);

    // Snap interval
    this.gridSize = 1;

    this.lineMaterial = new THREE.LineBasicMaterial({
      color: 0x000000,
      polygonOffset: true,
      polygonOffsetFactor: 10,
      polygonOffsetUnits: 1
    });

    this.tempLine = null;
    this.points = [];

    this.finishSketch = false;

    this.activePlane = app.runtime.raycast.plane;
  }

  onPointerMove() {
    if (
      !this.enabled ||
      !this.isDrawing ||
      !this.activePlane ||
      !this.tempLine ||
      !this.raycast.point
    ) return;

    let localPoint = this.activePlane.worldToLocal(this.raycast.point.clone());
    localPoint = this.snapToGrid(localPoint);

    // Update the last point to follow mouse
    const updatedPoints = [...this.points, localPoint];
    this.tempLine.geometry.dispose();
    this.tempLine.geometry = new THREE.BufferGeometry().setFromPoints(updatedPoints);

  }

  draw() {

    if (!this.enabled || !this.raycast.object) {
      // if clicked out of plane to cancel preview,
      // still finish what lines were drawn.
      if (this.activePlane) {
        this.finalise(this.finishSketch);
      }
      this.reset();
      return;
    }

    // get hit object from raycast
    const intersected = this.raycast.object;

    // if object is not a draw plane
    if (!intersected.userData.isDrawPlane) {
      this.reset();
      return;
    }

    const clickedPlane = intersected;

    if (clickedPlane !== this.activePlane && this.isDrawing) {
      // If we clicked a different plane, finalise the current line
      this.finishSketch = true;
      this.finalise(this.finishSketch);
      this.reset();
      this.finishSketch = false;
      return;
    }

    let localPoint = clickedPlane.worldToLocal(this.raycast.point.clone());
    localPoint = this.snapToGrid(localPoint);

    if (!this.isDrawing) {
      // Start new polyline
      this.isDrawing = true;
      this.activePlane = clickedPlane;
      this.points = [localPoint];

      const geometry = new THREE.BufferGeometry().setFromPoints([localPoint, localPoint.clone()]);
      this.tempLine = new THREE.Line(geometry, this.lineMaterial);
      this.activePlane.add(this.tempLine);

    } else if (clickedPlane === this.activePlane) {
      // Add another segment
      this.points.push(localPoint);

      const updatedPoints = [...this.points, localPoint.clone()];
      this.tempLine.geometry.dispose();
      this.tempLine.geometry = new THREE.BufferGeometry().setFromPoints(updatedPoints);

      // extrude in build.js if we have at least 2 points
      if (this.points.length > 1) {
        this.tempLine.geometry.setDrawRange(0, this.points.length);
        this.finishSketch = true;
        this.finalise();
        this.finishSketch = false;
      }

      if (this.points[0].distanceTo(this.points[this.points.length - 1]) < 1e-5) {
        this.reset();
        console.log("reset drawing");
      }
    }
  }

  addLine() {
    this.build.addSketch(finalLine, this.activePlane, this.finishSketch);
  }

  // Call this manually to end drawing and store the final line
  finalise() {
    if (this.tempLine && this.points.length > 1) {
      const finalGeometry = new THREE.BufferGeometry().setFromPoints(this.points);
      const finalLine = new THREE.Line(finalGeometry, this.lineMaterial.clone());
      this.build.addSketch(finalLine, this.activePlane, this.finishSketch);
    }
  }

  reset() {
    this.isDrawing = false;
    this.points = [];                                                   

    if (this.tempLine && this.activePlane) {
      this.activePlane.remove(this.tempLine);
      this.tempLine.geometry.dispose();
    }

    this.tempLine = null;
    this.activePlane = null;
  }

  get currentGridSpacing() {
    return this.cube.gridSpacing;
  }

  // Snap line vertices to grid points
  snapToGrid(vector) {
    const spacing = this.currentGridSpacing;
    const snapped = vector.clone();
    snapped.x = Math.round(snapped.x / spacing) * spacing;
    snapped.y = Math.round(snapped.y / spacing) * spacing;
    snapped.z = Math.round(snapped.z / spacing) * spacing;
    return snapped;
  }
}
