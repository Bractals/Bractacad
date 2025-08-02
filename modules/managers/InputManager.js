// Handles raw pointer and keyboard events on canvas or
// global scope (e.g., mouse drag, key presses, wheel zoom).
import * as THREE from 'three';

export default class InputManager {
  constructor(app, castRay) {
    this.app = app;
    this.canvas = app.runtime.renderer.domElement;

    this.raycast = this.app.runtime.raycast;
    this.castRay = castRay;

    // 2D screen point
    this.pointer = new THREE.Vector2();

    this.leftPointerDown = false;
    this.spaceDown = false;
    this.hasPanned = false;
    this.isDragging = false;

    this.size = app.state.size;
    this.half = app.state.size/2;

    this.init();
  }

  // Do not mix DOM event handling inside tools or scene objects.
  // Centralize all input entry in InputManager.

  init() {
    // Listen for pointer events on the canvas

    // .bind(this) creates a new function where this is permanently
    // set to the object (this) at the time of the call.
    window.addEventListener('pointerdown', this.onPointerDown.bind(this), { passive: false })
    window.addEventListener('pointermove', this.onPointerMove.bind(this), { passive: false })
    window.addEventListener('pointerup', this.onPointerUp.bind(this), { passive: false })


    // Passive: true

    // better performance for touch, no waiting for preventDefault()

    // Safe for listeners that only read event data
    // and don't block default behavior
    // (e.g., tracking pointer coordinates).

    // Avoid for listeners that must cancel scroll,
    // pinch, or zoom behaviors (e.g., custom gestures).

    // Prevent default context menu on right-click
    window.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Disable wheel zoom (two-finger scroll)
    //this.canvas.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });

    // for global keyboard inputs
    window.addEventListener('keydown', this.onKeyDown.bind(this))
    window.addEventListener('keyup', this.onKeyUp.bind(this))
  }

  onPointerDown(e) {

    this.updatePointer(e);

    this.castRay(this.pointer);

    // ignore middle(1) & clicks inside menu  
    if (e.button === 1 || e.target.closest('.menu')) return;

    // If right-click (button 2) and panned, reset camera target to center
    if (e.button === 2) {
      if (this.hasPanned) {
        this.app.managers.camera.setTarget(new THREE.Vector3(0, 0, 0));
        this.app.managers.camera.refresh();
        this.hasPanned = false;
      }
      return;
    }
    
    // If left-click (button 0) and not in pan mode, handle tool interaction
    if (e.button === 0) {
      
      if (this.leftPointerDown) {
        this.isDragging = true;
      }
      this.leftPointerDown = true;      // Set flag

      if (this.spaceDown) {
        this.app.managers.controls.enablePan(true);
        this.hasPanned = true;
        return;
      }

      const object = this.app.runtime.raycast.object;

      if (object && object.userData.type === 'axisPlane'){
        this.app.managers.scene.starLogic(object);
        console.log(object.name);
      } else {
        console.log("object not found");
      }
      
      if (this.app.runtime.raycast.object) {
        this.app.managers.tools.onPointerDown(e);
      }

    }
  }

  updatePointer(e) {
    const rect = this.canvas.getBoundingClientRect();

    this.pointer = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );
  }

  onPointerMove(e) {

    // update pointer normalized coordinates
    this.updatePointer(e);

    this.castRay(this.pointer);

    this.app.managers.tools.onPointerMove(e);
    if (this.leftPointerDown) {
      this.isDragging = true;
    }
  }

  onPointerUp(e) {

    this.isDragging = false;
    this.leftPointerDown = false;
  }

  onWheel(e) {
    e.preventDefault();
    //this.app.managers.camera.onZoom(e.deltaY);
  }

  onKeyDown(e) {
  // Move into onKeyShortcut in tool manager
    if (e.code === 'Escape') {
      this.tools.reset(e);

      const el = this.app.managers.ui.fullscreenTarget; // assign actual element
      if (el && el.requestFullscreen) {
        el.requestFullscreen().catch(err => {
          console.error("Fullscreen request denied", err);
        });
      }
      return;
    }

    if (e.code === 'Space' && !this.spaceDown) {
      this.spaceDown = true;
      this.controls.spaceDown(true);
      return;
    }
  }

  onKeyUp(e) {
    if (e.code === 'Space') {
      this.spaceDown = false;
      this.app.managers.controls.spaceDown(false);
    }
  }


  
  
}
