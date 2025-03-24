import axiosClient from "./axiosClient";

const GET_GENRES_URL = "/genres";
const ADD_GENRE_URL = "/genres";
const UPDATE_GENRE_URL = "/genres";
const DELETE_GENRE_URL = "/genres";

//#region get-genre
export const getGenres = async () => {
  try {
    const response = await axiosClient.get(GET_GENRES_URL);
    return response.data;
  } catch (err) {
    console.error("Error fetching list genre:", err);
  }
};
//#endregion

//#region add-new-genre
export const addGenre = async (genreName) => {
  try {
    const response = await axiosClient.post(ADD_GENRE_URL, {
      genreName: genreName,
    });

    return response.data;
  } catch (err) {
    if (!err?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    if (err.response && err.response.status === 400) {
      throw new Error(
        "Đã có tên thể loại này, vui lòng đặt tên khác và thử lại."
      );
    }

    throw new Error("Thêm thể loại mới thất bại, vui lòng thử lại.");
  }
};
//#endregion

//#region update-genre
export const updateGenre = async (genreId, newGenreName) => {
  try {
    const response = await axiosClient.put(`${UPDATE_GENRE_URL}/${genreId}`, {
      genreName: newGenreName,
    });

    return response.data;
  } catch (err) {
    if (!err?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    if (err.response && err.response.status === 404) {
      throw new Error("Không tìm thấy thể loại này.");
    }

    if (err.response && err.response.status === 400) {
      throw new Error(
        "Đã có tên thể loại này, vui lòng đặt tên khác và thử lại."
      );
    }

    throw new Error("Chỉnh sửa tên thể loại thất bại, vui lòng thử lại.");
  }
};
//#endregion

//#region delete-genre
export const deleteGenre = async (genreIds) => {
  try {
    const responses = await Promise.all(
      genreIds.map((genreId) =>
        axiosClient.delete(`${DELETE_GENRE_URL}/${genreId}`)
      )
    );

    return responses.data;
  } catch (err) {
    if (!err?.response) {
      throw new Error("Hệ thống không phản hồi.");
    }

    if (err.response && err.response.status === 404) {
      throw new Error("Không tìm thấy thể loại này.");
    }

    throw new Error("Xoá thể loại thất bại, vui lòng thử lại.");
  }
};
//#endregion
