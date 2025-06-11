import axiosClient from './axiosClient';
import { handleApiError } from '../utils/errorHandler';

export const getListCommentByMangaId = async (mangaId, page, limit) => {
  try {
    const response = await axiosClient.get(
      `/comments/mangas/${mangaId}?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getListCommentByChapterId = async (chapterId, page, limit) => {
  try {
    const response = await axiosClient.get(
      `/comments/chapters/${chapterId}?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const postMangaComment = async (mangaId, commentParentId, context) => {
  try {
    const response = await axiosClient.post(`/comments/mangas/`, {
      mangaId,
      commentParentId,
      context,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const postChapterComment = async (chapterId, commentParentId, context) => {
  try {
    const response = await axiosClient.post(`/comments/chapters/`, {
      chapterId,
      commentParentId,
      context,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
