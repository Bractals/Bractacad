import * as THREE from 'three';
import Tool from './Tool.js';

export default class SelectTool extends Tool {
  constructor(app) {
    super(app);
    this.selected = null;
    this.highlightMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });
    this.originalMaterial = null;
  }

  draw() {
    if (!this.enabled || !this.raycast.object) return;

    const target = this.raycast.object;

    // Object must have userData.selectable = true;
    if (target.userData.selectable) {
      if (this.selected && this.selected !== target) this.clearSelection();

      if (this.selected !== target) {
        this.selected = target;
        this.originalMaterial = target.material;
        target.material = this.highlightMaterial;
        this.app.state.selection = [target.userData.id];
      }
    } else {
      this.clearSelection();
    }
  }

  clearSelection() {
    if (this.selected) {
      this.selected.material = this.originalMaterial;
      this.selected = null;
      this.app.state.selection = [];
    }
  }

  disable() {
    this.clearSelection();
    super.disable?.();
  }
}
