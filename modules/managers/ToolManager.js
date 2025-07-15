// ToolsManager should own tool instantiation and lifecycle.
import SelectTool from '../tools/SelectTool.js';
import LineTool from '../tools/LineTool.js';
import RectangleTool from '../tools/RectangleTool.js';


export default class ToolManager {
  constructor(app) {
  this.app = app;
  this.tools = {
    select: new SelectTool(app),
    line: new LineTool(app),
    rectangle: new RectangleTool(app),
  };
    this.activeTool = null;
  }

  setTool(name) {
    if (name == null) {
      this.activeTool?.disable?.();
      this.activeTool = null;
      this.app.managers.ui.updateToolUI();
      return;
    }

    const tool = this.tools[name];
    if (!tool) return;

    if (this.activeTool === tool) {
      tool?.disable?.();
      this.activeTool = null;
    } else {
      this.activeTool?.disable?.(); // disable the previous tool
      this.activeTool = tool;
      tool?.enable?.();
    }
  }

  onPointerDown(e) {
    if (e.button === 0) {
      // Optional chaining operator
      // Safely accesses a property or method that might be null/undefined.
      // returns undefined instead of throwing error.
      // if this.activeTool exists, then try .draw
      // if .draw exists, then call it with .(e)

      this.activeTool?.draw?.(e);
      // if either is null or undefined return undefined.
      // means if (this.activeTool && typeof this.activeTool.draw === 'function') {
      // this.activeTool.draw(e);
    }
  }

  onPointerMove(e) {
    this.activeTool?.onPointerMove?.(e);
  }

  onPointerUp(e) {
    this.activeTool?.onPointerUp?.(e);
  }
}
