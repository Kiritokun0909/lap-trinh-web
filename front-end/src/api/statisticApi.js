import axiosClient from './axiosClient';
import { handleApiError } from '../utils/errorHandler';
import HandleCode from '../utils/HandleCode';

export const getTotalUserNumber = async () => {
  try {
    const response = await axiosClient.get('/statistic/total-users');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getTotalMangaNumber = async () => {
  try {
    const response = await axiosClient.get('/statistic/total-mangas');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getTopMangas = async (
  page = 1,
  limit = 5,
  filterCode = HandleCode.STATISTIC_NUM_VIEWS_DESC
) => {
  try {
    const response = await axiosClient.get(
      `/statistic/top-mangas?page=${page}&limit=${limit}&filter=${filterCode}`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
