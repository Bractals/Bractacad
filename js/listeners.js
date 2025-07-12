import * as THREE from 'three';
import { app } from '../main.js';


export function initListeners(toolManager, lineTool) {

  // Camera buttons
  const size = app.state.size;
  const half = app.state.size/2;

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
      app.input.spaceDown = true;
      console.log(app.sceneLogic.spaceDown);
      app.controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
    }
  });

  // stop panning
  window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
      app.input.spaceDown = false;
      app.controls.mouseButtons.LEFT = null;
    }
  });

  window.addEventListener('pointerdown', (e) => {
    app.raycast.clicked = true;
    // ignore clicks inside menu  
    if (e.target.closest('.menu')) return;

    if (!app.input.spaceDown) {
      toolManager.onPointerDown(e);
    }

  });

  window.addEventListener('pointerup', (e) => {
    toolManager.onPointerUp(e);
    app.raycast.clicked = false;
  });

  const planeCams = {
    xy: new THREE.Vector3(half, half, size*2),
    zy: new THREE.Vector3(-size*2, half, -half),
    xz: new THREE.Vector3(half, -size*2, -half+0.0001),
    ab: new THREE.Vector3(half, half, -size*3),
    cb: new THREE.Vector3(size*3, half, -half),
    ac: new THREE.Vector3(half, size*3, -half+0.0001)
  };

  // if panned, hasPanned = true.
  window.addEventListener('pointerdown', (e) => {
    // left click pan
    if (e.button === 0 && app.input.spaceDown) {
      app.input.hasPanned = true;
      return;
    }
    // if orbiting after panning, re-center camera
    else if (e.button === 2 && app.input.hasPanned) {

      const key = closestPlane(app.camera.position);
      const pos = planeCams[key];

      app.camera.setPos(pos);
      app.camera.setTargetCenter();
      app.camera.refresh();

      app.input.hasPanned = false;
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
