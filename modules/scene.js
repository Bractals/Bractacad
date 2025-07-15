import * as THREE from 'three';

// Scene is like a container for all the objects
const scene = new THREE.Scene();

// z axis goes away from camera as x goes to the right
scene.scale.z = -1;

export default scene;