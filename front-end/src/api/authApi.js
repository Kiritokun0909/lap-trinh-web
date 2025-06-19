import axiosClient from './axiosClient';
import { handleApiError } from '../utils/errorHandler';

const LOGIN_URL = '/auth/login';
const REGISTER_URL = '/auth/register';

//#region login-api
export const loginAccount = async (email, password) => {
  try {
    const response = await axiosClient.post(LOGIN_URL, {
      email: email,
      password: password,
    });
    return response.data;
  } catch (error) {
    handleApiError(error, {
      401: 'Tài khoản hoặc mật khẩu không đúng.',
    });
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
    handleApiError(error, {
      409: 'Email đã được sử dụng để đăng ký. Vui lòng dùng email khác.',
    });
  }
};
//#endregion

//#region test-admin
export const testAdmin = async () => {
  try {
    const response = await axiosClient.post('/test/both');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
//#endregion

//#region forgotPassword
export const forgotPassword = async (email) => {
  try {
    const response = await axiosClient.post('/auth/send-otp', {
      email: email,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
//#endregion

//#region forgotPassword
export const resetPassword = async (email, otp) => {
  try {
    const response = await axiosClient.post('/auth/reset-password', {
      email: email,
      otp: otp,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
//#endregion
