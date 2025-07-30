import * as THREE from 'three';

// Star
export default class Star extends THREE.Group {
  constructor(size) {
    super();

    this.size = size;
    this.half = this.size/2;

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
      xy: 0xFF0000, // Red
      zy: 0x00FF00, // Green
      xz: 0x0000FF, // Blue
    }

    // Plane elements
    const planeGeometry = new THREE.PlaneGeometry(this.size, this.size);

    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0x808080,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
      depthWrite: true,
      depthTest: true,
      blending: THREE.NormalBlending
    });

    // Create planes
    this.xyPlane = new THREE.Mesh(planeGeometry.clone(), planeMaterial.clone());
    this.zyPlane = new THREE.Mesh(planeGeometry.clone(), planeMaterial.clone());
    this.xzPlane = new THREE.Mesh(planeGeometry.clone(), planeMaterial.clone());

    this.xyPlane.userData.type = 'axisPlane';
    this.zyPlane.userData.type = 'axisPlane';
    this.xzPlane.userData.type = 'axisPlane';

    // Set plane names
    this.xyPlane.name = 'xy';
    this.zyPlane.name = 'zy';
    this.xzPlane.name = 'xz';

    // Plane outlines
    this.xyOutline = this.createOutline();
    this.zyOutline = this.createOutline();
    this.xzOutline = this.createOutline();

    // create groups
    this.xyGroup = new THREE.Group();
    this.zyGroup = new THREE.Group();
    this.xzGroup = new THREE.Group();

    // Populate groups
    this.xyGroup.add(this.xyPlane, this.xyOutline);
    this.zyGroup.add(this.zyPlane, this.zyOutline);
    this.xzGroup.add(this.xzPlane, this.xzOutline);

    // To search and loop through
    this.groupMap = {
      xy: { group: this.xyGroup, plane: this.xyPlane, outline: this.xyOutline, axis: this.xLabel },
      zy: { group: this.zyGroup, plane: this.zyPlane, outline: this.zyOutline, axis: this.yLabel },
      xz: { group: this.xzGroup, plane: this.xzPlane, outline: this.xzOutline, axis: this.zLabel },
    }

    this.groups = Object.values(this.groupMap).map(face => face.group);
    this.planes = Object.values(this.groupMap).map(face => face.plane);

    this.groupSet = {
      xy: { pos: [0, 0, 0], rot: [0, -Math.PI, 0] },
      zy: { pos: [0, 0, 0], rot: [0, -Math.PI/2, 0] },
      xz: { pos: [0, 0, 0], rot: [Math.PI/2, 0, 0] },
    }

    for (const key in this.groupMap) {
      const { group } = this.groupMap[key];

      // position axis planes
      const { pos, rot } = this.groupSet[key];
      group.position.set(...pos);
      group.rotation.set(...rot);
    
      group.renderOrder = 1;

      this.add(group);
    }

    this.name = "star";
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
      transparent: false,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
      depthWrite: false,
      depthTest: true,
      blending: THREE.NormalBlending
    });

    const mesh = new THREE.LineLoop(outlineGeometry, outlineMaterial);

    return mesh;
  }





}