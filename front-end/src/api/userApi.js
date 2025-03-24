import HandleCode from '../utils/HandleCode';
import axiosClient from './axiosClient';

const CHECK_LIKE_URL = '/user/check-like/';
const CHECK_FOLLOW_URL = '/user/check-follow/';

const LIKE_MANGA_URL = '/user/like/';
const UNLIKE_MANGA_URL = '/user/unlike/';
const FOLLOW_MANGA_URL = '/user/follow/';
const UNFOLLOW_MANGA_URL = '/user/unfollow/';

const GET_LIST_LIKE_URL = '/user/list-like';
const GET_LIST_FOLLOW_URL = '/user/list-follow';

export const checkUserLikeFollowManga = async (mangaId, type = 'like') => {
  try {
    const url = type === 'like' ? CHECK_LIKE_URL : CHECK_FOLLOW_URL;

    const response = await axiosClient.get(`${url}${mangaId}`);
    return response.data;
  } catch (err) {
    if (!err?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    throw new Error('Lỗi hệ thống, vui lòng thử lại sau.');
  }
};

export const likeFollowManga = async (mangaId, type = 'like') => {
  try {
    const url = type === 'like' ? LIKE_MANGA_URL : FOLLOW_MANGA_URL;
    const response = await axiosClient.post(`${url}${mangaId}`);
    return response.data;
  } catch (err) {
    if (!err?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    if (err.response && err.response.status === 409) {
      throw new Error('Bạn đã thích/theo dõi truyện này.');
    }

    throw new Error('Lỗi hệ thống, vui lòng thử lại sau.');
  }
};

export const unlikeUnfollowManga = async (mangaId, type = 'like') => {
  try {
    const url = type === 'like' ? UNLIKE_MANGA_URL : UNFOLLOW_MANGA_URL;
    const response = await axiosClient.delete(`${url}${mangaId}`);
    return response.data;
  } catch (err) {
    if (!err?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    if (err.response && err.response.status === 404) {
      throw new Error('Bạn đã huỷ thích/theo dõi truyện này.');
    }

    throw new Error('Lỗi hệ thống, vui lòng thử lại sau.');
  }
};

export const getListLikeFollowManga = async (
  page,
  limit,
  keyword = '',
  filterCode = HandleCode.FILTER_BY_USER_LIKE_FOLLOW_DATE_DESC,
  type = 'like'
) => {
  try {
    const url = type === 'like' ? GET_LIST_LIKE_URL : GET_LIST_FOLLOW_URL;

    const response = await axiosClient.get(
      `${url}?page=${page}&limit=${limit}&keyword=${keyword}&filterCode=${filterCode}`
    );
    return response.data;
  } catch (err) {
    if (!err?.response) {
      throw new Error('Hệ thống không phản hồi.');
    }

    throw new Error('Lỗi hệ thống, vui lòng thử lại sau.');
  }
};
