import * as THREE from 'three';

// Axis planes
export class Plane extends THREE.Group {
  constructor(size = 100) {
    super();

    this.size = size;

    this.init();
  }

  init() {
    // Plane elements
    this.planeGeometry = new THREE.PlaneGeometry(this.size, this.size);
    this.planeMaterial = this.createPlaneMaterial();

    const mesh = new THREE.Mesh(this.planeGeometry, this.planeMaterial);

    this.add(mesh); 
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



}

export default Plane;