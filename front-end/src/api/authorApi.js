import axiosClient from './axiosClient';

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
    if (!err?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    throw new Error('Lỗi hệ thống, vui lòng thử lại sau.');
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
    if (!err?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    throw new Error('Lỗi hệ thống, vui lòng thử lại sau.');
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
    if (!err?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    if (err.response && err.response.status === 404) {
      throw new Error('Không tìm thấy tác giả.');
    }

    throw new Error('Lỗi hệ thống, vui lòng thử lại sau.');
  }
};

export const deleteAuthor = async (authorId) => {
  try {
    const response = await axiosClient.delete(DELETE_AUTHOR_URL + authorId);
    return response.data;
  } catch (err) {
    if (!err?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    if (err.response && err.response.status === 404) {
      throw new Error('Không tìm thấy tác giả.');
    }

    throw new Error('Lỗi hệ thống, vui lòng thử lại sau.');
  }
};
