import axiosClient from './axiosClient';
import { handleApiError } from '../utils/errorHandler';

const UPLOAD_IMAGE_URL = '/upload/image';

export const uploadImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await axiosClient.post(UPLOAD_IMAGE_URL, formData);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};
