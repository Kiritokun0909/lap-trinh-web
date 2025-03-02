import axiosClient from "./axiosClient";

//#region get-manga
export const getMangas = async (page, limit) => {
  try {
    const response = await axiosClient.get(
      `/mangas?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
//#endregion
