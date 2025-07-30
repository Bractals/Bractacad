import * as THREE from 'three';
import LayerManager from './LayerManager.js';

export default class SceneManager {
  constructor(app, Drawplane) {
    this.app = app;
    this.scene = app.runtime.scene;
    this.raycast = app.runtime.raycast;
    this.star = app.runtime.star;
    this.Drawplane = Drawplane;

    this.layerManager = new LayerManager(this.scene);
  }

  addObject(layerName, obj) {
    this.layerManager.addLayer(layerName);
    this.layerManager.addObjectToLayer(layerName, obj);
  }

  removeObject(layerName, obj) {
    const layer = this.layerManager.getLayer(layerName);
    if (layer) layer.remove(obj);
  }

  setActiveObject() {

  }

  setActiveLayer(name) {
    if (!name || name === null) {
      this.app.runtime.activeLayer = null;
      console.log("active layer: " + this.app.runtime.activeLayer);
      return;
    } else {
      this.app.runtime.activeLayer = this.layerManager.getLayer(name);
    }
  }

  setActiveDrawPlane(drawPlane) {
    this.app.runtime.drawPlane = drawPlane;
  }

  updateActiveObjectCenter(mesh) {
    // draw a box around the active object then get its center
    const box = new THREE.Box3().setFromObject(mesh);
    
    // double check this code
    const center = new THREE.Vector3(box.getCenter());
    // Use camera.position.set(...) relative to center for framing.
    this.app.runtime.camera.lookAt(center);
  }

  activeObjectLogic(obj){

  }

  starLogic(plane) {
    const activeLayer = this.app.runtime.activeLayer;
    // return if not layer selected or there is already a draw plane somewhere
    if (!activeLayer || this.app.runtime.drawPlane) return;

    let id = plane.name;

    // If already selected, create draw plane from that star plane
    if (plane.material.color.getHex() === this.star.colours[id]) {

      // Create new draw plane
      const drawPlane = createDrawPlane(plane, this.app.runtime.size, this.Drawplane);
      // draw plane to layer
      this.app.managers.scene.addObject(activeLayer.name, drawPlane);
      // Add as active draw plane in app state
      this.setActiveDrawPlane(drawPlane);

      // hide the star and add the new draw plane to the scene
      this.app.managers.ui.toggleStar.checked = !this.app.managers.ui.toggleStar.checked;
      this.app.managers.ui.toggleStar.dispatchEvent(new Event('change'));

      for (const plane of this.star.planes) {
        plane.material.color.set(0x808080);
      }

      // Reset clicked state
      this.raycast.clicked = false;
    } else {
      plane.material.color.set(plane ? this.star.colours[id] : 0x808080);
    }
  }






}


function createDrawPlane(object, size, Drawplane) {
  const drawPlane = new Drawplane(size);
  // Apply the object's world matrix to the new draw plane
  drawPlane.applyMatrix4(object.matrixWorld);

  return drawPlane;
}