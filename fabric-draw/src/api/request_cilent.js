import interceptor_cilent from "./interceptor_cilent";

function request(url, params, method) {
  return new Promise((resolve, reject) => {
    let data = {};
    if (method == "get") data = { params };
    if (method == "post") data = { data: params };
    interceptor_cilent({
      url,
      method,
      ...data,
    })
      .then((res) => {
        if (res.code === 1) {
          resolve(res.data);
        } else {
          reject(res);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  });
}
function get(url, params, options) {
  return request(url, params, "get");
}

function post(url, params, options) {
  return request(url, params, "post");
}
export default {
  get,
  post,
};
