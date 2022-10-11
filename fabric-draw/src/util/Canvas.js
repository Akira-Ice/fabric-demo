import { fabric } from "fabric";
export class Canvas {
  constructor() {
    // canvas 实例
    this.canvas = {};
    // 当前画布队列
    this.undo = ['{"version":"5.2.1","objects":[]}'];
    // 撤回画布队列
    this.redo = [];
  }

  // 初始化事件
  initEvent(mouseDown, mouseMove, mouseUp) {
    let canvas = this.canvas;
    if (mouseDown) canvas.on("mouse:down", mouseDown);
    if (mouseMove) canvas.on("mouse:move", mouseMove);
    if (mouseUp) canvas.on("mouse:up", mouseUp);
  }
  // 维护undo队列
  maintainUndo() {
    if (this.undo.length > 11) {
      this.undo.shift();
    }
  }

  // 初始化
  init() {
    this.canvas = new fabric.Canvas("c", {
      width: window.innerWidth,
      height: window.innerHeight,
      includeDefaultValues: false,
    });

    let canvas = this.canvas;

    let mouseUp = (options) => {
      let c_json = JSON.stringify(canvas);
      if (
        c_json != this.undo[this.undo.length - 1] &&
        c_json != '{"version":"5.2.1","objects":[]}'
      ) {
        this.undo.push(c_json);
        this.maintainUndo();
        // console.log(this.undo);
      }
    };

    this.initEvent(undefined,undefined,mouseUp);
  }

  // 设置背景图片
  setBgImg(img) {
    let canvas = this.canvas;
    /**
     * local_url 模式
     */
    fabric.Image.fromURL(img, (img) => {
      // 设置背景图
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        scaleX: canvas.width / img.width,
        scaleY: canvas.height / img.height,
        erasable: false,
      });
      let c_json = JSON.stringify(canvas);
      if (c_json != this.undo[this.undo.length - 1]) {
        this.undo.push(c_json);
        this.maintainUndo();
      }
    });
  }

  // 清空画布
  clear() {
    let canvas = this.canvas;
    let c = this;
    canvas.clear();
    let c_json = JSON.stringify(canvas);
    if (c_json != c.undo[c.undo.length - 1]) {
      c.undo.push(c_json);
      this.maintainUndo();
    }
  }

  // 保存画布
  save() {
    let canvas = this.canvas;
    let c_json = JSON.stringify(canvas);
    let src = canvas.toDataURL("image/png");
    return { c_json, src };
  }

  // 撤回
  setUndo() {
    let canvas = this.canvas;
    let c = this;

    if (c.undo.length == 0) {
      console.log("undo -- null");
      return;
    }

    let c_json = c.undo.pop();
    c.redo.push(c_json);

    let len = c.undo.length;
    canvas.loadFromJSON(c.undo[len - 1]);
    // console.log(this.undo,this.redo);
  }

  // 重做
  setRedo() {
    let canvas = this.canvas;
    let c = this;

    if (c.redo.length == 0) {
      console.log("redo -- null");
      return;
    }

    let c_json = c.redo.pop();
    c.undo.push(c_json);
    this.maintainUndo();
    canvas.loadFromJSON(c_json);
  }

  // 移除图形对象
  removeObj(canvasObj) {
    this.canvas.remove(canvasObj);
  }
  
  // 添加图形对象
  addObj(canvasObj) {
    this.canvas.add(canvasObj);
  }
}
