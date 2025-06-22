import * as THREE from 'three';
import { app } from './app.js';

import gridVertexShader from '../shaders/grid.vert.glsl';
import gridFragmentShader from '../shaders/grid.frag.glsl';
import { cloneUniforms } from 'three/src/renderers/shaders/UniformsUtils.js';

// Super Cube
export class SuperCube extends THREE.Group {
  constructor() {
    super(); 

    // Planes
    this.pSize = 1000;
    this.gapScale = 0;
    this.gap = this.pSize * this.gapScale;
    this.halfPlane = this.pSize/2;
    this.griddivs = 20;
    this.planeOpacity = 1;
    // Grids
    this.gridMaterial = null;
    this.gridOpacity = 0.2;
    this._gridSpacing = 10;
    // 20 pixels between grid points on screen
    this.targetPixelSpacing = 20;
    this.pixelsPerWorldUnit;
    this.rawSpacing;
    // Borders
    this.borderScale = 0.05;
    this.borderWidth = this.pSize * this.borderScale;
    this.borderSize = this.pSize + this.borderWidth*2;

    this.borderGap = this.pSize * 0.1;
    this.halfOuter = this.halfPlane + this.borderWidth + this.borderGap;
    this.halfCube = this.halfPlane + this.borderGap;
    this.borderOpacity = 0.6;
    this.totalGap = this.gap + this.borderWidth + this.borderGap;
    // Axis labels
    this.labelSize = 0.4;
    this.labelOffset = this.gap + this.borderWidth + this.borderGap + (this.pSize*0.1);
    // Inner build box
    this.buildBox = null;

    this.planeGeometry = null;
    this.planeMaterial = null;

    this.isDrawPlane = false;
    
    // Planes
    this.xyPlane = null;
    this.zyPlane = null;
    this.xzPlane = null;
    this.abPlane = null;
    this.cbPlane = null;
    this.acPlane = null;

    // Grids
    this.orientA = 0;
    this.orientB = 1;
    this.orientC = 2;
    this.xyGrid = null;
    this.zyGrid = null;
    this.xzGrid = null;
    this.abGrid = null;
    this.cbGrid = null;
    this.acGrid = null;

    // Borders
    this.xyBorder = null;
    this.zyBorder = null;
    this.xzBorder = null;
    this.abBorder = null;
    this.cbBorder = null;
    this.acBorder = null;

    //OuterPoints
    this.outerPoints = null;
    // Border Outlines
    this.xyOutline = null;
    this.zyOutline = null;
    this.xzOutline = null;
    this.abOutline = null;
    this.cbOutline = null;
    this.acOutline = null;

    // Groups
    this.groupSet = null;
    this.xyGroup = null;
    this.zyGroup = null;
    this.xzGroup = null;
    this.abGroup = null;
    this.cbGroup = null;
    this.acGroup = null;

    // For easy reference
    this.groups = {};
    this.planes = {};
    this.grids = {};
    this.borders = {};
    this.labels = {};

    this.colours = [];

    this.init();
  }

  init() {
    // Plane elements
    this.planeGeometry = new THREE.PlaneGeometry(this.pSize, this.pSize);
    this.planeGeometry.translate(this.pSize/2, this.pSize/2, 0);

    this.planeMaterial = this.createPlaneMaterial();

    // Colours
    this.colours = {
      xy: 0xFF0000,  // Red
      zy: 0xFFFF00,  // Yllow
      xz: 0x0000FF,  // Blue
      ab: 0xFF5CFF,  // Pink
      cb: 0x008000,  // Green
      ac: 0xFF7518,  // Orange
    };

    // Create planes
    this.xyPlane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
    this.zyPlane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
    this.xzPlane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
    this.abPlane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
    this.cbPlane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
    this.acPlane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);


