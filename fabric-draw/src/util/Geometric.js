import { fabric } from "fabric";
import { Canvas } from "./Canvas";
export class Geometric extends Canvas {
  constructor() {
    super();
    this.mouseFrom = {
      x: 0,
      y: 0,
    };
    this.mouseTo = {
      x: 0,
      y: 0,
    };
    this.isActive = false;
    this.isDrawing = false;
    this.drawingObject = null;
    this.type = "";
  }

  resetMouse() {
    this.mouseFrom = {};
    this.mouseTo = {};
  }

  // 进行绘图
  startDrawingObject(canvasObject) {
    // 禁止用户选择当前正在绘制的图形
    canvasObject.selectable = false;
    // 如果当前图形已绘制，清除上一次绘制的图形
    if (this.isDrawing) {
      this.removeObj(this.drawingObject);
    }
    // 将绘制对象添加到 canvas中
    this.addObj(canvasObject);
    // 保存当前绘制的图形
    this.drawingObject = canvasObject;
  }

  // 设置 Rect
  setRect() {
    // 计算矩形长宽
    let left = this.mouseFrom.x;
    let top = this.mouseFrom.y;
    let width = this.mouseTo.x - this.mouseFrom.x;
    let height = this.mouseTo.y - this.mouseFrom.y;
    // 创建矩形 对象
    let canvasObject = new fabric.Rect({
      left: left,
      top: top,
      width: width,
      height: height,
      stroke: "#000",
      fill: "rgba(0,0,0,0)",
      strokeWidth: 1,
    });
    // 绘制矩形
    this.startDrawingObject(canvasObject);
  }

  // 初始化事件
  init(canvas) {
    this.canvas = canvas;
    let mouseDown = (options) => {
      if (this.isActive) {
        // 记录当前鼠标的起点坐标 (减去画布在 x y轴的偏移，因为画布左上角坐标不一定在浏览器的窗口左上角)
        this.mouseFrom.x = options.e.clientX - canvas._offset.left;
        this.mouseFrom.y = options.e.clientY - canvas._offset.top;
        this.isDrawing = true;
      }
    };
    let mouseMove = (options) => {
      this.mouseTo.x = options.e.clientX - canvas._offset.left;
      this.mouseTo.y = options.e.clientY - canvas._offset.top;
      if (this.isDrawing) {
        switch (this.type) {
          case "rect":
            this.setRect();
            break;
        }
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
