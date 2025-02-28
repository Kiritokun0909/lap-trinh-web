import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getGenres } from "../../api/genreApi";
import "../../styles/site/Header.css";
import "../../styles/App.css";

const filterOptions = [
  { name: "Lượt xem", value: "100" },
  { name: "Đánh giá", value: "200" },
  { name: "Ngày đăng", value: "300" },
];

const useDropdownMenu = () => {
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

function TopHeader() {
  const [searchContext, setSearchContext] = useState("");

  return (
    <div className="column-item top-header">
      <div className="column-item__sidebar-one"></div>
      <div className="column-item__main-column">
        <div className="top-header-container">
          <div className="logo">
            <Link to="/">MReader</Link>
          </div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Tìm kiếm truyện..."
              value={searchContext}
              onChange={(e) => setSearchContext(e.target.value)}
            />
            <button className="search-button">
              <img src="search-icon.png" alt="Search" className="search-icon" />
            </button>
          </div>
        </div>
      </div>
      <div className="column-item__sidebar-two"></div>
    </div>
  );
}

function NavigationBar() {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      const data = await getGenres();
      setGenres(data);
    };
    fetchGenres();
  }, []);

  const genresMenu = useDropdownMenu();
  const filterDropdown = useDropdownMenu();
  const accountDropdown = useDropdownMenu();

  return (
    <div className="nav-bar">
      <div className="column-item__sidebar-one"></div>
      <div className="column-item__main-column">
        <div className="nav-bar__container">
          <ul>
            <li
              onMouseEnter={genresMenu.show}
              onMouseLeave={genresMenu.hide}
              ref={genresMenu.buttonRef}
            >
              <Link to="#">Thể loại</Link>
              {genresMenu.isVisible && (
                <div className="sub-menu" ref={genresMenu.subMenuRef}>
                  {genres?.map((genre) => (
                    <div className="sub-menu-item" key={genre.GenreId}>
                      <Link
                        to={`/genre?genreId=${genre.GenreId}&pageNumber=1`}
                        className="genre-link"
                      >
                        {genre.GenreName}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </li>

            <li
              onMouseEnter={filterDropdown.show}
              onMouseLeave={filterDropdown.hide}
              ref={filterDropdown.buttonRef}
            >
              <Link to="#">Xếp hạng</Link>
              {filterDropdown.isVisible && (
                <div className="sub-menu" ref={filterDropdown.subMenuRef}>
                  {filterOptions.map((option) => (
                    <div className="sub-menu-item" key={option.value}>
                      <Link
                        to={`/search?keyword=&pageNumber=1&filter=${option.value}`}
                      >
                        {option.name}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </li>

            {/* Account Manager  */}
            <li>
              <Link to="/login">Đăng nhập</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="column-item__sidebar-two"></div>
    </div>
  );
}

export default function Header() {
  return (
    <div className="header">
      <TopHeader />
      <NavigationBar />
    </div>
  );
}
