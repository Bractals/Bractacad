// Store only serializable primitives, settings, IDs, and relationships in state.
// Place all instantiated Objects, Meshs, Cameras, Scenes, and WebGLRenderer in runtime.
// Managers interact with runtime and state via app.

// Rendering uses runtime.scene, runtime.camera, runtime.renderer.
// Selection, input, raycasting, and tools read from state and act on runtime.

// Never store THREE.* in state.
// It breaks serialization, cloning, undo/redo, and clean separation.

export const app = {
  // access state only for UI, undo/redo, or saving/loading
  // Use only stable, JSON-compatible data structures in state.
  // Avoid circular references, THREE.Object3D, or functions.
  state: {},
  
  runtime: {
    renderer: null,
    scene: null,
    camera: null,
    controls: null,
    raycast: null,
    size: null, // for centering camera on object
    drawPlane: null,
    axes: null,
  },

  managers: {},

  init() {
    this.initState()
    //this.initThree()
    this.initManagers()
    //this.bindEvents()
  },

  initState() {
    this.state = {
      camera: { position: [-150, 150, -450], zoom: 1 },
      tool: { current: 'select', options: {} },
      drawPlane: null,
      selection: [],
      layers: new Map(),
      sceneObjects: new Map(),
      history: { undo: [], redo: [] }
    }
  },

  initManagers() {

  }




}

