import * as THREE from 'three';
import { app } from './app.js';

import gridVertexShader from '../shaders/grid.vert.glsl';
import gridFragmentShader from '../shaders/grid.frag.glsl';
import { cloneUniforms } from 'three/src/renderers/shaders/UniformsUtils.js';
import { TechnicolorShader } from 'three/examples/jsm/Addons.js';

// Axes
export class Axes extends THREE.Group {
  constructor(length) {
    super();

    this.length = length;

    this.xGroup = null;
    this.yGroup = null;
    this.zGroup = null;

    this.xAxis = null;
    this.yAxis = null;
    this.zAxis = null;

    this.labelSize = this.length * 0.1;

    this.groups = {};

    this.init();
  }

  init() {

    // Materials per axis
    const xMat = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const yMat = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const zMat = new THREE.LineBasicMaterial({ color: 0x0000ff });

    // Geometries per axis
    const xGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-this.length, 0, 0),
      new THREE.Vector3(this.length, 0, 0)
    ]);

    const yGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -this.length, 0),
      new THREE.Vector3(0, this.length, 0)
    ]);

    const zGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, -this.length),
      new THREE.Vector3(0, 0, this.length)
    ]);

    // Line objects
    this.xAxis = new THREE.LineSegments(xGeo, xMat);
    this.yAxis = new THREE.LineSegments(yGeo, yMat);
    this.zAxis = new THREE.LineSegments(zGeo, zMat);

    // Set plane names
    this.xAxis.name = 'X';
    this.yAxis.name = 'Y';
    this.zAxis.name = 'Z';

    const offset = this.length + this.labelSize * 0.5;

    // plane labels
    this.xLabel = this.createLabel(this.xAxis.name, new THREE.Vector3(offset, 0, 0));
    this.yLabel = this.createLabel(this.yAxis.name, new THREE.Vector3(0, offset, 0));
    this.zLabel = this.createLabel(this.zAxis.name, new THREE.Vector3(0, 0, offset));

    // create groups
    this.xGroup = new THREE.Group();
    this.yGroup = new THREE.Group();
    this.zGroup = new THREE.Group();

    // fill groups
    this.xGroup.add(this.xAxis, this.xLabel);
    this.yGroup.add(this.yAxis, this.yLabel);
    this.zGroup.add(this.zAxis, this.zLabel);

    // To search and loop through
    this.groupMap = {
      x: { group: this.xGroup, axis: this.xAxis, label: this.xLabel },
      y: { group: this.yGroup, axis: this.yAxis, label: this.yLabel },
      z: { group: this.zGroup, axis: this.zAxis, label: this.zLabel },
    }

    this.groups = Object.values(this.groupMap).map(face => face.group);
    this.axes = Object.values(this.groupMap).map(face => face.axis);

    for (const key in this.groupMap) {
      const { group } = this.groupMap[key]
    
      group.renderOrder = 1;

      this.add(group);
    }


  }

  // Create Axis labels
  createLabel(text, position) {
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
    ctx.fillText(text, 64, 64);

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
      depthTest: true,
      depthWrite: false
    });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(this.labelSize, this.labelSize, 1); // Adjust size as needed
    sprite.position.copy(position);
    
    return sprite;

  }



}

export default Axes;