    this.xyPlane.userData.isDrawPlane = true;
    this.zyPlane.userData.isDrawPlane = true;
    this.xzPlane.userData.isDrawPlane = true;
    this.abPlane.userData.isDrawPlane = true;
    this.cbPlane.userData.isDrawPlane = true;
    this.acPlane.userData.isDrawPlane = true;

    // Set plane names
    this.xyPlane.name = 'XY';
    this.zyPlane.name = 'ZY';
    this.xzPlane.name = 'XZ';
    this.abPlane.name = 'AB';
    this.cbPlane.name = 'CB';
    this.acPlane.name = 'AC';

    this.baseUniforms = {
      u_plane: { value: 0 },
      u_color: { value: new THREE.Color(0x000000) },
      u_spacing: { value: 1.0 },
      opacity: { value: this.gridOpacity },
      u_viewportHeight: { value: 1 },
      u_cameraHeight: { value: 1 },
      u_zoom: { value: 1 },
      u_lineThicknessPixels: { value: 1 }, // desired thickness in pixels for minor lines
      u_majorLineThicknessPixels: { value: 1 }
    };

    // Grids
    this.xyGrid = this.createGrid(1);
    this.zyGrid = this.createGrid(2);
    this.xzGrid = this.createGrid(0);
    this.abGrid = this.createGrid(1);
    this.cbGrid = this.createGrid(2);
    this.acGrid = this.createGrid(0);

    // Plane Borders
    this.xyBorder = this.createBorderStrip(this.colours.xy);
    this.zyBorder = this.createBorderStrip(this.colours.zy);
    this.xzBorder = this.createBorderStrip(this.colours.xz);
    this.abBorder = this.createBorderStrip(this.colours.ab);
    this.cbBorder = this.createBorderStrip(this.colours.cb);
    this.acBorder = this.createBorderStrip(this.colours.ac);

    // Inner plane borders
    this.xyInnerBorder = this.createInnerBorder();
    this.zyInnerBorder = this.createInnerBorder();
    this.xzInnerBorder = this.createInnerBorder();
    this.abInnerBorder = this.createInnerBorder();
    this.cbInnerBorder = this.createInnerBorder();
    this.acInnerBorder = this.createInnerBorder();

    this.outerPoints = [
      new THREE.Vector3(-this.halfCube+this.borderWidth, -this.halfCube-this.borderWidth, 0),
      new THREE.Vector3(this.halfCube+this.borderWidth, -this.halfCube-this.borderWidth, 0),
      new THREE.Vector3(this.halfCube+this.borderWidth, this.halfCube+this.borderWidth, 0),
      new THREE.Vector3(-this.halfCube-this.borderWidth, this.halfCube+this.borderWidth, 0),
      new THREE.Vector3(-this.halfCube-this.borderWidth, -this.halfCube-this.borderWidth, 0)
    ];

    // Plane edges
    this.xyOutline = this.createOutline();
    this.zyOutline = this.createOutline();
    this.xzOutline = this.createOutline();
    this.abOutline = this.createOutline();
    this.cbOutline = this.createOutline();
    this.acOutline = this.createOutline();

    // Create groups for planes, grids and borders
    this.xyGroup = new THREE.Group();
    this.zyGroup = new THREE.Group();
    this.xzGroup = new THREE.Group();
    this.abGroup = new THREE.Group();
    this.cbGroup = new THREE.Group();
    this.acGroup = new THREE.Group();

    // Add planes to groups
    this.xyGroup.add(this.xyPlane, this.xyGrid, this.xyBorder, this.xyInnerBorder, this.xyOutline);
    this.zyGroup.add(this.zyPlane, this.zyGrid, this.zyBorder, this.zyInnerBorder, this.zyOutline);
    this.xzGroup.add(this.xzPlane, this.xzGrid, this.xzBorder, this.xzInnerBorder, this.xzOutline);
    this.abGroup.add(this.abPlane, this.abGrid, this.abBorder, this.abInnerBorder, this.abOutline);
    this.cbGroup.add(this.cbPlane, this.cbGrid, this.cbBorder, this.cbInnerBorder, this.cbOutline);
    this.acGroup.add(this.acPlane, this.acGrid, this.acBorder, this.acInnerBorder, this.acOutline);

