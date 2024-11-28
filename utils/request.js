import axios from "axios";
import Cookies from "js-cookie";
import NProgress from 'nprogress';

const service = axios.create({});

service.interceptors.request.use(config => {
  NProgress.start();
  return config;
}, error => {
  NProgress.done();
  return Promise.reject(error);
});


service.interceptors.response.use(
  (response) => {
    NProgress.done();
    const { data, status } = response;
    if (status === 200) {
      return data;
    }
  },
  (error) => {
    NProgress.done();
    if (error.response) {
      // 获取错误状态码
      const statusCode = error.response.status;
      if (statusCode === 401) {
        Cookies.remove("session_id");
        sessionStorage.clear()
        window.location.reload();
      } else {
        const parser = new DOMParser();
        const doc = parser.parseFromString(error.response.data, "text/html");
        const errorMessage = doc.querySelector('p').textContent; 
        throw new Error(errorMessage);
      }
    }
  }
);

export default service;
