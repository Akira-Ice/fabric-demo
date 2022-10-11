import axios from "axios";
const service = axios.create({
  baseURL: "/cilent",
  timeout: 10000,
  withCredentials: true,
});

service.interceptors.request.use((config) => {
  // 自定义header，可添加项目token
  //  config.headers.token = 'token';
  return config;
});
// 返回拦截
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code === 0) {
      return res;
    } else if (res.code === 10000) {
      return res;
    } else {
      return res;
    }
  },
  () => {}
);
export default service;
