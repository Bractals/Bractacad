import LayerManager from './LayerManager.js';

class SceneManager {
  constructor(scene) {
    this.scene = scene;
    this.layerManager = new LayerManager(scene);
  }

  addObject(layerName, id, obj) {
    this.layerManager.addLayer(layerName);
    this.layerManager.addObjectToLayer(layerName, id, obj);
  }

  getObject(layerName, id) {
    const layer = this.layerManager.getLayer(layerName);
    return layer?.get(id);
  }
}