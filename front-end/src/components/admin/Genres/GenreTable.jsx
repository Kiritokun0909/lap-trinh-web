import React, { useState } from "react";
import { MdEdit, MdDelete, MdCheck } from "react-icons/md";

export default function GenreTable({ genres, setGenres, searchName }) {
  const [selectedGenres, setSelectedGenres] = useState([]);

  const [editingGenreId, setEditingGenreId] = useState(null);
  const [editedGenreName, setEditedGenreName] = useState("");

  const filteredGenres = genres.filter((genre) =>
    genre.genreName.toLowerCase().includes(searchName.toLowerCase())
  );

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedGenres(filteredGenres.map((genre) => genre.genreId));
    } else {
      setSelectedGenres([]);
    }
  };

  const handleSelectGenre = (genreId) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };
  const handleEdit = (genre) => {
    setEditingGenreId(genre.genreId);
    setEditedGenreName(genre.genreName);
  };

  const handleSaveEdit = (genreId) => {
    setGenres(
      genres.map((genre) =>
        genre.genreId === genreId
          ? { ...genre, genreName: editedGenreName }
          : genre
      )
    );
    setEditingGenreId(null);
  };

  const handleBulkDelete = () => {
    if (selectedGenres.length === 0) return;
    const updatedGenres = genres.filter(
      (genre) => !selectedGenres.includes(genre.genreId)
    );
    setGenres(updatedGenres);
    setSelectedGenres([]);
  };

  return (
    <>
      <div className="delete-section">
        <div>
          <button className="bulk-delete-button" onClick={handleBulkDelete}>
            Xóa tất cả đã chọn ({selectedGenres.length})
          </button>
        </div>
      </div>
      <div className="list-genres">
        <table className="genre-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    selectedGenres.length === filteredGenres.length &&
                    filteredGenres.length > 0
                  }
                />
              </th>
              <th>Tên thể loại</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredGenres.map((genre) => (
              <tr key={genre.genreId} className="genre-row">
                <td>
                  <input
                    type="checkbox"
                    checked={selectedGenres.includes(genre.genreId)}
                    onChange={() => handleSelectGenre(genre.genreId)}
                  />
                </td>
                <td>
                  {editingGenreId === genre.genreId ? (
                    <input
                      type="text"
                      value={editedGenreName}
                      onChange={(e) => setEditedGenreName(e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    genre.genreName
                  )}
                </td>
                <td>
                  {editingGenreId === genre.genreId ? (
                    <button
                      className="finish-button"
                      onClick={() => handleSaveEdit(genre.genreId)}
                    >
                      <MdCheck />
                      Hoàn tất
                    </button>
                  ) : (
                    <div className="action-buttons">
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(genre)}
                      >
                        <MdEdit />
                        Cập nhật
                      </button>
                      <button
                        className="delete-button"
                        onClick={() =>
                          setGenres(
                            genres.filter((g) => g.genreId !== genre.genreId)
                          )
                        }
                      >
                        <MdDelete />
                        Xóa
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
