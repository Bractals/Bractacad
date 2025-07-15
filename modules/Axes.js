import * as THREE from 'three';

// Axes
export class Axes extends THREE.Group {
  constructor(size) {
    super();

    this.size = size;
    this.half = this.size/2;

    this.planeGeometry = null;
    this.planeMaterial = null;

    this.xyGroup = null;
    this.zyGroup = null;
    this.xzGroup = null;

    this.xyPlane = null;
    this.zyPlane = null;
    this.xzPlane = null;

    this.xyLabel = null;
    this.xyLabel = null;
    this.xyLabel = null;

    this.axisLabelSize = this.size * 0.1;
    this.labelScale = null;

    this.xLabel = null;
    this.yLabel = null;
    this.zLabel = null;

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
    this.xyPlane = new THREE.Mesh(this.planeGeometry, this.planeMaterial.clone());
    this.zyPlane = new THREE.Mesh(this.planeGeometry, this.planeMaterial.clone());
    this.xzPlane = new THREE.Mesh(this.planeGeometry, this.planeMaterial.clone());

    this.xyPlane.userData.type = 'axisPlane';
    this.zyPlane.userData.type = 'axisPlane';
    this.xzPlane.userData.type = 'axisPlane';

    // Set plane names
    this.xyPlane.name = 'XY';
    this.zyPlane.name = 'ZY';
    this.xzPlane.name = 'XZ';

    // plane labels
    this.xyLabel = this.createPlaneLabel(this.xyPlane.name);
    this.zyLabel = this.createPlaneLabel(this.zyPlane.name);
    this.xzLabel = this.createPlaneLabel(this.xzPlane.name);

    // Plane outlines
    this.xyOutline = this.createOutline();
    this.zyOutline = this.createOutline();
    this.xzOutline = this.createOutline();

    const fullOffset = this.size + this.axisLabelSize + this.size * 0.1;
    const halfOffset = this.size/2 + this.axisLabelSize + this.size/2 * 0.1;

    // Axis labels
    this.xLabel = this.createAxisLabel('X', new THREE.Vector3(halfOffset, 0, 0));
    this.yLabel = this.createAxisLabel('Y', new THREE.Vector3(0, fullOffset, 0));
    this.zLabel = this.createAxisLabel('Z', new THREE.Vector3(0, 0, halfOffset));

      
    // Axis labels
    this.labels = {
      x: this.xLabel,
      y: this.yLabel,
      z: this.zLabel
    }

    // Add axis labels to object
    this.add(this.xLabel, this.yLabel, this.zLabel);

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
      xy: { group: this.xyGroup, plane: this.xyPlane, label: this.xyLabel, outline: this.xyOutline, axis: this.xLabel },
      zy: { group: this.zyGroup, plane: this.zyPlane, label: this.zyLabel, outline: this.zyOutline, axis: this.yLabel },
      xz: { group: this.xzGroup, plane: this.xzPlane, label: this.xzLabel, outline: this.xzOutline, axis: this.zLabel },
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
    depthWrite: true,
    depthTest: true,
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

  createPlaneLabel(label) {
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

    // render on top
    mesh.renderOrder = 999;

    return mesh;
  }

  createAxisLabel(label, position) {
    const canvas = document.createElement('canvas');
    canvas.style.backgroundColor = 'transparent';
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Clear fully with alpha = 0
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = 'bold 80px Arial';
    ctx.fillStyle = "rgb(120, 120, 120)";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat;
    texture.premultiplyAlpha = false; // Important
    texture.needsUpdate = true;

    const material = new THREE.SpriteMaterial({ 
      map: texture,
      transparent: true,
      opacity: 1,
      depthWrite: true,
      depthTest: false
    });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(this.axisLabelSize, this.axisLabelSize, 1); // Adjust size as needed
    sprite.position.copy(position);
    
    return sprite;
  }

  // Axis label scaling
  scaleLabels(camera) {
    this.labelScale = this.axisLabelSize / camera;

    for (const key in this.labels) {
      this.labels[key].scale.set(this.axisLabelSize, this.axisLabelSize, this.axisLabelSize);
    }
  }

}

export default Axes;