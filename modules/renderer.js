import * as THREE from 'three';

export default function createRenderer() {
  const canvas = document.querySelector('#canvas');

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas
  });

  renderer.setPixelRatio(window.devicePixelRatio);

  function resizeRenderer() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
  }

  window.addEventListener('resize', resizeRenderer);
  resizeRenderer(); // Initial resize

  return renderer;
}