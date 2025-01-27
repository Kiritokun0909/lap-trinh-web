import { Link } from "react-router-dom";
import "../../styles/site/Header.css";
import { useEffect, useRef, useState } from "react";
import { getListGenres } from "../../api/genreApi";

const useDropdownVisibility = () => {
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef(null);
  const subMenuRef = useRef(null);

  const show = () => setIsVisible(true);
  const hide = () => setIsVisible(false);

  const handleOutsideClick = (event) => {
    if (
      buttonRef.current &&
      !buttonRef.current.contains(event.target) &&
      subMenuRef.current &&
      !subMenuRef.current.contains(event.target)
    ) {
      hide();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  });

  return { isVisible, show, hide, buttonRef, subMenuRef };
};

export default function Header() {
  const [genres, setGenres] = useState([]);
  // const { isLoggedIn, roleId, logout } = useContext(AuthContext);
  const [searchContext, setSearchContext] = useState("");

  const genresDropdown = useDropdownVisibility();
  const filterDropdown = useDropdownVisibility();
  const accountDropdown = useDropdownVisibility();

  useEffect(() => {
    const fetchGenres = async () => {
      const data = await getListGenres();
      setGenres(data);
    };
    fetchGenres();
  }, []);

  return (
    <div className="header">
      <div className="top-header">
        <div className="logo">
          <Link to="/">MReader</Link>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Nhập tên truyện..."
            value={searchContext}
            onChange={(e) => setSearchContext(e.target.value)}
          />
          <button>Tìm</button>
        </div>
      </div>
      <div className="nav-bar">
        <ul>
          <li
            onMouseEnter={genresDropdown.show}
            onMouseLeave={genresDropdown.hide}
            ref={genresDropdown.buttonRef}
          >
            <Link to="#">Thể loại</Link>
            {genresDropdown.isVisible && (
              <ul className="sub-menu" ref={genresDropdown.subMenuRef}>
                {genres?.map((genre) => (
                  <li key={genre.GenreId}>
                    <Link
                      to={`/genre?genreId=${genre.GenreId}&pageNumber=1`}
                      className="genre-link"
                    >
                      {genre.GenreName}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li
            onMouseEnter={filterDropdown.show}
            onMouseLeave={filterDropdown.hide}
            ref={filterDropdown.buttonRef}
          >
            <Link to="#">Lọc truyện</Link>
            {/* {filterDropdown.isVisible && (
              <ul className="sub-menu" ref={filterDropdown.subMenuRef}>
                <li>
                  <Link
                    to={`/search?keyword=&pageNumber=1&filter=${HandleCode.FILTER_BY_MANGA_VIEW_DESC}`}
                  >
                    Lượt xem
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/search?keyword=&pageNumber=1&filter=${HandleCode.FILTER_BY_MANGA_LIKE_DESC}`}
                  >
                    Lượt thích
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/search?keyword=&pageNumber=1&filter=${HandleCode.FILTER_BY_MANGA_UPDATE_DATE_DESC}`}
                  >
                    Ngày cập nhật
                  </Link>
                </li>
              </ul>
            )} */}
          </li>

          {/* Account Manager  */}
          <li>
            <Link to="/login">Đăng nhập</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
