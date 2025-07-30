// Handles DOM-bound elements (buttons, panels, sliders),
// event bindings, and dispatches UI-specific actions.
import * as THREE from 'three';

export default class UIManager {
  constructor(app) {
    this.app = app;

    this.dropdownActive = false;     // is a dropdown currently open
    this.canHoverSwitch = false;     // is hover-switching allowed
    
    // Main menu
    this.menu = document.querySelector('#menu');
    this.toggleMenuBtn = document.querySelector('#toggle-menu-btn');
    this.menuOpen = true;

    // Inspector
    this.inspector = document.querySelector('#inspector');
    this.inspectorOpen = true;
    this.toggleInspectorBtn = document.querySelector('#toggle-inspector-btn');
    // All tab sections in inspector
    this.inspectorTabs = Array.from(document.querySelectorAll('.tab'));
    // Inspector tab arrows
    this.arrow_open = '../../icons/arrow-open.svg';
    this.arrow_closed = '../../icons/arrow-closed.svg';

    // Toggle a tab in inspector
    this.toggleTabBtn = document.querySelectorAll('.toggle-tab-btn');

    // Toggle axes button
    this.toggleAxes = document.getElementById('toggle-axes');
    // Toggle star button
    this.toggleStar = document.getElementById('toggle-star');

    // Draw Plane
    this.drawPlane_length = document.getElementById('drawPlane-length');

    // Layers from storage or empty
    this.layerNames = [];
    // Layers container
    this.layers_parent = document.getElementById('layers-container');
    // New layer button
    this.newLayerBtn = document.getElementById('new-layer-btn');
    // Delete layer button
    this.deleteLayerBtn = document.getElementById('delete-layer-btn');
    
    // Tool carousel
    this.carousel = document.querySelector('.tool-carousel');
    // tool buttons
    this.lineBtn = document.getElementById('line-btn');
    this.rectBtn = document.getElementById('rectangle-btn');

    // About section
    this.aboutBtn = document.querySelector('#menu button.about');
    this.aboutModal = document.getElementById('about-section');
    this.closeAboutBtn = document.getElementById('close-about-btn');

    // View section buttons
    this.toggleFullscreen;
    this.fullscreenBtn = document.getElementById('fullscreen-btn');
    this.centerBtn = document.getElementById('center-btn');

    // this.saveBtn = document.getElementById('save-btn');

    this.initUI();
  }

