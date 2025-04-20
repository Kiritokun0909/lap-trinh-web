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

//#region create-manga
export const createManga = async (manga) => {
  try {
    const response = await axiosClient.post('/mangas', {
      mangaName: manga.mangaName,
      otherName: manga.otherName,
      coverImageUrl: manga.coverImageUrl,
      publishedYear: manga.publishedYear,
      description: manga.description,
      ageLimit: manga.ageLimit,
      authorId: manga?.author?.authorId,
      genreIds: manga?.genres,
    });

    return response.data;
  } catch (err) {
    if (!err?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    if (err.response && err.response.status === 400) {
      throw new Error('Tạo truyện thất bài, vui lòng thử lại.');
    }

    throw new Error('Lỗi hệ thống, vui lòng thử lại sau.');
  }
};
//#endregion

//#region update-manga
export const updateManga = async (manga) => {
  try {
    const response = await axiosClient.put(`/mangas/${manga.mangaId}`, {
      mangaName: manga.mangaName,
      otherName: manga.otherName,
      coverImageUrl: manga.coverImageUrl,
      publishedYear: manga.publishedYear,
      description: manga.description,
      ageLimit: manga.ageLimit,
      authorId: manga?.author?.authorId,
      genreIds: manga?.genres,
    });

    return response.data;
  } catch (err) {
    if (!err?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    if (err.response && err.response.status === 400) {
      throw new Error('Cập nhật truyện thất bại, vui lòng thử lại.');
    }

    if (err.response && err.response.status === 404) {
      throw new Error('Không tìm thấy truyện.');
    }

    throw new Error('Lỗi hệ thống, vui lòng thử lại sau.');
  }
};
//#endregion

//#region delete-manga
export const deleteManga = async (mangaId) => {
  try {
    const response = await axiosClient.delete(`/mangas/${mangaId}`);

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
