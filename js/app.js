export const app = {
  renderer: null,
  scene: null,
  camera: null,
  controls: null,
  sceneLogic: null,

  state: {
    size: null,
    activeDrawPlane: false,
    activeObject: null
  },

  input: {
    spaceDown: false,
    hasPanned: false,
  },

  raycast: null,
  cube: null,
  build: null,
  axes: null
};