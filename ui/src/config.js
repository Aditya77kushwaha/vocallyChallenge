import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://todomern2.herokuapp.com/",
});