  initUI() {
    // Click to open a top-level menu
    this.menu.addEventListener('pointerdown', (e) => {
      const button = e.target.closest('.dropdown-toggle');
      if (button) {
        const li = button.closest('li');
        const isOpen = li.classList.contains('open');
      
        document.querySelectorAll('li.open').forEach(li => li.classList.remove('open'));
        
        if (!isOpen) {
          li.classList.add('open');
          this.dropdownActive = true;
          this.canHoverSwitch = true; // allow hover-switching
        } else {
          this.dropdownActive = false;
          this.canHoverSwitch = false;
        }

        e.stopPropagation();
      }
    });
    // Hover behavior for submenus
    this.menu.querySelectorAll('ul li').forEach((li) => {
      li.addEventListener('pointerenter', () => {
        if (this.dropdownActive && this.canHoverSwitch && li.querySelector('.dropdown')) {
          // Only close siblings, not all
          const parentUl = li.parentElement;
          parentUl.querySelectorAll(':scope > li.open').forEach(openLi => {
            if (openLi !== li) openLi.classList.remove('open');
          });
          li.classList.add('open');
        }
      });
    });
    // Click outside to close all
    document.addEventListener('pointerdown', (e) => {
      if (!this.menu.contains(e.target)) {
        document.querySelectorAll('li.open').forEach(li => li.classList.remove('open'));
        this.dropdownActive = false;
        this.canHoverSwitch = false;
      }
    });
    // leave menus
    this.menu.addEventListener('pointerleave', () => {
      if (this.dropdownActive) {
        this.canHoverSwitch = false;
      }
    });
    // Menu toggle
    this.toggleMenuBtn.addEventListener('click', () => {
      this.menuOpen = !this.menuOpen;

      if (this.menuOpen) {
        this.toggleMenuBtn.innerHTML = '&#x25C0;'; // ◀
        this.menu.classList.remove('collapsed');
        this.toggleMenuBtn.classList.remove('collapsed');
        localStorage.setItem('menuCollapsed', 'false');
      } else {
        this.toggleMenuBtn.innerHTML = '&#x25B6;'; // ▶
        this.menu.classList.add('collapsed');
        this.toggleMenuBtn.classList.add('collapsed');
        localStorage.setItem('menuCollapsed', 'true');
      }
    });

    // Inspector toggle
    this.toggleInspectorBtn.addEventListener('click', () => {
      this.inspectorOpen = !this.inspectorOpen;

      if (this.inspectorOpen) {
        this.toggleInspectorBtn.innerHTML = '&#x25B6;'; // ▶
        this.inspector.classList.remove('collapsed');
        this.toggleInspectorBtn.classList.remove('collapsed');
        localStorage.setItem('inspectorCollapsed', 'false');
      } else {
        this.toggleInspectorBtn.innerHTML = '&#x25C0;'; // ◀
        this.inspector.classList.add('collapsed');
        this.toggleInspectorBtn.classList.add('collapsed');
        localStorage.setItem('inspectorCollapsed', 'true');
      }
    });
    // Tab toggle for each section in inspector
    this.toggleTabBtn.forEach(button => {
      button.addEventListener('click', () => {
        const tab = button.closest('.tab');
        const tabId = tab.id;

        tab.classList.toggle('collapsed');

        const arrow = button.querySelector('.arrow img');

        if (tab.classList.contains('collapsed')) {
          arrow.src = this.arrow_closed;
          localStorage.setItem(`${tabId}Collapsed`, 'true');
        } else {
          arrow.src = this.arrow_open;
          localStorage.setItem(`${tabId}Collapsed`, 'false');
        }

      });
    });

    // Toggle axes
    this.toggleAxes.addEventListener('change', () => {
      let showAxes = this.toggleAxes.checked;
      this.app.runtime.axes.visible = showAxes;
      localStorage.setItem(`showAxes`, `${showAxes}`);
    });
    // Toggle star
    this.toggleStar.addEventListener('change', () => {
      let showStar = this.toggleStar.checked;
      this.app.runtime.star.visible = showStar;
      localStorage.setItem(`showStar`, `${showStar}`);
    });


    // Tool carousel
    this.carousel.addEventListener('wheel', (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault(); // stop vertical scroll
        this.carousel.scrollLeft += e.deltaY * 0.1; // scroll sideways
      }
    }, { passive: false });
    // Tool button event listeners
    this.lineBtn.addEventListener('click', () => {
      this.app.managers.tools.setTool('line');
      this.updateToolUI();
    });
    this.rectBtn.addEventListener('click', () => {
      this.app.managers.tools.setTool('rectangle');
      this.updateToolUI();
    });

    // Draw Plane Menu
    this.drawPlane_length.addEventListener('input', (e) => {
      let length = e.target.value;
      //console.log(length);
    });

    // Layers
    // Create new layer
    this.newLayerBtn.addEventListener('click', (e) => {
      let newLayer = this.newLayer();
      this.app.managers.scene.layerManager.addLayer(newLayer.id);
    });
    // Delete layer
    this.deleteLayerBtn.addEventListener('click', (e) => {
      const selected = document.querySelector('.layer.selected');
      if (!selected) return;
      const name = selected.id;
      selected.remove();

      // Remove layer from scene
      this.app.managers.scene.layerManager.removeLayer(name);

      this.layerNames = this.layerNames.filter(n => n !== name);
      localStorage.setItem('layerNames', JSON.stringify(this.layerNames));

    });
    // Select layer