    // Add axis labels
    this.xLabel = this.createAxisLabel('X', new THREE.Vector3(this.halfPlane, -this.labelOffset, -this.labelOffset));
    this.yLabel = this.createAxisLabel('Y', new THREE.Vector3(-this.labelOffset, this.halfPlane, -this.labelOffset));
    this.zLabel = this.createAxisLabel('Z', new THREE.Vector3(-this.labelOffset, -this.labelOffset, this.halfPlane));
    // Add labels for A, B, C planes
    this.aLabel = this.createAxisLabel('A', new THREE.Vector3(this.halfPlane, this.pSize+this.labelOffset, this.pSize+this.labelOffset));
    this.bLabel = this.createAxisLabel('B', new THREE.Vector3(this.pSize+this.labelOffset, this.halfPlane, this.pSize+this.labelOffset));
    this.cLabel = this.createAxisLabel('C', new THREE.Vector3(this.pSize+this.labelOffset, this.pSize+this.labelOffset, this.halfPlane));

    // To search and loop through
    this.groupMap = {
      xy: { group: this.xyGroup, plane: this.xyPlane, grid: this.xyGrid, border: this.xyBorder, innerBorder: this.xyBorder, outline: this.xyOutline },
      zy: { group: this.zyGroup, plane: this.zyPlane, grid: this.zyGrid, border: this.zyBorder, innerBorder: this.zyBorder, outline: this.zyOutline },
      xz: { group: this.xzGroup, plane: this.xzPlane, grid: this.xzGrid, border: this.xzBorder, innerBorder: this.xzBorder, outline: this.xzOutline },
      ab: { group: this.abGroup, plane: this.abPlane, grid: this.abGrid, border: this.abBorder, innerBorder: this.abBorder, outline: this.abOutline },
      cb: { group: this.cbGroup, plane: this.cbPlane, grid: this.cbGrid, border: this.cbBorder, innerBorder: this.cbBorder, outline: this.cbOutline },
      ac: { group: this.acGroup, plane: this.acPlane, grid: this.acGrid, border: this.acBorder, innerBorder: this.acBorder, outline: this.acOutline },
    };

    this.groups = Object.values(this.groupMap).map(face => face.group);
    this.planes = Object.values(this.groupMap).map(face => face.plane);
    this.grids = Object.values(this.groupMap).map(face => face.grid);
    this.borders = Object.values(this.groupMap).map(face => face.border);


    this.positionGroups();
  
    // Axis labels

    this.labels = {
      x: { label: this.xLabel },
      y: { label: this.yLabel },
      z: { label: this.zLabel },
      a: { label: this.aLabel },
      b: { label: this.bLabel },
      c: { label: this.cLabel }
    }

