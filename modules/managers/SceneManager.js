import LayerManager from './LayerManager.js';

export default class SceneManager {
  constructor(app) {
    this.app = app;
    this.scene = app.runtime.scene;
    this.layerManager = new LayerManager(this.scene);

    this.raycast = app.runtime.raycast;
    this.star = app.runtime.star;
  }

  addObject(layerName, id, obj) {
    this.layerManager.addLayer(layerName);
    this.layerManager.addObjectToLayer(layerName, id, obj);
  }

  getObject(layerName, id) {
    const layer = this.layerManager.getLayer(layerName);
    return layer?.get(id);
  }

  removeObject(layerName, id) {
    const layer = this.layerManager.getLayer(layerName);
    if (layer) {
      layer.delete(id);
    }
  }

  updateActiveObjectCenter() {
    // draw a box around the active object then get its center
    const box = new THREE.Box3().setFromObject(mesh);
    const center = new THREE.Vector3();
    box.getCenter(center);
    // Use camera.position.set(...) relative to center for framing.
    this.app.runtime.camera.lookAt(center);
  }

  starLogic(Drawplane) {
    // Highlight the plane
    for (const plane of this.star.planes) {
      const highlight = plane === this.raycast.object && plane.userData.type === 'axisPlane';
      plane.material.color.set(highlight ? 0x66ff66 : 0x808080);
    }

    // Star plane hover/click logic
    if (
      this.raycast.object &&
      this.raycast.object.userData.type === 'axisPlane' &&
      this.raycast.clicked
    ) {
      // If mouse is clicked, create a new plane in the same orientation
      let drawPlane = createDrawPlane(this.raycast.object, this.app.runtime.size, Drawplane);
      this.app.runtime.drawPlane = drawPlane;

      // Remove the star and add the new draw plane to the scene
      this.app.runtime.scene.remove(this.star);
      this.app.runtime.scene.add(drawPlane);
      
      // Reset clicked state
      this.raycast.clicked = false;
    }
  }





}

function createDrawPlane(object, size, Drawplane) {
  const drawPlane = new Drawplane(size);
  // Apply the object's world matrix to the new draw plane
  drawPlane.applyMatrix4(object.matrixWorld);

  return drawPlane;
}