    // Drag and drop layers
    this.layers_parent.addEventListener('dragstart', e => {
      const li = e.target.closest('li.layer');
      if (!li) return;
      li.classList.add('dragging');
      e.dataTransfer.setData('text/plain', li.id);
    });
    this.layers_parent.addEventListener('dragend', e => {
      const li = e.target.closest('li.layer');
      if (!li) return;
      li.classList.remove('dragging');
    });
    this.layers_parent.addEventListener('dragover', e => {
      e.preventDefault();
      const dragging = this.layers_parent.querySelector('.layer.dragging');
      if (!dragging) return;

      const after = getDragAfterElement(this.layers_parent, e.clientY);
      if (after === null) {
        this.layers_parent.appendChild(dragging);
      } else {
        this.layers_parent.insertBefore(dragging, after);
      }
    });


    // Fullscreen toggle
    this.fullscreenBtn.addEventListener('click', () => {
      const elem = document.documentElement;
      if (!document.fullscreenElement &&
          !document.webkitFullscreenElement &&
          !document.msFullscreenElement) {
        console.log('Requesting fullscreen');
        elem.requestFullscreen?.() || elem.webkitRequestFullscreen?.() || elem.msRequestFullscreen?.();
      } else {
        document.exitFullscreen?.() || document.webkitExitFullscreen?.() || document.msExitFullscreen?.();
      }
    });
    // Center camera on selected object
    this.centerBtn.addEventListener('click', () => {
      this.app.managers.camera.setPosition(new THREE.Vector3(-100, 100 * 1.25, 100));
      this.app.managers.camera.setTarget(new THREE.Vector3(0, 0, 0));
    });

