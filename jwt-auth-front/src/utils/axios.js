import axios from "axios";

const instance = axios.create({
  baseURL: "http://127.0.0.1:7777/api/v1/",
});

export default instance;
