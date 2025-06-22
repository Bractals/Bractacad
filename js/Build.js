import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import { app } from './app.js';

export class Build extends THREE.Group {
  constructor(planes, planeSize) {
    super();
    // planes from cube
    this.planes = planes;
    // Size of the build box for projecting the 3D objects
    this.size = planeSize;

    this.buildBox = null;

    this.sketches = { lines: [] };
    this.objects = { injects: [] };
    this.projections = {};

    this.init();
  }

  init() {
    // Inner box guide
    const boxA = new THREE.BoxGeometry(this.size, this.size, this.size);
    const edges = new THREE.EdgesGeometry(boxA); // extracts edges
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.8 });
    this.buildBox = new THREE.LineSegments(edges, lineMaterial);
    this.buildBox.position.set(this.size/2, this.size/2, this.size/2);
    this.buildBox.renderOrder = 98;
    this.buildBox.name = "build-box";
    this.add(this.buildBox);

    // Need to store each connected lines as a sketch
    // Need the plane of each sketch
    // Project them to 3D
    // Store 3D objects in array.
    // Maintain order for undo/redo history
  }
    // sketch object storing the plane the line array is on, uuid, and array of line objects
  addSketch(sketch, plane) {
    plane.add(sketch);
    this.sketches.lines.push({ sketch, plane });
    // To access the sketch objects
    // const lineId = line.uuid;
    //console.log(sketch);
    // printing last line objects plane
    // console.log(this.lines[this.lines.length-1].plane);
    
    // project sketch to 3D and add to scene
    this.extrude(sketch);
  }

  clearSketch() {
    this.lines.forEach(({ sketch, plane }) => {
      plane.remove(sketch);
      if (sketch.geometry) sketch.geometry.dispose();
      if (sketch.material) sketch.material.dispose();
    });
    this.lines = [];
  }

  // Tie sketches together and project to all planes.
  // this.projections = {
  //   mirrors: [],

  //   // Need to map of each plane
  //   // check which plane the sketch is
  //   // and project to the rest.
  //   updatePlanes() {
  //     for (const sketch of this.sketches) {
        
  //     }
  //   }
  // }

  extrude(sketch) {
    const geometry = sketch.geometry;
    const posAttr = geometry.attributes.position;
    const count = posAttr.count;

    const planeName = sketch.parent.name;

    // Extract points from geometry
    const points = [];
    for (let i = 0; i < count; i++) {
      points.push(new THREE.Vector3().fromBufferAttribute(posAttr, i));
    }

    // Check if closed loop (first and last points roughly equal)
    const isClosed = points[0].distanceTo(points[points.length - 1]) < 1e-5;

    //console.log(points[0]);
    // Determine extrusion direction based on plane
    const direction = new THREE.Vector3(0, 0, 1); // Default extrusion direction (Z axis)

    // Default extrusion distance
    const distance = this.size;

    // Extrude side vertices
    const offset = direction.clone().multiplyScalar(distance);
    const extrudedPoints = points.map(p => p.clone().add(offset));

    // Array for vertices
    const vertices = [];
    // Array for textures
    // u for horizontal, v for vertical
    const uvs = [];
    const lengths = [];
    let perimeter = 0;

    // Calculate edge lengths for UV mapping
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      const len = p1.distanceTo(p2);
      lengths.push(len);
      perimeter += len;
    }

    let uOffset = 0;
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const v = 0;
      const u = uOffset / perimeter;
      vertices.push(p.x, p.y, p.z);
      uvs.push(u, v);
      uOffset += lengths[i % lengths.length];
    }

    // Top points
    uOffset = 0;
    for (let i = 0; i < extrudedPoints.length; i++) {
      const p = extrudedPoints[i];
      const v = 1;
      const u = uOffset / perimeter;
      vertices.push(p.x, p.y, p.z);
      uvs.push(u, v);
      uOffset += lengths[i % lengths.length];
    }

    const indices = [];
    // Create side faces (quads split into two triangles)
    for (let i = 0; i < points.length - 1; i++) {
      const a = i;
      const b = i + 1;
      const c = b + count;
      const d = a + count;
      indices.push(a, b, c);
      indices.push(c, d, a);
    }

    // -- Create side geometry --
    const sideGeometry = new THREE.BufferGeometry();
    sideGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    sideGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    sideGeometry.setIndex(indices);
    sideGeometry.computeVertexNormals();

    let finalGeometry = sideGeometry;

    if (isClosed) {
      // Create caps using shape triangulation
      const shape = new THREE.Shape(points.map(p => new THREE.Vector2(p.x, p.y)));

      const bottomGeometry = new THREE.ShapeGeometry(shape);
      const topGeometry = new THREE.ShapeGeometry(shape);
      topGeometry.translate(0, 0, distance);

      // Add dummy UVs to caps to match sideGeometry
      const makeDummyUVs = (geometry) => {
        const count = geometry.attributes.position.count;
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(count * 2), 2));
      };
      makeDummyUVs(bottomGeometry);
      makeDummyUVs(topGeometry);

      // Merge side and caps
      finalGeometry = BufferGeometryUtils.mergeGeometries(
        [sideGeometry, bottomGeometry, topGeometry],
        true
      );
    }

    // -- Shared material and mesh creation --
    const color = 0xCCCCCC;
    const material = new THREE.MeshStandardMaterial({
      color,
      side: THREE.DoubleSide,
      flatShading: true
    });

    const mesh = new THREE.Mesh(finalGeometry, material);
    mesh.geometry.computeVertexNormals();

    if (planeName === 'ZY' || planeName === 'CB') {
      mesh.rotation.y = Math.PI / 2;
      mesh.position.z += this.size;
    } else if (planeName === 'XZ' || planeName === 'AC') {
      mesh.rotation.x = Math.PI / 2;
      mesh.position.y += this.size;
    }
    
    const edges = new THREE.EdgesGeometry(finalGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    const edgeLines = new THREE.LineSegments(edges, lineMaterial);
    mesh.add(edgeLines); // add as child to move/scale with mesh

    app.scene.add(mesh);
    this.objects.injects.push(mesh);
  }

  // Toggle build-box frame
  toggleBuildBox(visible) {
    this.buildBox.visible = visible;
  }

}

export default Build;