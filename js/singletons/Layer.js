export default class Layer {
  constructor(name) {
    this.name = name;
    this.objects = new Map();
    this.group = new THREE.Group();
    this.group.name = name;
  }

  add(id, obj) {
    this.objects.set(id, obj);
    this.group.add(obj);
  }

  remove(id) {
    const obj = this.objects.get(id);
    if (!obj) return;
    this.group.remove(obj);
    this.objects.delete(id);
  }

  get(id) {
    return this.objects.get(id);
  }

  setVisible(visible) {
    this.group.visible = visible;
  }
}
