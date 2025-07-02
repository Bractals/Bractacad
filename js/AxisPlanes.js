import * as THREE from 'three';
import { app } from './app.js';

// Axis planes
export class AxisPlanes extends THREE.Group {
  constructor() {
    super();

    this.size = 1000;
    this.half = this.size/2;

    this.planeGeometry = null;
    this.planeMaterial = null;

    this.xyGroup = null;
    this.zyGroup = null;
    this.xzGroup = null;

    this.xyPlane = null;
    this.zyPlane = null;
    this.xzPlane = null;

    this.outline = null;
    this.xyOutline = null;
    this.zyOutline = null;
    this.xzOutline = null;

    this.groups = {};
    this.planes = {};
    this.planeSet = {};

    this.colours = {};

    this.init();
  }

  init() {

    // Plane colours
    this.colours = {
      xy: 0xFF0000,
      zy: 0xFFFF00,
      xz: 0x0000FF,
    }

    // Plane elements
    this.planeGeometry = new THREE.PlaneGeometry(this.size, this.size);
    this.planeMaterial = this.createPlaneMaterial();

    // Create planes
    this.xyPlane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
    this.zyPlane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
    this.xzPlane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);

    // Set plane names
    this.xyPlane.name = 'XY';
    this.zyPlane.name = 'ZY';
    this.xzPlane.name = 'XZ';

    // plane labels
    this.xyLabel = this.createLabel(this.xyPlane.name);
    this.zyLabel = this.createLabel(this.zyPlane.name);
    this.xzLabel = this.createLabel(this.xzPlane.name);

    // Plane outlines
    this.xyOutline = this.createOutline();
    this.zyOutline = this.createOutline();
    this.xzOutline = this.createOutline();

    // create groups
    this.xyGroup = new THREE.Group();
    this.zyGroup = new THREE.Group();
    this.xzGroup = new THREE.Group();

    // Populate groups
    this.xyGroup.add(this.xyPlane, this.xyLabel, this.xyOutline);
    this.zyGroup.add(this.zyPlane, this.zyLabel, this.zyOutline);
    this.xzGroup.add(this.xzPlane, this.xzLabel, this.xzOutline);

    // To search and loop through
    this.groupMap = {
      xy: { group: this.xyGroup, plane: this.xyPlane, label: this.xyLabel, outline: this.xyOutline },
      zy: { group: this.zyGroup, plane: this.zyPlane, label: this.zyLabel, outline: this.zyOutline },
      xz: { group: this.xzGroup, plane: this.xzPlane, label: this.xzLabel, outline: this.xzOutline },
    }

    this.groups = Object.values(this.groupMap).map(face => face.group);
    this.planes = Object.values(this.groupMap).map(face => face.plane);

    this.groupSet = {
      xy: { pos: [0, this.size/2, 0], rot: [0, -Math.PI, 0] },
      zy: { pos: [0, this.size/2, 0], rot: [0, -Math.PI/2, 0] },
      xz: { pos: [0, 0, 0], rot: [Math.PI/2, 0, 0] },
    }

    for (const key in this.groupMap) {
      const { group } = this.groupMap[key];
      const { plane } = this.groupMap[key];
      const { label } = this.groupMap[key];
      const { outline } = this.groupMap[key];

      // position axis planes
      const { pos, rot } = this.groupSet[key];
      group.position.set(...pos);
      group.rotation.set(...rot);
    
      group.renderOrder = 1;

      this.add(group);
    }


  }

  createPlaneMaterial() {
    return new THREE.MeshBasicMaterial({
    color: 0x808080,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.1,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
    depthWrite: false,
    depthTest: false,
    blending: THREE.NormalBlending
    });
  }

  createOutline() {

    const points = [
      new THREE.Vector3(-this.half, -this.half, 0),
      new THREE.Vector3(-this.half, this.half, 0),
      new THREE.Vector3(this.half, this.half, 0),
      new THREE.Vector3(this.half, -this.half, 0),
      new THREE.Vector3(-this.half, -this.half, 0),
    ];

    const outlineGeometry = new THREE.BufferGeometry().setFromPoints(points);

    const outlineMaterial = new THREE.LineBasicMaterial({
      color: 0x000000,
      depthTest: true,
      depthWrite: true
    });
    return new THREE.LineLoop(outlineGeometry, outlineMaterial);
  }

  createLabel(label) {
    // Pixel density (4 px per world unit)
    const dpi = 4;
    const fontSize = 140;

    const canvasSize = this.size*0.2

    const canvas = document.createElement('canvas');
    canvas.width = canvasSize * dpi;
    canvas.height = canvasSize * dpi;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpi, dpi);
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = '#000000';
    ctx.textBaseline = 'top';
    ctx.fillText(label, 10, 10);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;

    const material = new THREE.MeshBasicMaterial({ 
      map: texture, 
      color: 0x000000,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
      depthWrite: false,
      depthTest: false,
      blending: THREE.NormalBlending
    });

    const scaleInWorldUnits = this.size * 0.15; // set visible size
    const geometry = new THREE.PlaneGeometry(scaleInWorldUnits, scaleInWorldUnits);
    
    const mesh = new THREE.Mesh(geometry, material);

    const pos = this.half*0.8;
    mesh.position.set(-pos, pos, 0);

    // Align the label to face in the direction of the plane's normal
    const up = new THREE.Vector3(0, 0, 1);
    const normal = new THREE.Vector3(0, 0, 1).normalize();
    mesh.quaternion.setFromUnitVectors(up, normal);

    return mesh;
  }

}

const axisPlanes = new AxisPlanes();
export default axisPlanes;