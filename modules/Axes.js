import * as THREE from 'three';

export class Axes extends THREE.Group {
  constructor() {
    super();

    this.size = 100; // Default size of axes
    this.labelSize = this.size * 0.025; // Size of axis labels
    this.labelScale = this.labelSize;
    this.Offset = this.size + this.labelSize * 4; // Offset for labels from axis lines

    this.colours = {};

    this.xLabel = null;
    this.yLabel = null;
    this.zLabel = null;

    this.xAxis = null;
    this.yAxis = null;
    this.zAxis = null;

    this.labelMap = {};

    this.labelGroup = new THREE.Group();
    this.axisGroup = new THREE.Group();

    this.init();
  }

  init() {

    this.colours = {
      x: 0xFF0000, // Red for X plane
      y: 0x00FF00, // Green for Y plane
      z: 0x0000FF, // Blue for Z plane
    };

    const createAxisLineMaterial = (color) => new THREE.LineBasicMaterial({
      color: color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
      depthWrite: false,
      depthTest: false,
      blending: THREE.NormalBlending
    });

    const xAxisGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-this.size, 0, 0),
      new THREE.Vector3(this.size, 0, 0)
    ]);
    const yAxisGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -this.size, 0),
      new THREE.Vector3(0, this.size, 0)
    ]);
    const zAxisGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, -this.size),
      new THREE.Vector3(0, 0, this.size)
    ]);
    this.xAxis = new THREE.Line(xAxisGeometry, createAxisLineMaterial(this.colours.x));
    this.yAxis = new THREE.Line(yAxisGeometry, createAxisLineMaterial(this.colours.y));
    this.zAxis = new THREE.Line(zAxisGeometry, createAxisLineMaterial(this.colours.z));

    // Add axis lines to axis group
    this.axisGroup.add(this.xAxis, this.yAxis, this.zAxis);
    this.axisGroup.renderOrder = 998;

    // Axis labels
    this.xLabel = this.createAxisLabel('X', new THREE.Vector3(this.Offset, 0, 0));
    this.yLabel = this.createAxisLabel('Y', new THREE.Vector3(0, this.Offset, 0));
    this.zLabel = this.createAxisLabel('Z', new THREE.Vector3(0, 0, this.Offset));

    // Create axis label group
    this.labelGroup.add(this.xLabel, this.yLabel, this.zLabel);

    this.labelGroup.renderOrder = 999;

   // Label map
    this.labelMap = {
      x: this.xLabel,
      y: this.yLabel,
      z: this.zLabel
    }

    // Add axis lines & labels to object
    this.add(this.axisGroup, this.labelGroup);
    
    this.name = 'axes';
  }


  createAxisLabel(label, position) {
    const canvas = document.createElement('canvas');
    canvas.style.backgroundColor = 'transparent';
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Clear fully with alpha = 0
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(120, 120, 120)";
    ctx.font = 'bold 80px sans-serif';
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
      depthWrite: false,
      depthTest: false
    });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(this.labelSize, this.labelSize, 1);
    sprite.position.copy(position);
    
    return sprite;
  }

  // Axis label scaling based on orthographic zoom
  scaleLabels(camera) {
    this.labelScale = this.labelSize / camera.zoom; // Adjust scale factor as needed

    for (const key in this.labelMap) {
      this.labelMap[key].scale.set(this.labelScale, this.labelScale, this.labelScale);
    }
  }



}

const axes = new Axes();
export default axes;