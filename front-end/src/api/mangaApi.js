import axiosClient from './axiosClient';
import { handleApiError } from '../utils/errorHandler';
import HandleCode from '../utils/HandleCode';

//#region get-list-manga
export const getMangas = async (
  page,
  limit,
  keyword = '',
  filter = HandleCode.FILTER_BY_MANGA_UPDATE_AT_DESC,
  publishedYear = '',
  genreId = ''
) => {
  try {
    const response = await axiosClient.get(
      `/mangas?page=${page}&limit=${limit}&search_query=${keyword}&filter=${filter}&publishedYear=${publishedYear}&genreId=${genreId}`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
//#endregion

//#region get-manga-by-id
export const getMangaById = async (mangaId) => {
  try {
    const response = await axiosClient.get(`/mangas/${mangaId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, {
      404: 'Không tìm thấy truyện.',
    });
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
  } catch (error) {
    handleApiError(error, {
      400: 'Tạo truyện thất bại, vui lòng thử lại.',
    });
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
  } catch (error) {
    handleApiError(error, {
      400: 'Cập nhật truyện thất bại, vui lòng thử lại.',
      404: 'Không tìm thấy truyện.',
    });
  }
};
//#endregion

//#region delete-manga
export const deleteManga = async (mangaId) => {
  try {
    const response = await axiosClient.delete(`/mangas/${mangaId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, {
      404: 'Không tìm thấy truyện.',
    });
  }
};
//#endregion

//#region update-manga-hide-status
export const updateMangaHideStatus = async (mangaId, isHide) => {
  try {
    const response = await axiosClient.put(`/mangas/hide/${mangaId}`, { isHide: isHide });
    return response.data;
  } catch (error) {
    handleApiError(error, {
      404: 'Không tìm thấy truyện.',
    });
  }
};
//#endregion
