export function addSceneLogic(app, Drawplane) {

  let raycast = app.runtime.raycast;
  let axes = app.runtime.axes;

  // Highlight the plane
  for (const plane of axes.planes) {
    const highlight = plane === raycast.object && plane.userData.type === 'axisPlane';
    plane.material.color.set(highlight ? 0x00ff00 : 0x808080);
  }

  // Axes plane hover/click logic
  if (
    raycast.object &&
    raycast.object.userData.type === 'axisPlane' &&
    raycast.clicked
  ) {
    const drawPlane = new Drawplane(app.runtime.size);
    // If mouse is clicked, create a new plane in the same orientation
    createDrawPlane(app, raycast.object, axes, drawPlane);
    raycast.clicked = false;
  }
}

function createDrawPlane(app, object, axes, drawPlane) {
  object.updateMatrixWorld(true);
  drawPlane.applyMatrix4(object.matrixWorld);

  app.runtime.scene.remove(axes);
  app.runtime.drawPlane = drawPlane;
  app.runtime.scene.add(drawPlane);


}