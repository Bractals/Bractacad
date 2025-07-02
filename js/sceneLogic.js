export function addSceneLogic(app, axes) {

  // Highlight the plane
  for (const plane of axes.planes) {
    const highlight = plane === app.raycast.object && plane.userData.type === 'axisPlane';
    plane.material.color.set(highlight ? 0x00ff00 : 0x808080);
  }
  // Axes plane hover/click logic
  if (
    app.raycast.object &&
    app.raycast.object.userData.type === 'axisPlane' &&
    app.raycast.clicked
  ) {
    // If mouse is clicked, create a new plane in the same orientation
    //createNewPlaneFromAxesPlane(app.raycast.object);
    app.raycast.clicked = false;
  }
}