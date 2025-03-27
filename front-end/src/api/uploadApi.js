import axiosClient from './axiosClient';

const UPLOAD_IMAGE_URL = '/upload/image';

export const uploadImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await axiosClient.post(UPLOAD_IMAGE_URL, formData);
    return response.data;
  } catch (err) {
    if (!err?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    throw new Error('Lỗi hệ thống, vui lòng thử lại sau.');
  }
};
