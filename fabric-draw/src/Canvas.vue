<script>
import request from "./api/request";
import api from "./api";
import { fabric } from "fabric";
import "./lib/eraser_brush.mixin";
import { onMounted, reactive } from "vue";
import { Canvas } from "./util/Canvas";
import { Pen } from "./util/Pen";
import { Eraser } from "./util/Eraser";
import { Geometric } from "./util/Geometric";
import { useRouter, useRoute } from "vue-router";
import {
  EditPen,
  Brush,
  Back,
  Right,
  DataBoard,
  FullScreen,
} from "@element-plus/icons-vue";
import axios from 'axios';

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();

    // 当前画布,相册传递的数据
    let current = {
      id: -1,
      c_json: '{"version":"5.2.1","objects":[]}',
      src: "",
    };

    let c = reactive(new Canvas());
    let pen = reactive(new Pen());
    let eraser = reactive(new Eraser());
    let geometric = reactive(new Geometric());

    let methods = {
      //关闭所有按钮状态
      disableAll: function () {
        pen.isActive =
          eraser.isActive =
          eraser.areaModel =
          geometric.isActive =
            false;
        c.canvas.isDrawingMode = false;
      },

      // 上传图片
      onProgress: function (file) {
        let imgPath = null;
        if (window.createObjcectURL != undefined) {
          imgPath = window.createOjcectURL(file);
        } else if (window.URL != undefined) {
          imgPath = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) {
          imgPath = window.webkitURL.createObjectURL(file);
        }
        c.setBgImg(imgPath);
        return false;
      },

      // 笔
      setPen: function () {
        if (!pen.isActive) this.disableAll();
        pen.isActive = !pen.isActive;
        pen.setPen(c.canvas);
        console.log("setPen--", pen.isActive);
      },

      // 橡皮擦
      setEraser: function () {
        if (!eraser.isActive) this.disableAll();
        eraser.isActive = !eraser.isActive;
        eraser.setEraser(c.canvas);
        console.log("setEraser--", eraser.isActive);
      },

      // 设置区域擦除
      setEraserArea: function () {
        if (!eraser.areaModel) {
          pen.isActive =
            eraser.isActive =
            eraser.areaModel =
            geometric.isActive =
            c.canvas.isDrawingMode =
              false;
        }

        eraser.areaModel = !eraser.areaModel;
      },

      //设置几何图形
      setGeometric: function (type) {
        if (!geometric.isActive) this.disableAll();
        geometric.isActive = !geometric.isActive;
        geometric.type = type;
      },

      //清除画布
      clear: function () {
        c.clear();
      },

      // 保存至相册
      save: async function () {
        let serialization = c.save();
        current.src = serialization.src;
        current.c_json = serialization.c_json;

        if (current.id != -1) {
          console.log("save--", current);
          // no-cef
          // await request.post(api.album.modify, current);

          // cef
          await axios.post("http://localhost:5000/album/modifyById",current);
          
        } else {
          await request.post(api.album.save, current);
        }
      },

      // 返回相册
      back: function () {
        router.push({
          name: "Album",
        });
      },

      // 撤回
      undo: function () {
        c.setUndo();
      },

      // 重做
      redo: function () {
        c.setRedo();
      },
    };

    onMounted(() => {
      c.init();
      geometric.init(c.canvas);
      eraser.init(c.canvas);
      if (route.params) {
        current = route.params;
        c.canvas.loadFromJSON(current.c_json);
      }
    });

    return {
      c,
      pen,
      eraser,
      geometric,
      ...methods,
      EditPen,
      Brush,
      Back,
      Right,
      DataBoard,
      FullScreen,
    };
  },
};
</script>

<template>
  <div class="container" ref="container">
    <el-card class="header">
      <div class="toolbars">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          :multiple="false"
          :show-file-list="false"
          :limit="1"
          accept=".jpg,.png"
          :before-upload="onProgress"
        >
          <el-button type="primary">上传</el-button>
        </el-upload>
        <div class="pen">
          <el-button
            @click="setPen()"
            :icon="EditPen"
            :class="{ active: pen.isActive }"
          ></el-button>
          <el-color-picker
            v-model="pen.color"
            @change="
              () => {
                pen.isActive = false;
                setPen();
              }
            "
          />
          <el-slider
            v-model="pen.size"
            @change="
              () => {
                pen.isActive = false;
                setPen();
              }
            "
          />
        </div>
        <el-button
          @click="setEraser()"
          :class="{ active: eraser.isActive }"
          :icon="Brush"
        ></el-button>
        <el-button
          @click="setGeometric('rect')"
          :class="{ active: geometric.isActive }"
          :icon="FullScreen"
        ></el-button>
        <el-button @click="clear" :icon="DataBoard"></el-button>
        <el-button @click="undo" :icon="Back"></el-button>
        <el-button @click="redo" :icon="Right"></el-button>
        <el-button @click="save">save</el-button>
        <el-button @click="back">back</el-button>
        <el-button @click="setEraserArea">区域擦除</el-button>
      </div>
      <div
        style="height: 20px; text-align: center; font-size: 18px; padding: 10px"
      >
        come here 👀
      </div>
    </el-card>
    <canvas id="c"></canvas>
  </div>
</template>

<style lang="less" scoped>
.container {
  width: 100vw;
  height: 100vh;
  .header {
    width: 100%;
    position: absolute;
    top: -63px;
    transition: all 0.5;
    z-index: 2;
    &:hover {
      top: 0;
    }
    .toolbars {
      padding: 10px;
      display: flex;
      justify-content: center;
      .el-upload {
        margin-right: 10px;
      }
      .active {
        background-color: rgb(236, 245, 255);
        color: rgb(64, 158, 255);
      }
      .pen {
        width: 200px;
        display: flex;
        gap: 15px;
        margin: 0 10px;
        .el-color-picker {
          margin-right: 5px;
        }
      }
    }
  }
}
</style>