    // Set render orders
    for (const key in this.groupMap) {
      const { plane } = this.groupMap[key];
      const { grid } = this.groupMap[key];
      const { border } = this.groupMap[key];
      const { innerBorder } = this.groupMap[key];
      const { outline } = this.groupMap[key];

      //const { label } = this.labels[key];
      plane.renderOrder = 2;
      grid.renderOrder = 3;
      border.renderOrder = 3;
      innerBorder.renderOrder = 3;
      outline.renderOrder = 3;
    }
    // set render order from labels
    for (const key in this.labels) {
      const { label } = this.labels[key];
      label.renderOrder = 99;
    }
    // Add groups to cube
    for (const key in this.groupMap) {
      const { group } = this.groupMap[key];
      this.add(group);
    }
    // Add labels to cube
    for (const key in this.labels) {
      const { label } = this.labels[key];
      this.add(label);
    }
  }

  updateGapScale(newGapScale) {
    this.gapScale = newGapScale;
    this.positionGroups();
  }

  positionGroups() {

    this.groupSet = {
      xy:    { pos: [0, 0, -this.totalGap], rot: [0, 0, 0] },
      zy:    { pos: [-this.totalGap, 0, this.pSize], rot: [0, Math.PI/2, 0] },
      xz:    { pos: [0, -this.totalGap, 0], rot: [Math.PI/2, 0, 0] },
      ab:    { pos: [0, 0,this.pSize+this.totalGap], rot: [0, 0, 0] },
      cb:    { pos: [this.pSize+this.totalGap, 0, this.pSize], rot: [0, Math.PI/2, 0] },
      ac:    { pos: [0, this.pSize+this.totalGap, 0], rot: [Math.PI/2, 0, 0] },
    };
    for (const key in this.groupMap) {
      const { group } = this.groupMap[key];
      const { pos, rot } = this.groupSet[key];
      group.position.set(...pos);
      group.rotation.set(...rot);
    }
  }

  scaleGuides(renderer, camera) {
    this.scaleLabels(camera.zoom);
    this.updateGridSpacing(renderer, camera);
  }

  // Axis label scaling
  scaleLabels(zoom) {
    this.labelScale = this.labelSize / zoom;

    for (const key in this.labels) {
      const { label } = this.labels[key];
      label.scale.set(this.labelScale, this.labelScale, this.labelScale);
    }
  }

  // Incase option to change plane colours
  createPlaneMaterial() {
    return new THREE.MeshBasicMaterial({
    color: 0x000000,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.0,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
    depthWrite: true,   // important! writes to depth buffer
    depthTest: true,
    blending: THREE.NormalBlending
    });
  }

  // Deep clone all uniforms, including nested values
  cloneUniforms(uniforms) {
    return THREE.UniformsUtils.clone(uniforms);
  }

  // Create grids
  createGrid(planeIndex) {
    const uniforms = cloneUniforms(this.baseUniforms);
    uniforms.u_plane.value = planeIndex;

    const material = new THREE.ShaderMaterial({
      vertexShader: gridVertexShader,
      fragmentShader: gridFragmentShader,
      uniforms: uniforms,
      transparent: true,
      opacity: this.gridOpacity,
      depthWrite: false,
      blending: THREE.NormalBlending,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -1, // Push it slightly forward
      polygonOffsetUnits: -1
    });

    return new THREE.Mesh(this.planeGeometry, material);
  }

  createBorderStrip(colour) {
    // Outer frame: covers full plane + border on all sides
    const outer = new THREE.Shape();
    outer.moveTo(-this.halfOuter, -this.halfOuter);
    outer.lineTo(this.halfOuter, -this.halfOuter);
    outer.lineTo(this.halfOuter, this.halfOuter);
    outer.lineTo(-this.halfOuter, this.halfOuter);
    outer.lineTo(-this.halfOuter, -this.halfOuter);

    // Inner hole: matches exact plane dimensions
    const inner = new THREE.Path();
    inner.moveTo(-this.halfCube, -this.halfCube);
    inner.lineTo(-this.halfCube, this.halfCube);
    inner.lineTo(this.halfCube, this.halfCube);
    inner.lineTo(this.halfCube, -this.halfCube);
    inner.lineTo(-this.halfCube, -this.halfCube);

    outer.holes.push(inner);

    const geometry = new THREE.ShapeGeometry(outer);
    // translate local origin to match planes
    geometry.translate(this.pSize/2, this.pSize/2, 0);
    // Transparent: false, opacity: 0.4, depthWrite: false
    // Looks awesome.
    const material = new THREE.MeshBasicMaterial({
      color: colour,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: this.borderOpacity,
      depthWrite: true,
      blending: THREE.NoBlending
    });
    return new THREE.Mesh(geometry, material);
  }

  createInnerBorder() {
    const outs = this.halfPlane + this.borderGap + this.borderWidth;
    const ins = this.halfPlane;

    // Outer frame: covers full plane + border on all sides
    const outer = new THREE.Shape();
    outer.moveTo(-outs, -outs);
    outer.lineTo(outs, -outs);
    outer.lineTo(outs, outs);
    outer.lineTo(-outs, outs);
    outer.lineTo(-outs, -outs);

    // Inner hole: matches exact plane dimensions
    const inner = new THREE.Path();
    inner.moveTo(-ins, -ins);
    inner.lineTo(-ins, ins);
    inner.lineTo(ins, ins);
    inner.lineTo(ins, -ins);
    inner.lineTo(-ins, -ins);

    outer.holes.push(inner);

    const geometry = new THREE.ShapeGeometry(outer);
    // translate local origin to match planes
    geometry.translate(this.pSize/2, this.pSize/2, 0);
    // Transparent: false, opacity: 0.4, depthWrite: false
    // Looks awesome.
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
      depthTest: true,
      depthWrite: true,
      blending: THREE.NormalBlending
    });
    return new THREE.Mesh(geometry, material);
  }

  createOutline() {
    const outlineGeometry = new THREE.BufferGeometry().setFromPoints(this.outerPoints);
    // Translate local origin to match planes.
    outlineGeometry.translate(this.pSize/2, this.pSize/2, 0);
    const outlineMaterial = new THREE.LineBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 1,
      depthTest: true,
      depthWrite: true
    });
    return new THREE.LineLoop(outlineGeometry, outlineMaterial);
  }

  // Create Axis labels
  createAxisLabel(text, position) {
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

  get gridSpacing() {
    return this._gridSpacing;
  }

  updateGridSpacing(renderer, camera) {
    // Orthographic camera
    const height = renderer.domElement.height;
    const cameraHeight = (camera.top - camera.bottom) / camera.zoom;
    
    // compute grid spacing as before
    const pixelsPerWorldUnit = height / cameraHeight;
    const rawSpacing = 20 / pixelsPerWorldUnit;

    let spacing = getRoundedSpacing(rawSpacing);
    spacing = Math.max(spacing, 0.5); // minimum spacing

    this._gridSpacing = spacing;

    for (const { grid } of Object.values(this.groupMap)) {
      const mat = grid.material.uniforms;

      mat.u_spacing.value = spacing;
      mat.u_viewportHeight.value = height;
      mat.u_cameraHeight.value = camera.top - camera.bottom;  // without zoom
      mat.u_zoom.value = camera.zoom;

      // line thicknesses
      mat.u_lineThicknessPixels.value = 0.01;
      mat.u_majorLineThicknessPixels.value = 0.5;
    }
    // Clamp spacing to a minimum to stop zooming-in effect
    // 0.5 mm if 1 unit = 1 mm.
    // 0.0005 for 1 unit = 1 meter

    //console.log('spacing: ', spacing);
  }

  // Toggle all planes by visibility
  toggleAllPlanes(visible) {
    for (const { group } of Object.values(this.groupMap)) {
      group.visible = visible;
    }
  }

  // Toggle a plane
  togglePlane(visible, key) {
    const group = this.groupMap[key]?.group;
    if (group) group.visible = visible;
  }

  // Toggle grids by visibility
  toggleGrids(visible) {
    for (const { grid } of Object.values(this.groupMap)) {
      grid.visible = visible;
    }
  }

  // Toggle borders by visibility
  toggleBorders(visible) {
    for (const { border } of Object.values(this.groupMap)) {
      border.visible = visible;
    }
  }
  


  // end of cube
}

function getRoundedSpacing(rawSpacing) {
  const steps = [1, 2, 5, 10, 20];
  const base = Math.pow(10, Math.floor(Math.log10(rawSpacing)));
  for (let step of steps) {
    const spacing = base * step;
    if (spacing >= rawSpacing) return spacing;
  }
  return base * 10;
}

const cube = new SuperCube();
export default cube;