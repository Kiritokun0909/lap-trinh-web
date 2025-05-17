import axiosClient from './axiosClient';
import { handleApiError } from '../utils/errorHandler';

const GET_LIST_AUTHORS_URL = '/authors';
const ADD_AUTHOR_URL = '/authors/';
const UPDATE_AUTHOR_URL = '/authors/';
const DELETE_AUTHOR_URL = '/authors/';

export const getAuthors = async (keyword = '', page = 1, limit = 10) => {
  try {
    const response = await axiosClient.get(
      GET_LIST_AUTHORS_URL + `?keyword=${keyword}&page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const addAuthor = async (avatar = '', authorName = '', biography = '') => {
  try {
    const response = await axiosClient.post(ADD_AUTHOR_URL, {
      avatar,
      authorName,
      biography,
    });
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const updateAuthor = async (
  authorId,
  avatar = '',
  authorName = '',
  biography = ''
) => {
  try {
    const response = await axiosClient.put(UPDATE_AUTHOR_URL + authorId, {
      avatar,
      authorName,
      biography,
    });
    return response.data;
  } catch (err) {
    handleApiError(err, {
      404: 'Không tìm thấy tác giả.',
    });
  }
};

export const deleteAuthor = async (authorId) => {
  try {
    const response = await axiosClient.delete(DELETE_AUTHOR_URL + authorId);
    return response.data;
  } catch (err) {
    handleApiError(err, {
      404: 'Không tìm thấy tác giả.',
    });
  }
};
