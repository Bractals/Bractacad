// Handles raw pointer and keyboard events on canvas or
// global scope (e.g., mouse drag, key presses, wheel zoom).
import * as THREE from 'three';

export default class InputManager {
  constructor(app) {
    this.app = app;
    this.canvas = app.runtime.renderer.domElement;

    this.spaceDown = false;
    this.hasPanned = false;
    this.isDragging = false;

    this.size = app.state.size;
    this.half = app.state.size/2; 

    this.initListeners();
  }

  // Do not mix DOM event handling inside tools or scene objects.
  // Centralize all input entry in InputManager.

  initListeners() {
    // Listen for pointer events on the canvas
    this.canvas.addEventListener('pointerdown', this.onPointerDown.bind(this))
    this.canvas.addEventListener('pointermove', this.onPointerMove.bind(this))
    this.canvas.addEventListener('pointerup', this.onPointerUp.bind(this))
    
    // wheel for tool feature
    //this.canvas.addEventListener('wheel', this.onWheel.bind(this), { passive: false })
    
    // for global keyboard inputs
    window.addEventListener('keydown', this.onKeyDown.bind(this))
    window.addEventListener('keyup', this.onKeyUp.bind(this))
  }

  onPointerDown(e) {
    // ignore middle(1) & clicks inside menu  
    if (e.button === 1 || e.target.closest('.menu')) return;

    if (e.button === 2 && this.app.managers.tools.activeTool) {
      this.app.managers.tools.setTool(null);
    }

    if (e.button === 0 && !this.spaceDown) {
      this.app.managers.controls.enablePan(false);
      this.app.runtime.raycast.clicked = true;
      this.app.managers.tools.onPointerDown(e);
    }

    // if panned, hasPanned = true.
    // left click pan
    if (e.button === 0) {
      if (this.spaceDown) {
        this.hasPanned = true;
        return;
      }
    }
    // if orbiting after panning, re-center camera
    else if (e.button === 2 && this.hasPanned) {
      this.app.runtime.camera.setTargetCenter();
      this.app.runtime.camera.refresh();
      this.hasPanned = false;
    }
  }

  onPointerMove(e) {
    this.app.managers.tools.onPointerMove(e);
  }

  onPointerUp(e) {
    this.app.managers.controls.enablePan(false);
    this.app.managers.tools.onPointerUp(e);
    this.app.runtime.raycast.clicked = false;
    this.isDragging = false;
  }

  onWheel(e) {
    e.preventDefault()
    this.app.managers.camera.onZoom(e.deltaY);
  }

  onKeyDown(e) {
  // Move into onKeyShortcut in tool manager
    if (e.code === 'Escape') {
      this.app.managers.tools.finalise(true);
      this.app.managers.tools.reset();
      return;
    }

    if (e.code === 'Space') {
      console.log('Space pressed');
      this.spaceDown = true;
      this.app.managers.controls.spaceDown(true);
      return;
    }
  }

  onKeyUp(e) {
    if (e.code === 'Space') {
      console.log('Space released');
      this.spaceDown = false;
      this.app.managers.controls.spaceDown(false);
    }
  }


  
  
}
