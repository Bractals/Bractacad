import * as THREE from 'three';

// Shared pieces
import createRenderer from './renderer.js';
import scene from './scene.js';
import Camera from './Camera.js';
import createControls from './controls.js';
import cube from './cube.js';
import raycast, { castRay } from './raycast.js';

import Axes from './Axes.js';
import axisPlanes from './AxisPlanes.js';

import { runStartupAnimation } from './startupAnimation.js';

// Utility
import { setupSettings } from './settings.js';
import { addResizeListener} from './resize.js';
import { initListeners } from './listeners.js';
import { initUIButtons } from './uiButtons.js';

// Tools
import ToolManager from './tools/ToolManager.js';
import LineTool from './tools/LineTool.js';
import RectangleTool from './tools/RectangleTool.js';

// application shared state manager
import { app } from './app.js';

// 2d sketches and 3d objects
import Build from './Build.js';



let renderer, controls;

// Camera
let camera, center, defaultOrbit;

// White background
let background = new THREE.Color(0xffffff);

// Camera settings
let cameraZoom, cameraFar, frustrumSize;

// Run startup animation, then start main app
//runStartupAnimation(renderer, main);

const size = 1000;

let axes;

// Where 2D drawings and 3D objects are stored
let build;

// Tools
let toolManager, lineToolInstance, rectangleToolInstance;

init();
animate();

function init () {
  scene.background = background;

  renderer = createRenderer();

  // center to draw plane.

  // Set camera position and orientation;
  // center at origin to start
  center = new THREE.Vector3(0, 0, 0);
  defaultOrbit = new THREE.Vector3(-size, size, size);

  // make cube size based on the two furthest vertexes in the object across all layers.

  cameraZoom = 3.4 / size;
  cameraFar = size * 4;

  // camera
  camera = new Camera(defaultOrbit, center, cameraFar);

  // Orbit controls
  controls = createControls(camera, renderer);
  camera.attachControls(controls);
  // set camera
  camera.setPos(defaultOrbit);
  camera.setTarget(center);
  camera.zoom = cameraZoom;

  // Create Axes
  axes = new Axes(size);

  // Prepare 3D build box
  build = new Build(cube.planes, size);
  
  // tools
  toolManager = new ToolManager();
  //lineToolInstance = new LineTool(scene, raycast, cube, build);
  rectangleToolInstance = new RectangleTool(scene, raycast, cube, build);

  // Inject into appContext
  app.renderer = renderer;
  app.scene = scene;
  app.camera = camera;
  app.controls = controls;
  app.raycast = raycast;
  app.cube = cube;
  app.build = build;

  // update camera
  app.camera.refresh();

  // Dynamic resizing of window
  addResizeListener(app.camera, frustrumSize, app.renderer);

  // Ready settings
  setupSettings();

  // Set up listeners
  initListeners(toolManager, lineToolInstance);
  // Set up UI logic
  initUIButtons({
    toolManager,
    lineToolInstance,
    rectangleToolInstance
  });

  // Add the CAD cube to scene
  //app.scene.add(app.cube);

  // Add axes
  app.scene.add(axes);

  // add axes to start
  app.scene.add(axisPlanes);

  // Add the build box
  app.scene.add(app.build);

  // Add lights for 3d object
  // Ambient light for base visibility
  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);

  // Directional light like a headlight
  const light = new THREE.DirectionalLight(0xffffff, 0.8);
  light.position.set(app.cube.pSize, app.cube.pSize, -app.cube.pSize);
  scene.add(light);

  // Optional: camera-attached headlight
  camera.add(new THREE.DirectionalLight(0xffffff, 0.5));

}

function animate () {
  // Update grid scale
  //app.cube.scaleGrids(app.renderer, app.camera);

  // Update label scale
  //app.cube.scaleLabels(app.camera);

  // from raycast.js
  castRay();

  app.controls.update();
  app.camera.updateProjectionMatrix();
  app.renderer.render(app.scene, app.camera);

  // tells browser to perform animation
  requestAnimationFrame(animate);
}