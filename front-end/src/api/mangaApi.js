import axiosClient from './axiosClient';

//#region get-list-manga
export const getMangas = async (page, limit, keyword = '') => {
  try {
    const response = await axiosClient.get(
      `/mangas?page=${page}&limit=${limit}&search_query=${keyword}`
    );

    return response.data;
  } catch (err) {
    if (!err?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    throw new Error('Lỗi hệ thống, vui lòng thử lại sau.');
  }
};
//#endregion

//#region get-mangaa-by-id
export const getMangaById = async (mangaId) => {
  try {
    const response = await axiosClient.get(`/mangas/${mangaId}`);

    return response.data;
  } catch (err) {
    if (!err?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    if (err.response && err.response.status === 404) {
      throw new Error('Không tìm thấy truyện.');
    }

    throw new Error('Lỗi hệ thống, vui lòng thử lại sau.');
  }
};
//#endregion
