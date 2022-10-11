import { createRouter, createWebHashHistory } from "vue-router";

const Canvas = () => import("../Canvas.vue");
const Album = () => import("../Album.vue");
const Login = () => import("../Login.vue");

const routes = [
  { path: "/", redirect: "/login" },
  {
    path: "/canvas",
    name: "Canvas",
    component: Canvas,
  },
  {
    path: "/album",
    name: "Album",
    component: Album,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});
