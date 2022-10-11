import { fabric } from "fabric";
import { Canvas } from "./Canvas";
export class Eraser extends Canvas {
  constructor() {
    super();
    this.isActive = false;
    this.areaModel = false;
    this.isDrawing = false;
    this.size = 35;
    this.color = "#fff";

    // mouse point
    // 起点
    this.mouseFrom = {
      x: 0,
      y: 0,
    };

    // 终点
    this.mouseTo = {
      x: 0,
      y: 0,
    };

    // 移动中点的集合
    this.mouseMove = [];
    this.drawingObject = null;
  }

  // 设置橡皮擦
  setEraser(canvas) {
    canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
    canvas.freeDrawingBrush.width = this.size;
    canvas.freeDrawingBrush.color = this.color;
    canvas.isDrawingMode = this.isActive;
  }

  // 进行绘制
  startDrawingObject(canvasObject) {
    canvasObject.selectable = false;
    canvasObject.set({
      fill: "white",
      stroke: "white",
      opacity: 1,
      erasable: false,
    });
    if (this.isDrawing) {
      this.removeObj(this.drawingObject)
    }
    this.addObj(canvasObject);
    this.drawingObject = canvasObject;
  }

  // 设置path参数,拼接数据点
  setPath() {
    let str = "";
    str += `M ${this.mouseFrom.x} ${this.mouseFrom.y} `;
    this.mouseMove.forEach((item) => {
      str += `L ${item.x} ${item.y} `;
    });
    str += `L ${this.mouseTo.x} ${this.mouseTo.y} Z`;
    let canvasObject = new fabric.Path(str);
    this.startDrawingObject(canvasObject);
  }

  // 重置 mouse 点数据
  resetMouse() {
    this.mouseFrom = {
      x: 0,
      y: 0,
    };
    this.mouseTo = {
      x: 0,
      y: 0,
    };
    this.mouseMove = [];
  }

  // 初始化事件
  init(canvas) {
    this.canvas = canvas;
    let mouseDown = (options) => {
      if (this.areaModel) {
        // 记录当前鼠标的起点坐标 (减去画布在 x y轴的偏移，因为画布左上角坐标不一定在浏览器的窗口左上角)
        this.mouseFrom.x = options.e.clientX - canvas._offset.left;
        this.mouseFrom.y = options.e.clientY - canvas._offset.top;
        this.isDrawing = true;
      }
    };
    let mouseMove = (options) => {
      if (this.isDrawing) {
        this.mouseTo.x = options.e.clientX - canvas._offset.left;
        this.mouseTo.y = options.e.clientY - canvas._offset.top;
        let { x, y } = this.mouseTo;
        this.mouseMove.push({ x, y });
        this.setPath();
      }
    };
    let mouseUp = () => {
      if (this.isDrawing) {
        this.drawingObject = null;
        this.isDrawing = false;
        this.resetMouse();
      }
    };
    this.initEvent(mouseDown, mouseMove, mouseUp);
  }
}