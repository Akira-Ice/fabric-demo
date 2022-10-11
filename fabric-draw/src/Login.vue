<script setup>
import request_cilent from "./api/request_cilent";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import axios from "axios";
import "wincore";
import {
  UserFilled,
  ArrowUp,
  Lock,
  Close,
  ArrowDown,
} from "@element-plus/icons-vue";
const router = useRouter();
let vm = new Object();
let isActive = ref(0);
let showList = ref(false);
let form = reactive({
  account: "",
  passWord: "",
  remeber: false,
  agree: false,
});
let userList = reactive({});
async function onLogin() {
  if (form.agree) {
    // cef
    axios
      .get(
        `https://test.iclass30.com/base/baselogin/login?account=${form.account}&passWord=${form.passWord}`
      )
      .then((res) => {
        if (res) {
          if (form.remeber) {
            insert(res.id, form.account, form.passWord);
            localStorage.setItem("account", form.account);
          } else {
            del(form.account);
          }
          createCefWnd();
        }
        console.log(res);
      })
      .catch((e) => {
        ElMessage.error(res.msg);
      });

    // no-cef
    // await request_cilent
    //   .get("base/baselogin/login", {
    //     account: form.account,
    //     passWord: form.passWord,
    //   })
    //   .then((res) => {
    //     if (res) {
    //       if (form.remeber) {
    //         insert(res.id, form.account, form.passWord);
    //       } else {
    //         del(form.account);
    //       }

    //       createCefWnd();
    //       // router.push({
    //       //   name: "Album",
    //       //   params: res,
    //       // });
    //     }
    //     console.log(res);
    //   })
    //   .catch((res) => {
    //     ElMessage.error(res.msg);
    //   });
  } else {
    ElMessage({
      message: "请勾选同意后在进行登录",
      type: "warning",
    });
    form.agree = true;
  }
}

// 创建cef
function createCefWnd() {
  console.log("createCefWnd");
  let paramBrowser = {
    name: "cefAlbum",
    URI: "http://121.196.202.175/#/album",
    xml: "cefAlbum.xml",
    cefname: "cefAlbum",
    close_all: "true",
    show: "work_area",
    zoomlevel: "zoom_1920",
  };
  let album_browser = new wincore.oo.BrowserForm(paramBrowser);
  wincore.BrowserForm.login_browser.close();
}

// sqlite 插入数据
function insert(id, account, passWord) {
  console.log("insert");
  let ssql = `insert into user2(userid, account, passWord) values('${id}','${account}','${passWord}')`;
  vm.obj.sqlite.execute_noquery(ssql, true);
}

// sqlite 删除数据
function del(account) {
  console.log("del");
  let check = `delete from user2 where account = '${account}'`;
  let res = vm.obj.sqlite.execute_noquery(check, true);
  console.log(res);
}

// sqlite 查询 ByAccount
function selectByAccount() {
  console.log("selectByAccount");
  let check = `SELECT * FROM user2 WHERE account = '${form.account}'`;
  let res = vm.obj.sqlite.execute_query(check);
  if (res.data) {
    form.passWord = res.data.passWord[0];
    form.remeber = true;
    console.log(form);
  }
}

function selectAll() {
  console.log("selectAll");
  let check = `SELECT * FROM user2`;
  let res = vm.obj.sqlite.execute_query(check);
  if (res.data) {
    userList = res.data;
    console.log(userList);
  }
}

function selectAccount_like() {
  let check = `SELECT * FROM user2 WHERE account LIKE '${form.account}%'`;
  let res = vm.obj.sqlite.execute_query(check);
  console.log(res);
  if (res.data) {
    form.account = res.data.account[0];
    console.log(form);
  }
}

// 连接sqlite
async function connectSqlite() {
  console.log("connectSqlite");
  vm.obj = new Object();
  vm.obj.sqlite = new wincore.oo.SQLite();
  const path = wincore.System.get_exe_path();
  console.log("connectSqlite" + path);
  await vm.obj.sqlite.open(path + "user_db.db3");
  let sql =
    "CREATE TABLE [user2] ([userid] NVARCHAR(50) NOT NULL PRIMARY KEY," +
    "[account] NVARCHAR(50)," +
    "[passWord] NVARCHAR(50));"; //reserve1保留字段
  vm.obj.sqlite.add_create_table("SELECT * FROM user2", sql);
  vm.obj.sqlite.create_tables(); //创建表
}

function close() {
  wincore.BrowserForm.login_browser.close();
}
onMounted(() => {
  connectSqlite();
  form.account = localStorage.getItem("account") || "";
  selectByAccount();
  form.remeber = localStorage.getItem("account") ? true : false;
});
</script>

