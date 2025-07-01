import * as THREE from 'three';
import { app } from './app.js';

let isPanning = false;
let spaceDown = false;

export function initListeners(toolManager, lineTool) {

  // To stop drawing
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const finishSketch = true;
      lineTool.finalise(finishSketch); // Cancel and finish drawing
      lineTool.reset();
    }
  });

  window.addEventListener('pointermove', (e) => {
    toolManager.onPointerMove(e);
  });

  // Start panning
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      spaceDown = true;
      app.controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
    }
  });

  // stop panning
  window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
      spaceDown = false;
      app.controls.mouseButtons.LEFT = null;
    }
  });

  // window.addEventListener('pointerdown', (e) => {
  //   if (e.button === 0 && spaceDown) {
  //     isPanning = true;
  //     app.controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
  //   } else if (e.button === 0 && !spaceDown){
  //     isPanning = false;
  //   }
  // });

  window.addEventListener('pointerdown', (e) => {

    if (e.target.closest('.menu')) return; // ignore clicks inside menu

    if (!spaceDown) {
      toolManager.onPointerDown(e);
    }
  });

  window.addEventListener('pointerup', (e) => {
    toolManager.onPointerUp(e);
  });

  // Camera buttons
  const half = app.cube.halfPlane;
  const size = app.cube.pSize;

  const planeCams = {
    xy: new THREE.Vector3(half, half, size*2),
    zy: new THREE.Vector3(-size*2, half, -half),
    xz: new THREE.Vector3(half, -size*2, -half+0.0001),
    ab: new THREE.Vector3(half, half, -size*3),
    cb: new THREE.Vector3(size*3, half, -half),
    ac: new THREE.Vector3(half, size*3, -half+0.0001)
  };

  let hasPanned = false;

  // if panned, hasPanned = true.
  window.addEventListener('pointerdown', (e) => {
    // left click pan
    if (e.button === 0 && spaceDown) {
      hasPanned = true;
      return;
    }
    // if orbiting after panning, re-center camera
    else if (e.button === 2 && hasPanned) {

      const key = closestPlane(app.camera.position);
      const pos = planeCams[key];

      app.camera.setPos(pos);
      app.camera.setTargetCenter();
      app.camera.refresh();

      hasPanned = false;
      return;
    }
  });

  // Return which plane is closest to camera
  function closestPlane(cameraPos) {
    let closestKey = null;
    let minDistance = Infinity;

    for (const key in planeCams) {
      const camVec = planeCams[key];
      const distance = cameraPos.distanceTo(camVec);

      if (distance < minDistance) {
        minDistance = distance;
        closestKey = key;
      }
    }
    return closestKey; // returns the key of the closest plane
  }


}
