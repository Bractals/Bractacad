export class App {
  constructor() {
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.controls = null;

    // Move into sceneManager
    this.state = {
      size: null,
      drawPlane: null,
    };
    
    // Move to inputManager
    this.input = {
      spaceDown: false,
      hasPanned: false,
    };

    this.raycast = null;
    this.cube = null;
    this.build = null;
    this.axes = null;
  }

  init(config) {
    // optional init method
  }

  dispose() {
    // cleanup resources
  }
}
