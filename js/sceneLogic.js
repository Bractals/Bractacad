export function addSceneLogic(app, raycast, axes, Plane) {

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
    // If mouse is clicked, create a new plane in the same orientation
    createNewPlaneFromAxesPlane(app, raycast.object, axes, Plane);
    raycast.clicked = false;
  }
}

function createNewPlaneFromAxesPlane(app, object, axes, Plane) {
  // create new draw plane
  const drawPlane = Plane;
  object.updateMatrixWorld(true);
  drawPlane.applyMatrix4(object.matrixWorld);

  app.scene.remove(axes);
  app.state.drawPlane = drawPlane;
  app.scene.add(drawPlane); 


}