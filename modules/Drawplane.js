import * as THREE from 'three';

// Axis planes
export class Drawplane extends THREE.Object3D {
  constructor(size = 100) {
    super();

    this.size = size;

    this.init();
  }

  init() {
    // Plane elements
    this.planeGeometry = new THREE.PlaneGeometry(this.size, this.size);
    this.planeMaterial = this.createPlaneMaterial();

    const plane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
    plane.userData.type = 'drawPlane';

    this.add(plane); 
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

export default Drawplane;