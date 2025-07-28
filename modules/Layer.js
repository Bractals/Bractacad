import * as THREE from 'three';

export default class Layer {
  constructor(name) {
    this.name = name;
    this.objects = new Map();
    this.group = new THREE.Group();
    this.group.name = name;
  }

  add(obj) {
    this.objects.set(obj);
    this.group.add(obj);
  }

  remove(obj) {
    this.group.remove(obj);
    this.objects.delete(obj);
  }

  setVisible(visible) {
    this.group.visible = visible;
  }
}