<template>
  <div class="container">
    <div class="left">
      <img src="./assets/third_login_bg.webp" alt="" />
    </div>
    <div class="right">
      <div class="avatar">
        <img src="./assets/touxiang.png" alt="" />
        <p>赵一依</p>
      </div>
      <div class="loginForm">
        <div class="account" style="position: relative">
          <!-- <el-autocomplete
            v-model="form.account"
            :prefix-icon="UserFilled"
            :suffix-icon="showList ? ArrowDown : ArrowUp"
            :fetch-suggestions="querySearch"
            class="inline-input w-50"
            placeholder="请输入账号"
            @select="handleSelect"
          /> -->
          <el-input
            v-model="form.account"
            placeholder="请输入账号"
            :prefix-icon="UserFilled"
            :suffix-icon="showList ? ArrowDown : ArrowUp"
            @input="selectAccount_like"
            @click="showList = !showList"
          >
          </el-input>
          <!-- <el-card
            shadow="hover"
            style="position: absolute; width: 75%; z-index: 3; left: 12%"
          ></el-card> -->
        </div>
        <div class="passWord">
          <el-input
            v-model="form.passWord"
            placeholder="请输入密码"
            type="password"
            :prefix-icon="Lock"
            @click="selectByAccount"
          ></el-input>
        </div>
        <div class="operate">
          <el-checkbox v-model="form.remeber" label="记住密码" size="large" />
          <span class="forget">忘记密码</span>
        </div>
      </div>
      <div class="loginBtn">
        <el-button type="primary" round @click="onLogin">登录</el-button>
      </div>
      <div class="userAgress">
        <el-checkbox
          v-model="form.agree"
          label="我已阅读并同意《服务协议》和《隐私政策》"
          size="large"
        />
      </div>
    </div>
    <el-icon class="tr" @click="close"><Close /></el-icon>
  </div>
</template>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #ffffff;
  border-radius: 10px;
  display: flex;
  flex: 1;
  flex-basis: auto;
  .left {
    width: 42.04545vw !important;
    height: 100%;
    float: left;
    position: relative;
    overflow: hidden;
    background-image: url(./assets/login_bg.webp);
    background-repeat: no-repeat;
    background-size: cover;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .right {
    flex-grow: 1;
    width: 40vw;
    height: 100%;
    float: right;
    color: #bfcadb;

    .avatar {
      margin: 8.92857vh 0 3.29545vw 0;
      text-align: center;
      img {
        width: 10.45455vw;
        height: 10.45455vw;
        border: 1px solid #dfeaf2;
        border-radius: 50%;
        margin: 0 auto 2.04545vw;
        overflow: hidden;
        background-color: #fff;
      }
      p {
        color: black;
        font-size: 2.04545vw;
      }
    }

    .loginForm {
      width: 40.90909vw;
      margin: 0 auto;
      .el-input {
        width: 100%;
        height: 5.45455vw;
        font-size: 1.81818vw;
        --el-input-border-radius: 5.68182vw;
        :deep(.el-input__wrapper) {
          padding: 0 2.25vw;
        }
        :deep(.el-input__inner) {
          margin: 0 1vw;
        }
      }
      .account,
      .passWord {
        margin-bottom: 2.5vw;
      }

      .operate {
        display: flex;
        justify-content: space-between;
        margin: 0.17857vh auto 3.21429vh;
        padding: 0 1.93182vw;
        .el-checkbox {
          :deep(.el-checkbox__inner) {
            width: 1.81818vw;
            height: 1.81818vw;
          }
          :deep(.el-checkbox__label) {
            font-size: 1.81818vw;
            color: #7c8394;
            padding-left: 0.90909vw;
          }
        }
        .forget {
          color: #7c8394;
          font-size: 1.81818vw;
          cursor: pointer;
        }
      }
    }

    .loginBtn {
      width: 40.90909vw;
      margin: 0 auto;
      .el-button {
        margin: 0 auto 4.10714vh;
        width: 100%;
        height: 5.45455vw;
        border: none;
        border-radius: 5.68182vw;
        font-size: 2.04545vw;
      }
    }

    .userAgress {
      display: flex;
      justify-content: center;
      .el-checkbox {
        :deep(.el-checkbox__inner) {
          width: 1.81818vw;
          height: 1.81818vw;
        }
        :deep(.el-checkbox__label) {
          font-size: 1.81818vw;
          color: #7c8394;
          padding-left: 0.90909vw;
        }
      }
    }
  }

  .tr {
    position: fixed;
    top: 1.47727vw;
    right: 1.47727vw;
    z-index: 100;
    width: 2vw;
    height: 2vw;
    color: #8d8075;
    font-size: 3.63636vw;
  }
}
</style>
