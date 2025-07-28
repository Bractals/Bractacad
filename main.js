import * as THREE from 'three';

// Shared pieces
import createRenderer from './modules/renderer.js';
import scene from './modules/scene.js';
import Camera from './modules/Camera.js';
import controls from './modules/controls.js';
import Drawplane from './modules/Drawplane.js';

//import cube from './modules/cube.js';
import raycast, { castRay } from './modules/raycast.js';

import Star from './modules/Star.js';
import axes from './modules/Axes.js';

//import { runStartupAnimation } from './startupAnimation.js';

// Utility
//import { setupSettings } from './modules/settings.js';
import { addResizeListener} from './modules/resize.js';

// application shared state manager
import { app } from './modules/app.js';

// Managers
import CameraManager from './modules/managers/CameraManager.js';
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

// Default size of starting axis planes, distances from lights
let size = 100;

init();
animate();

function init () {

  const defaultOrbit = new THREE.Vector3(-size, size*1.25, size);
  let cameraZoom = 0.2;
  let cameraFar = size * 6;
  let frustrumSize = 50;

  // Setup
  app.runtime.renderer = createRenderer();
  app.runtime.scene = scene;
  app.runtime.camera = new Camera();

  app.runtime.raycast = raycast;
  app.runtime.size = size;

  // canvas background
  app.runtime.scene.background = background;

  // Orbit controls
  app.runtime.controls = controls(app.runtime.camera, app.runtime.renderer);

  // After controls and other runtime values are created
  app.initManagers = function () {
    this.managers.camera = new CameraManager(this);
    this.managers.controls = new ControlsManager(this);
    this.managers.input = new InputManager(this);
    this.managers.tools = new ToolManager(this);
    this.managers.scene = new SceneManager(this);
    this.managers.file = new FileManager(this);
    this.managers.ui = new UIManager(this);
  };

  // Initialise app state and managers.
  app.init();

  // set camera
  app.managers.camera.setPosition(defaultOrbit);
  app.managers.camera.setTarget(new THREE.Vector3(0, 0, 0));
  app.managers.camera.setZoom(cameraZoom);
  app.managers.camera.setFar(cameraFar);

  // update camera
  app.managers.camera.refresh();

  // Dynamic resizing of window
  addResizeListener(app.runtime.camera, frustrumSize, app.runtime.renderer);

  // Ready settings
  //setupSettings();


  // First layer and star
  let star = new Star(size);
  //app.managers.scene.addObject("layer 1", star);


  // add axes
  app.runtime.scene.add(axes);

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
  app.managers.camera.attach(new THREE.DirectionalLight(0xffffff, 0.5));
}

function animate () {

  // from raycast.js
  castRay();

  app.runtime.controls.update();
  app.runtime.renderer.render(app.runtime.scene, app.runtime.camera);

  // Set up scene logic
  //addSceneLogic(app, Drawplane);
  //app.managers.scene.activeObjectLogic(Drawplane);

  // active object logic


  // Update label scale
  axes.scaleLabels(app.runtime.camera);

  // tells browser to perform animation
  requestAnimationFrame(animate);
}