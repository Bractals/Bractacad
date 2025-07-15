export function addResizeListener(camera, frustrumSize = 50, renderer) {
  function onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;

    camera.left = -aspect * frustrumSize / 2;
    camera.right = aspect * frustrumSize / 2;
    camera.top = frustrumSize / 2;
    camera.bottom = -frustrumSize / 2;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener('resize', onWindowResize);
  onWindowResize(); // call once to set initial size
}