// Handles raw pointer and keyboard events on canvas or
// global scope (e.g., mouse drag, key presses, wheel zoom).
import * as THREE from 'three';

export default class InputManager {
  constructor(app, castRay) {
    this.app = app;
    this.layerManager = this.app.managers.scene.layerManager;
    this.canvas = app.runtime.renderer.domElement;

    this.leftPointerDown = false;
    this.spaceDown = false;
    this.hasPanned = false;
    this.isDragging = false;

    // Main menu
    this.menu = document.querySelector('#menu');
    this.toggleMenuBtn = document.querySelector('#toggle-menu-btn');

    // Inspector
    this.inspector = document.querySelector('#inspector');
    this.toggleInspectorBtn = document.querySelector('#toggle-inspector-btn');
    // All tab sections in inspector
    this.inspectorTabs = Array.from(document.querySelectorAll('.tab'));

    this.layers = this.app.runtime.layers;

    this.init();
  }

  init() {

    // Restore menu state
    if (localStorage.getItem('menuCollapsed') === 'true') {
      this.menu.classList.add('collapsed');
      this.toggleMenuBtn.classList.add('collapsed');
      this.toggleMenuBtn.innerHTML = '&#x25B6;'; // ▶
      this.app.managers.ui.menuOpen = false;
    }
    // Restore inspector state
    if (localStorage.getItem('inspectorCollapsed') === 'true') {
      this.inspector.classList.add('collapsed');
      this.toggleInspectorBtn.classList.add('collapsed');
      this.toggleInspectorBtn.innerHTML = '&#x25B6;'; // ▶
      this.app.managers.ui.inspectorOpen = false;
    }
    // Restore inspector tab states
    this.inspectorTabs.forEach(tab => {
      let tabId = tab.id;
      let button = tab.querySelector('.toggle-tab-btn');
      let arrow = button.querySelector('.arrow img');

      if (localStorage.getItem(`${tabId}Collapsed`) === 'true') {
        tab.classList.add('collapsed');
        arrow.src = this.app.managers.ui.arrow_closed;
      } else {
        arrow.src = this.app.managers.ui.arrow_open;
      }
    });

    this.restoreToggles();
    this.restoreLayers();

    // unhides root document element once UI state is restored
    // Removing this blocks DOM content from loading
    document.documentElement.classList.remove('preload-state');
  }

  restoreToggles() {
    //localStorage.removeItem('showAxes');
    //localStorage.removeItem('showStar');

    // Set default to show or restore checkbox state for Axes
    let axesState = localStorage.getItem('showAxes');
    if (!axesState || axesState === 'true') {
      this.app.runtime.axes.visible = true;
      this.app.managers.ui.toggleAxes.checked = true;
    } else {
      this.app.runtime.axes.visible = false;
    }
    // Set default to show or restore checkbox state for Star
    let starState = localStorage.getItem('showStar');
    if (!starState || starState === 'true' || !this.app.runtime.drawPlane) {
      this.app.runtime.star.visible = true;
      this.app.managers.ui.toggleStar.checked = true;
    } else {
      this.app.runtime.star.visible = false;
    }
  }

  updateLayers() {
    // update localStorage
    //localStorage.setItem('layers', JSON.stringify([...this.app.runtime.layers.entries()]));
    
    const keys = [...this.layers.keys()];
    
    localStorage.setItem('layers', JSON.stringify(keys));

  }

  restoreLayers() {
    // Emergency clear layers from local storage
    //localStorage.removeItem('layers');

    // Get layers array from localStorage

    // const layers = new Map(Array.isArray(parsed) ? parsed : []);

    let raw = localStorage.getItem('layers');
    let layers;

    try {
      layers = JSON.parse(raw);
      if (!Array.isArray(layers)) layers = [];
    } catch {
      layers = [];
    }

    // Restore layers
    if (layers.length > 0) {
      // for (let [id, group] of layers) {
      //   this.addLayer({ id, group });
      //   console.log(id);
      //   // layer data (restoreLayer())
      // }
      for (let id of layers) {
        this.addLayer(id);
      }
      console.log('layers restored: ' + layers);
    } else {
      localStorage.removeItem('layers');
      this.addLayer();
      console.log('No layers found: default layer added');
    }

    // must only contain serializable data
    // const serializableLayers = {};

    // for (const [name, layer] of layers.entries()) {
    //   serializableLayers[name] = {
    //     objects: layer.group.children.map(obj => ({
    //       type: obj.type,
    //       position: obj.position.toArray(),
    //       rotation: obj.rotation.toArray(),
    //       scale: obj.scale.toArray(),
    //       geometry: obj.geometry?.type, // e.g., 'BoxGeometry'
    //       material: {
    //         type: obj.material?.type,
    //         color: obj.material?.color?.getHex()
    //       }
    //     }))
    //   };
    // }

    // localStorage.setItem('layers', JSON.stringify(serializableLayers));



  }

  addLayer(id) {

    let layer = id;

    // ui layer
    if (layer) {
      layer = this.app.managers.ui.newLayer(layer);
    } else {
      layer = this.app.managers.ui.newLayer();
    }

    // 3d group
    this.layerManager.addLayer(layer);
    // update localStorage
    this.updateLayers();
  }

  removeLayer(name) {
    console.log('deleting: ' + name);
    this.app.runtime.layers.delete(name);
    this.updateLayers();
  }

  restoreLayerData(layer) {

    // Serialize the new layer
    // for each object in layer

    // Assume `layer` is a Map of name -> Group
    // const layerData = {};

    // for (const [name, group] of layer.entries()) {
    //   layerData[name] = group.children.map(obj => ({
    //     type: obj.type,
    //     position: obj.position.toArray(),
    //     rotation: obj.rotation.toArray(),
    //     scale: obj.scale.toArray(),
    //     geometry: obj.geometry?.parameters || null,
    //     material: {
    //     color: obj.material?.color?.getHex(),
    //     // Add more properties as needed
    //     }
    //   }));
    // }

    // Add new layer to array
    //this.layers.push(layerData);
    // To restore, parse the data and reconstruct the Group and its children
    // using THREE.Mesh, THREE.BoxGeometry, THREE.MeshBasicMaterial, etc.

    // Save back to localStorage
    localStorage.setItem('layers', JSON.stringify(this.layers));
  }

  // Serialize and store three js objects
  // const json = object.toJSON();
  // localStorage.setItem('myObject', JSON.stringify(json));

  // Retrieve and parse
  // const loader = new THREE.ObjectLoader();
  // const data = JSON.parse(localStorage.getItem('myObject'));
  // const object = loader.parse(data);



  
}
