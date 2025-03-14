import axiosClient from "./axiosClient";

const LOGIN_URL = "/auth/login";
const REGISTER_URL = "/auth/register";

//#region login-api
export const loginAccount = async (email, password) => {
  try {
    const response = await axiosClient.post(LOGIN_URL, {
      email: email,
      password: password,
    });

    return response.data;
  } catch (err) {
    if (!err?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    if (err.response && err.response.status === 403) {
      throw new Error("Tài khoản hoặc mật khẩu không đúng.");
    }

    throw new Error("Đăng nhập thất bại. Vui lòng thử lại.");
  }
};
//#endregion

//#region register-api
export const registerAccount = async (email, username, password) => {
  try {
    const response = await axiosClient.post(REGISTER_URL, {
      email: email,
      password: password,
      username: username,
    });

    return response.data;
  } catch (error) {
    if (!error?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    if (error.response && error.response.status === 409) {
      throw new Error(
        "Email đã được sử dụng để đăng ký. Vui lòng dùng email khác."
      );
    }

    throw new Error("Đăng ký tài khoản thất bại. Vui lòng thử lại.");
  }
};
//#endregion

//#region test-admin
export const testAdmin = async () => {
  try {
    const response = await axiosClient.post("/test/both");

    return response.data;
  } catch (error) {
    console.log(error);
  }
};
//#endregion
