import axiosClient from "./axiosClient";

const LOGIN_URL = "/login";

export const loginApi = (email, password) => {
  try {
    const response = axiosClient.post(LOGIN_URL, {
      email: email,
      password: password,
    });

    return response.data;
  } catch (err) {
    throw err;
  }
};
