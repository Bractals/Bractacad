// Handles DOM-bound elements (buttons, panels, sliders),
// event bindings, and dispatches UI-specific actions.

export default class UIManager {
  constructor(app) {
    this.app = app;

    // tool buttons
    this.selectToolBtn = document.getElementById('select-btn');
    this.lineBtn = document.getElementById('line-btn');
    this.rectBtn = document.getElementById('rectangle-btn');

    // buttons
    this.fullscreenBtn = document.getElementById('fullscreen-btn');
    this.centerBtn = document.getElementById('center-btn');

    // this.saveBtn = document.getElementById('save-btn');
    // this.loadInput = document.getElementById('load-input');

    this.initUI();
  }

  initUI() {

    // this.saveBtn.addEventListener('click', () => {
    //   this.app.managers.file.save();
    // });

    // this.loadInput.addEventListener('change', (e) => {
    //   const file = e.target.files[0];
    //   if (file) this.app.managers.file.load(file);
    // });

    this.selectToolBtn.addEventListener('click', () => {
      this.app.managers.tools.setTool('select');
      this.updateToolUI();
      console.log('Select tool activated');
    });

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
    
    // Re-center camera
    this.centerBtn.addEventListener('click', () => {
      this.app.camera.setDefaultPos();
      this.app.camera.setTargetCenter();
    });
  }

  updateToolUI() {
    this.selectToolBtn.classList.toggle('active', this.app.managers.tools.activeTool === this.app.managers.tools.tools.select);
    this.lineBtn.classList.toggle('active', this.app.managers.tools.activeTool === this.app.managers.tools.tools.line);
    this.rectBtn.classList.toggle('active', this.app.managers.tools.activeTool === this.app.managers.tools.tools.rectangle);
  }



  
}
