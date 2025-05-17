import { handleApiError } from '../utils/errorHandler';
import axiosClient from './axiosClient';

export const getListUser = async (page = 1, limit = 10, keyword = '') => {
  try {
    const response = await axiosClient.get(
      `/admin/users?page=${page}&limit=${limit}&keyword=${keyword}`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const toggleBlockUser = async (userId) => {
  try {
    const response = await axiosClient.put(`/admin/block-user/${userId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
