import * as THREE from 'three';

export function runStartupAnimation(renderer, onComplete) {
  // Use the same canvas and renderer as the main app
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  // Camera setup
  const aspect = window.innerWidth / window.innerHeight;
  const d = 50;
  const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
  camera.position.set(100, 100, 100);
  camera.lookAt(0, 0, 0);

  const pSize = 80;
  const planeGeometry = new THREE.PlaneGeometry(pSize, pSize);
  const gridSize = pSize;
  const gridDivisions = 10;

  // Add axes helper and cube
  const axesHelper = new THREE.AxesHelper(pSize);
  scene.add(axesHelper);

  // XY Plane and Grid
  const xyMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.2 });
  const xyPlane = new THREE.Mesh(planeGeometry, xyMaterial);
  xyPlane.position.set(pSize/2, pSize/2, 0);
  scene.add(xyPlane);

  const xyGrid = new THREE.GridHelper(gridSize, gridDivisions, 0x00ff00, 0x00ff00);
  xyGrid.rotation.x = Math.PI / 2;
  xyGrid.position.set(pSize/2, pSize/2, 0);
  scene.add(xyGrid);

  // XZ Plane and Grid
  const xzMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.2 });
  const xzPlane = new THREE.Mesh(planeGeometry, xzMaterial);
  xzPlane.rotation.x = -Math.PI / 2;
  xzPlane.position.set(pSize/2, 0, pSize/2);
  scene.add(xzPlane);

  const xzGrid = new THREE.GridHelper(gridSize, gridDivisions, 0x0000ff, 0x0000ff);
  xzGrid.position.set(pSize/2, 0, pSize/2);
  scene.add(xzGrid);

  // YZ Plane and Grid
  const yzMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.2 });
  const yzPlane = new THREE.Mesh(planeGeometry, yzMaterial);
  yzPlane.rotation.y = -Math.PI / 2;
  yzPlane.position.set(0, pSize/2, pSize/2);
  scene.add(yzPlane);

  const yzGrid = new THREE.GridHelper(gridSize, gridDivisions, 0xff0000, 0xff0000);
  yzGrid.rotation.z = Math.PI / 2;
  yzGrid.position.set(0, pSize/2, pSize/2);
  scene.add(yzGrid);

  function createAxisLabel(text, color, position) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.font = 'bold 80px Arial';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 64, 64);
  
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(8, 8, 1); // Adjust size as needed
    sprite.position.copy(position);
    return sprite;
  }
  
  // Add axis labels
  const offset = pSize + 6;
  const xLabel = createAxisLabel('X', '#f00', new THREE.Vector3(offset, 0, 0));
  const yLabel = createAxisLabel('Y', '#0f0', new THREE.Vector3(0, offset, 0));
  const zLabel = createAxisLabel('Z', '#00f', new THREE.Vector3(0, 0, offset));
  
  scene.add(xLabel, yLabel, zLabel);

  // Animation variables
  camera.zoom = 0.0000000000029;
  const cameraMax = 0.7;
  const cameraEnd = 0.5;
  const zoomSpeed = 0.000005;
  let animationDone = false;
  let pauseStartTime = null;
  const pauseDuration = 2000; // 2 seconds
  let currentZoomSpeed = zoomSpeed;
  const zoomAcceleration = 1.03;
  const mag = 3;

  function animate() {
    if (!animationDone) {
      camera.zoom += currentZoomSpeed * mag;
      currentZoomSpeed *= zoomAcceleration;
      if (camera.zoom >= cameraMax) {
        camera.zoom = cameraEnd;
        animationDone = true;
        pauseStartTime = Date.now();
      }
      camera.updateProjectionMatrix();
    } else if (animationDone && Date.now() - pauseStartTime > pauseDuration) {
      // Remove animation objects from the scene
      scene.remove(xyPlane, xyGrid, xzPlane, xzGrid, yzPlane, yzGrid, axesHelper);
      // Call the callback to start the main app
      onComplete();
      return;
    }

    // Scale grids
    const scale = 0.5 / camera.zoom;
    xyGrid.scale.set(scale, scale, scale);
    xzGrid.scale.set(scale, scale, scale);
    yzGrid.scale.set(scale, scale, scale);

    renderer.render(scene, camera);

    if (!animationDone || (animationDone && Date.now() - pauseStartTime <= pauseDuration)) {
      requestAnimationFrame(animate);
    }
  }

  animate();
}