import * as THREE from 'three';
import { app } from './app.js';

export function initUIButtons({
  toolManager,
  lineToolInstance,
  rectangleToolInstance,
  cube
}) {
  const lineBtn = document.getElementById('line-btn');
  const rectBtn = document.getElementById('rectangle-btn');

  lineBtn.addEventListener('click', () => {
    toolManager.setTool(lineToolInstance);
    updateToolUI();
  });

  rectBtn.addEventListener('click', () => {
    toolManager.setTool(rectangleToolInstance);
    updateToolUI();
  });

  function updateToolUI() {
    lineBtn.classList.toggle('active', toolManager.activeTool === lineToolInstance);
    rectBtn.classList.toggle('active', toolManager.activeTool === rectangleToolInstance);
  }

  // Fullscreen
  document.getElementById('fullscreen-btn').addEventListener('click', () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement) {
      elem.requestFullscreen?.() || elem.webkitRequestFullscreen?.() || elem.msRequestFullscreen?.();
    } else {
      document.exitFullscreen?.() || document.webkitExitFullscreen?.() || document.msExitFullscreen?.();
    }
  });

  // Toggle all planes
  const checkPlanes = document.getElementById('toggle-all-planes');

  checkPlanes.addEventListener('change', () => {
    app.cube.toggleAllPlanes(checkPlanes.checked);
  });

  // Toggle plane
  //const planeName = this.planes[i].name;
  //const toggle = "toggle-" + planeName;
  
  //const plane = document.getElementById(toggle);

  // Toggle grids
  const checkGrids = document.getElementById('toggle-grids');

  checkGrids.addEventListener('change', () => {
    app.cube.toggleGrids(checkGrids.checked);
  });

  // Toggle borders
  const checkBorders = document.getElementById('toggle-borders');

  checkBorders.addEventListener('change', () => {
    app.cube.toggleBorders(checkBorders.checked);
  });

  // Toggle build-box
  const checkBuildBox = document.getElementById('toggle-box-frame');

  checkBuildBox.addEventListener('change', () => {
    app.build.toggleBuildBox(checkBuildBox.checked);
  });

  // Toggle a plane
  const checkXyPlane = document.getElementById('toggle-xy');
  checkXyPlane.addEventListener('change', () => {
  const planeName = "xy";
    app.cube.togglePlane(checkXyPlane.checked, planeName);
  });
  const checkZyPlane = document.getElementById('toggle-zy');
  checkZyPlane.addEventListener('change', () => {
  const planeName = "zy";
    app.cube.togglePlane(checkZyPlane.checked, planeName);
  });
  const checkXzPlane = document.getElementById('toggle-xz');
  checkXzPlane.addEventListener('change', () => {
    const planeName = "xz";
    app.cube.togglePlane(checkXzPlane.checked, planeName);
  });
  const checkAbPlane = document.getElementById('toggle-ab');
  checkAbPlane.addEventListener('change', () => {
    const planeName = "ab";
    app.cube.togglePlane(checkAbPlane.checked, planeName);
  });
  const checkCbPlane = document.getElementById('toggle-cb');
  checkCbPlane.addEventListener('change', () => {
    const planeName = "cb";
    app.cube.togglePlane(checkCbPlane.checked, planeName);
  });
  const checkAcPlane = document.getElementById('toggle-ac');
  checkAcPlane.addEventListener('change', () => {
    const planeName = "ac";
    app.cube.togglePlane(checkAcPlane.checked, planeName);
  });

  // Camera buttons
  const half = app.cube.halfPlane;
  const size = app.cube.pSize;
  const gap = app.cube.gap;

  const camButtons = {
    'xyCamera-btn': new THREE.Vector3(half, half, size*2),
    'zyCamera-btn': new THREE.Vector3(-size*2, half, -half),
    'xzCamera-btn': new THREE.Vector3(half, -size*2, -half+0.0001),
    'abCamera-btn': new THREE.Vector3(half, half, -size*3),
    'cbCamera-btn': new THREE.Vector3(size*3, half, -half),
    'acCamera-btn': new THREE.Vector3(half, size*3, -half+0.0001)
  };

  for (const [id, pos] of Object.entries(camButtons)) {
    document.getElementById(id).addEventListener('click', () => {
      app.camera.setPos(pos);
      app.camera.setTarget(new THREE.Vector3(half, half, -half));
    });
    app.camera.refresh();
  }

  // Reset camera
  document.getElementById('center-btn').addEventListener('click', () => {
    app.camera.reset();
  });
}

// Lock rotation function
//  Might need to adjust for top and bottom planes
function lockRotation() {
  controls.enableRotate = false;
  app.camera.refresh();
}

function unlockRotation() {
  controls.enableRotate = true;
  app.camera.refresh();
}
