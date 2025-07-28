import * as THREE from 'three';
import Layer from '../Layer.js';

export default class LayerManager {
  constructor(scene) {
    this.scene = scene;
    this.layers = new Map();
  }

  addLayer(name) {
    if (!this.layers.has(name)) {
      const layer = new Layer(name);
      this.layers.set(name, layer);
      this.scene.add(layer.group);
    }
  }

  getLayer(name) {
    return this.layers.get(name);
  }

  removeLayer(name) {
    const layer = this.layers.get(name);
    if (!layer) return;
    this.scene.remove(layer.group);
    this.layers.delete(name);
  }

  addObjectToLayer(name, obj) {
    const layer = this.layers.get(name);
    if (!layer) throw new Error(`Layer ${name} not found`);
    layer.add(obj);
  }

  setAllLayersVisible(visible) {
    for (const layer of this.layers.values()) {
      layer.setVisible(visible);
    }
  }

  toggleLayerVisible(name, visible) {
    const layer = this.layers.get(name);
    if (layer) layer.setVisible(visible);
  }

  forEachLayer(fn) {
    for (const layer of this.layers.values()) fn(layer);
  }
}
