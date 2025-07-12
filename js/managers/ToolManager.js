import raycast, { castRay } from '/js/raycast.js';

export default class ToolManager {
  constructor() {
    this.activeTool = null;
  }

  setTool(tool) {
    if (this.activeTool === tool) {
      this.activeTool?.disable?.();
      this.activeTool = null;
      console.log('Tool deselected');
    } else {
      this.activeTool?.disable?.(); // disable the previous tool
      this.activeTool = tool;
      this.activeTool?.enable?.();
      console.log('Tool selected:', tool.constructor.name);
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
