import { Canvas } from "./Canvas";

export class Pen extends Canvas {
  constructor() {
    super();
    this.isActive = false;
    this.size = 3;
    this.color = "#000";

    this.setPen = function (canvas) {
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.width = this.size;
      canvas.freeDrawingBrush.color = this.color;
      canvas.isDrawingMode = this.isActive;
    };
  }
}
