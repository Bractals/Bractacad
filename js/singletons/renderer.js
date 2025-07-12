import * as THREE from 'three';

export default function createRenderer() {
  const canvas = document.querySelector('#background');

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  return renderer;
}
