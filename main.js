import * as THREE from 'three';

// Shared pieces
import createRenderer from './modules/renderer.js';
import scene from './modules/scene.js';
import Camera from './modules/Camera.js';
import createControls from './modules/controls.js';
import { addSceneLogic } from './modules/sceneLogic.js';
import Drawplane from './modules/Drawplane.js';

//import cube from './modules/cube.js';
import raycast, { castRay } from './modules/raycast.js';

import Axes from './modules/Axes.js';

//import { runStartupAnimation } from './startupAnimation.js';

// Utility
//import { setupSettings } from './modules/settings.js';
import { addResizeListener} from './modules/resize.js';

// application shared state manager
import { app } from './modules/app.js';

// Managers
import ControlsManager from './modules/managers/ControlsManager.js';
import FileManager from './modules/managers/FileManager.js';
import InputManager from './modules/managers/InputManager.js';
import LayerManager from './modules/managers/LayerManager.js';
import SceneManager from './modules/managers/SceneManager.js';
import ToolManager from './modules/managers/ToolManager.js';
import UIManager from './modules/managers/UIManager.js';


// White background
let background = new THREE.Color(0xffffff);

// Run startup animation, then start main app
//runStartupAnimation(renderer, main);

// Default size of starting axis planes
let size = 100;

init();
animate();

function init () {

  // Set camera position and orientation;
  // center at origin to start
  const center = new THREE.Vector3(0, size/2, 0);
  const defaultOrbit = new THREE.Vector3(-size, size, size-400);
  let cameraZoom = 0.2;
  let cameraFar = size * 6;
  let frustrumSize = 50;


  // Inject into app context
  app.runtime.renderer = createRenderer();
  app.runtime.scene = scene;
  app.runtime.camera = new Camera(defaultOrbit, center, cameraZoom, cameraFar);

  app.runtime.raycast = raycast;
  app.runtime.size = size;
  app.runtime.axes = new Axes(size);

  // canvas background
  app.runtime.scene.background = background;

  // Orbit controls
  app.runtime.controls = createControls(app.runtime.camera, app.runtime.renderer);
  app.runtime.camera.attachControls(app.runtime.controls);

  // set camera
  app.runtime.camera.setPos(defaultOrbit);
  app.runtime.camera.setTarget(center);
  app.runtime.camera.zoom = cameraZoom;

  // After controls and other runtime values are created
  app.initManagers = function () {
    this.managers.controls = new ControlsManager(this);
    this.managers.input = new InputManager(this);
    this.managers.tools = new ToolManager(this);
    this.managers.scene = new SceneManager(this);
    this.managers.layers = new LayerManager(this);
    this.managers.file = new FileManager(this);
    this.managers.ui = new UIManager(this);
  };

  // update camera
  app.runtime.camera.refresh();

  // Dynamic resizing of window
  addResizeListener(app.runtime.camera, frustrumSize, app.runtime.renderer);

  // Ready settings
  //setupSettings();

  // Initialise app state and managers.
  app.init();

  // Add axes
  app.runtime.scene.add(app.runtime.axes);

  // Add the build box
  //app.scene.add(app.build);

  // Add lights for 3d object
  // Ambient light for base visibility
  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  app.runtime.scene.add(ambient);

  // Directional light like a headlight
  const light = new THREE.DirectionalLight(0xffffff, 0.8);
  // Should update to account for object size
  light.position.set(size+100, size, -size+100);
  app.runtime.scene.add(light);

  // camera-attached headlight
  app.runtime.camera.add(new THREE.DirectionalLight(0xffffff, 0.5));

}

function animate () {
  // Update label scale
  app.runtime.axes.scaleLabels(app.runtime.camera);

  // from raycast.js
  castRay();

  // Set up scene logic
  addSceneLogic(app, Drawplane);

  app.runtime.controls.update();
  app.runtime.camera.updateProjectionMatrix();
  app.runtime.renderer.render(app.runtime.scene, app.runtime.camera);

  // tells browser to perform animation
  requestAnimationFrame(animate);
}