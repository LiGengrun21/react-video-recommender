import axios from "axios";

export const getCategoriesAsync = (params) =>
  axios.get("/categroy/findCategroy", {
    params: params,
  });

export const addCategoriesAsync = (data) =>
  axios.post("/categroy/addCategroy", data);

export const login = (params) => axios.get("/login", { email, password });
