<script>
import { onMounted, reactive } from "vue";
import request from "./api/request";
import api from "./api";
import { useRouter } from "vue-router";
import { Delete } from "@element-plus/icons-vue";
import "wincore";
import axios from "axios";
export default {
  name: "Album",
  setup() {
    const router = useRouter();
    let serializations = reactive([]);

    onMounted(async () => {
      // wincore.BrowserForm["album_browser"].on(
      //   "on_coremessage",
      //   function (data) {
      //     console.log(data);
      //   }
      // );
      // 获取数据

      // no-cef
      // let data = await request.get(api.album.getAll);

      // cef
      let data;
      await axios
        .get("http://localhost:5000/album/getAll")
        .then((res) => {
          data = res.data.data;
        })
        .catch((e) => {
          console.log(e);
        });

      serializations.push(...data);
    });

    const methods = {
      // 选择画布
      selectCanvas: function (event) {
        console.log(event.target);
        let index = event.target.dataset.index;
        console.log(event.target.nodeName);
        if (event.target.nodeName == "IMG") {
          router.push({
            name: "Canvas",
            params: serializations[index],
          });
        }
      },

      // 添加画布
      add: async function () {
        let data = {
          c_json: '{"version":"5.2.1","objects":[]}',
          src: "https://gss0.baidu.com/9fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/728da9773912b31b72aabf2d8618367adbb4e1f4.jpg",
        };

        // no-cef
        // let res = await request.post(api.album.save, data);

        // cef
        let res;
        await axios
          .post("http://localhost:5000/album/save", data)
          .then((respone) => {
            res = respone.data.data;
          });

        if (res != "") {
          serializations.push(res);
        }
      },

      // 删除画布
      del: async function (index) {
        // no-cef
        // let res = await request.post(api.album.remove, serializations[index]);

        // cef
        let res;
        await axios
          .post("http://localhost:5000/album/removeById", serializations[index])
          .then((respone) => {
            res = respone.data;
          });

        if (res) serializations.splice(index, 1);
      },

      // 退出登陆返回登录页
      back: function () {
        router.push({
          name: "Login",
        });
      },
    };

    return {
      serializations,
      Delete,
      ...methods,
    };
  },
};
</script>

<template>
  <div class="container">
    <el-card class="album">
      <div class="header">相 册 📰</div>
      <div class="toolBar">
        <el-button @click="add">创建画布</el-button>
      </div>
      <div class="imgs" @click="selectCanvas">
        <div v-for="(item, index) in serializations">
          <el-image
            :key="index"
            :src="item.src"
            :data-index="index"
            fit="contain"
          />
          <el-button
            type="danger"
            :icon="Delete"
            circle
            class="del"
            @click="del(index)"
            :data-index="index"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<style lang="less" scoped>
.container {
  width: 100vw;
  height: 100vh;
  .header {
    text-align: center;
    font-size: 40px;
    padding: 10px;
  }
  .toolBar {
    transition: all 0.5s;
  }
  .album {
    margin: 0 20px;
    .imgs {
      display: flex;
      overflow: hidden;
      padding: 20px;
      transition: all 0.5s;
      flex-wrap: wrap;
      &:hover {
        overflow-x: auto;
      }
      div {
        position: relative;
        .el-image {
          flex-shrink: 0;
          width: 230px;
          height: 130px;
          margin: 20px;
          border: 1px solid rgba(230, 228, 228, 0.864);
          border-radius: 10px;
          transition: all 0.5s;
          &:hover {
            box-shadow: 5px 5px 10px rgb(149, 145, 145);
          }
        }
        .del {
          visibility: hidden;
          position: absolute;
          left: 5px;
          top: 5px;
        }
        &:hover {
          .del {
            visibility: visible;
          }
        }
      }
    }
  }
}
</style>
