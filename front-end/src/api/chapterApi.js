import axiosClient from './axiosClient';

export const getListChapterByMangaId = async (mangaId) => {
  try {
    const response = await axiosClient.get(`/mangas/${mangaId}/chapters`);

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
