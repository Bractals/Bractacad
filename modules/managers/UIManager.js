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
    this.toggleInspectorBtn = document.querySelector('#toggle-inspector-btn');
    this.inspectorOpen = true;

    // Toggles
    this.toggleAxes = document.getElementById('toggle-axes');

    // Tool carousel
    this.carousel = document.querySelector('.tool-carousel');

    // About section
    this.aboutBtn = document.querySelector('#menu button.about');
    this.aboutModal = document.getElementById('about-section');
    this.closeAboutBtn = document.getElementById('close-about-btn');

    // tool buttons
    this.lineBtn = document.getElementById('line-btn');
    this.rectBtn = document.getElementById('rectangle-btn');

    // buttons
    this.fullscreenBtn = document.getElementById('fullscreen-btn');
    this.centerBtn = document.getElementById('center-btn');

    // this.saveBtn = document.getElementById('save-btn');

    this.initUI();
  }

  initUI() {
    // Click to open a top-level menu
    this.menu.addEventListener('click', (e) => {
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
    document.querySelectorAll('.toggle-tab-btn').forEach(button => {
      button.addEventListener('click', () => {
        const tab = button.closest('.tab');
        tab.classList.toggle('collapsed');

        const arrow = button.querySelector('.arrow');
        arrow.textContent = tab.classList.contains('collapsed') ? '›' : '‹';
      });
    });
    // toggle axes
    this.toggleAxes.addEventListener('change', () => {
      const axes = this.app.runtime.scene.getObjectByName('axes');
      if (axes) {
        axes.visible = toggleAxes.checked;
      }
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



    // Restore menu state from localStorage
    if (localStorage.getItem('menuCollapsed') === 'true') {
      this.menu.classList.add('collapsed');
      this.toggleMenuBtn.classList.add('collapsed');
      this.toggleMenuBtn.innerHTML = '&#x25B6;'; // ▶
      this.menuOpen = false;
    }
    // Restore inspector state from localStorage
    if (localStorage.getItem('inspectorCollapsed') === 'true') {
      this.inspector.classList.add('collapsed');
      this.toggleInspectorBtn.classList.add('collapsed');
      this.toggleInspectorBtn.innerHTML = '&#x25B6;'; // ▶
      this.inspectorOpen = false;
    }
    // unhides root document element once UI state is restored
    // Removing this blocks DOM content from loading
    document.documentElement.classList.remove('preload-state');
  }

  updateToolUI() {
    this.lineBtn.classList.toggle('active', this.app.managers.tools.activeTool === this.app.managers.tools.tools.line);
    this.rectBtn.classList.toggle('active', this.app.managers.tools.activeTool === this.app.managers.tools.tools.rectangle);
  }



  
}