    // About section
    this.aboutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.aboutModal.style.display = 'flex';
    });
    this.closeAboutBtn.addEventListener('click', () => {
      this.aboutModal.style.display = 'none';
    });
    // Close modal if clicking backdrop
    this.aboutModal.addEventListener('click', (e) => {
      if (e.target === this.aboutModal) {
        this.aboutModal.style.display = 'none';
      }
    });

    // this.saveBtn.addEventListener('click', () => {
    //   this.app.managers.file.save();
    // });

    // Restore menu state
    if (localStorage.getItem('menuCollapsed') === 'true') {
      this.menu.classList.add('collapsed');
      this.toggleMenuBtn.classList.add('collapsed');
      this.toggleMenuBtn.innerHTML = '&#x25B6;'; // ▶
      this.menuOpen = false;
    }
    // Restore inspector state
    if (localStorage.getItem('inspectorCollapsed') === 'true') {
      this.inspector.classList.add('collapsed');
      this.toggleInspectorBtn.classList.add('collapsed');
      this.toggleInspectorBtn.innerHTML = '&#x25B6;'; // ▶
      this.inspectorOpen = false;
    }
    // Restore inspector tab states
    this.inspectorTabs.forEach(tab => {
      let tabId = tab.id;
      let button = tab.querySelector('.toggle-tab-btn');
      let arrow = button.querySelector('.arrow img');

      if (localStorage.getItem(`${tabId}Collapsed`) === 'true') {
        tab.classList.add('collapsed');
        arrow.src = this.arrow_closed;
      } else {
        arrow.src = this.arrow_open;
      }
    });
    // Restore checkbox state for Axes
    if (localStorage.getItem('showAxes') === 'true') {
      this.app.runtime.axes.visible = true;
    } else {
      this.app.runtime.axes.visible = false;
    }
    // Restore checkbox state for Star
    if (localStorage.getItem('showStar') === 'true') {
      this.app.runtime.star.visible = true;
    } else {
      this.app.runtime.star.visible = false;
    }

    // Emergency clear layers from local storage
    //localStorage.removeItem('layerNames');

    // Restore layers
    this.layerNames = JSON.parse(localStorage.getItem('layerNames')) || [];

    if (this.layerNames.length > 0) {
      for (let name of this.layerNames) {
        this.newLayer(name);
        this.app.managers.scene.layerManager.addLayer(name);
        //const layer = this.app.managers.scene.layerManager.getLayer(name);
      }
      console.log('layers restored');
    } else {
      localStorage.removeItem('layerNames');
      this.newLayer();
      console.log('No layers found: default layer added');
    }




    // unhides root document element once UI state is restored
    // Removing this blocks DOM content from loading
    document.documentElement.classList.remove('preload-state');
  }

  updateToolUI() {
    this.lineBtn.classList.toggle('active', this.app.managers.tools.activeTool === this.app.managers.tools.tools.line);
    this.rectBtn.classList.toggle('active', this.app.managers.tools.activeTool === this.app.managers.tools.tools.rectangle);
  }

  newLayer(name) {
    const li = document.createElement('li');
    li.className = 'layer';
    
    // create unique layer name
    li.id = name ? name : this.uniqueLayerName('new-layer');

    li.draggable = true;
    let pointerDownOnLayer = false;

    li.addEventListener('pointerdown', e => {
      if (e.button === 0) pointerDownOnLayer = true;

      this.app.managers.scene.setActiveLayer(li.id);
    });
    li.addEventListener('pointerup', e => {
      if (!pointerDownOnLayer || e.button !== 0) return;
      pointerDownOnLayer = false;
      
      const isSelected = li.classList.contains('selected');

      document.querySelectorAll('.layer.selected').forEach(el => el.classList.remove('selected'));
      
      if (!isSelected) {
        li.classList.add('selected');
      }
    });
    li.addEventListener('pointerleave', () => {
      pointerDownOnLayer = false;
    });
    li.addEventListener('dragstart', e => {
      li.classList.add('dragging');
      e.dataTransfer.setData('text/plain', li.id);
    });
    li.addEventListener('dragend', e => {
      li.classList.remove('dragging');
    });
    li.ondrop = e => {
      e.preventDefault();
      const id = e.dataTransfer.getData('text/plain');
      const draggedEl = document.getElementById(id);
      if (draggedEl && draggedEl !== li) {
        li.parentNode.insertBefore(draggedEl, li);
      }
    };

    const eye = document.createElement('button');
    eye.className = 'eye';
    eye.classList.add('open');
    eye.draggable = false;
    eye.addEventListener('pointerdown', e => {
      e.stopPropagation();
      e.preventDefault();
    });

    const img = document.createElement('img');
    img.src = '/icons/eye-open.svg';
    img.alt = 'open';

    eye.appendChild(img);

    // Toggle visibility
    eye.addEventListener('click', () => {
      // toggle eye img
      const eye = li.querySelector('.eye');
      const img = eye.querySelector('img');
      eye.classList.toggle('open');
      const isOpen = eye.classList.contains('open');

      if (isOpen) {
        img.src = '/icons/eye-open.svg';
        img.alt = 'show';
        // toggle layer visible
        this.app.managers.scene.layerManager.toggleLayerVisible(li.id, true);
      } else {
        img.src = '/icons/eye-closed.svg';
        img.alt = 'hide';
        // toggle layer hidden
        this.app.managers.scene.layerManager.toggleLayerVisible(li.id, false);
      }
    });

    const span = document.createElement('span');
    span.className = 'layer-name';
    span.textContent = li.id;

    const content = document.createElement('div');
    content.className = 'layer-content';

    content.appendChild(eye);
    content.appendChild(span);
    
    li.appendChild(content);

    this.addLayer(li);

    return li;
  }

  // Called in newLayer()
  uniqueLayerName(name) {
    let base = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '');
    let newName = base;
    let id = 1;

    const existing = new Set(this.layerNames);

    while (existing.has(newName)) {
      newName = `${base}-${id}`;
      id++;
    }
    return newName;
  }

  // after calling newLayer()
  addLayer(layer) {
    this.layers_parent.appendChild(layer);

    if (!this.layerNames.includes(layer.id)) {
      this.layerNames.push(layer.id);
    }

    this.inspector.scrollTop = this.inspector.scrollHeight;

    // Overwrite layer names to add the new one
    localStorage.setItem('layerNames', JSON.stringify(this.layerNames));
  }

  
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.layer:not(.dragging)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
}
