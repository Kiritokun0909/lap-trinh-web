import axiosClient from "./axiosClient";

//#region get-list-genre
export const getListGenres = async () => {
  try {
    const response = await axiosClient.get(`/genres`);
    return response.data;
  } catch (error) {
    console.error("Error fetching list genre:", error);
  }
};
//#endregion
