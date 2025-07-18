// Handles raw pointer and keyboard events on canvas or
// global scope (e.g., mouse drag, key presses, wheel zoom).
import * as THREE from 'three';

export default class InputManager {
  constructor(app) {
    this.app = app;
    this.canvas = app.runtime.renderer.domElement;

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
    this.canvas.addEventListener('pointerdown', this.onPointerDown.bind(this))
    this.canvas.addEventListener('pointermove', this.onPointerMove.bind(this))
    this.canvas.addEventListener('pointerup', this.onPointerUp.bind(this))

    // Prevent default context menu on right-click
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Disable wheel zoom (two-finger scroll)
    this.canvas.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });

    // Enable pinch zoom
    this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
    this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
    this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: false });

    // for global keyboard inputs
    window.addEventListener('keydown', this.onKeyDown.bind(this))
    window.addEventListener('keyup', this.onKeyUp.bind(this))
  }

  onPointerDown(e) {
    // ignore middle(1) & clicks inside menu  
    if (e.button === 1 || e.target.closest('.menu')) return;

    // If right-click (button 2), reset camera target to center
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
      if (this.leftPointerDown) return; // Prevent repeat
      this.leftPointerDown = true;      // Set flag

      if (this.spaceDown) {
        this.app.managers.controls.enablePan(true);
        this.hasPanned = true;
        return;
      } else {
        this.app.runtime.raycast.clicked = true;
        this.app.managers.tools.onPointerDown(e);
        return;
      }
    }
  }

  onPointerMove(e) {

    if (this.leftPointerDown) {
      this.isDragging = true;
      this.app.managers.tools.onPointerMove(e);
    }
  }

  onPointerUp(e) {
    this.app.managers.tools.onPointerUp(e);
    this.app.runtime.raycast.clicked = false;
    this.isDragging = false;
    this.leftPointerDown = false;
  }

  onWheel(e) {
    e.preventDefault();
    //this.app.managers.camera.onZoom(e.deltaY);
  }

  // Add these methods to your class:
  onTouchStart(e) {
    // if there are two touches, start pinch zoom
    if (e.touches.length === 2) {
      this._touchStartDist = this._getTouchDist(e);
      this._lastPinchZoom = this.app.runtime.camera.zoom;
    }
  }

  onTouchMove(e) {
    if (e.touches.length === 2 && this._touchStartDist) {
      e.preventDefault();
      const dist = this._getTouchDist(e);
      const scale = dist / this._touchStartDist;
      // Adjust zoom based on pinch scale
      this.app.managers.camera.setZoom(this._lastPinchZoom * scale);
    }
  }

  onTouchEnd(e) {
    this._touchStartDist = null;
  }

  _getTouchDist(e) {
    const [a, b] = e.touches;
    const dx = a.clientX - b.clientX;
    const dy = a.clientY - b.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  onKeyDown(e) {
  // Move into onKeyShortcut in tool manager
    if (e.code === 'Escape') {
      this.app.managers.tools.finalise(true);
      this.app.managers.tools.reset();
      return;
    }

    if (e.code === 'Space' && !this.spaceDown) {
      this.spaceDown = true;
      this.app.managers.controls.spaceDown(true);
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
