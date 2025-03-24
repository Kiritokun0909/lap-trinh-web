import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { FaCaretDown } from 'react-icons/fa6';

import './NavigationBar.css';
import { useAuth } from '../../../context/AuthContext';
import { getGenres } from '../../../api/genreApi';
import { toast } from 'react-toastify';

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
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  });

  return { isVisible, show, hide, buttonRef, subMenuRef };
};

function NavbarItem({ link, label, icon, onClick }) {
  return (
    <div className='nav-bar__item'>
      <Link to={link} onClick={onClick}>
        {icon && <div className='nav-bar-icon'>{icon}</div>}
        {label && <span>{label}</span>}
      </Link>
    </div>
  );
}

export default function NavigationBar() {
  const { isLoggedIn, removeCredentials } = useAuth();

  const [genres, setGenres] = useState([]);

  const genresMenu = useDropdownMenu();
  const accountMenu = useDropdownMenu();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenres = async () => {
      const data = await getGenres();
      setGenres(data);
    };

    fetchGenres();
  }, []);

  const handleLogout = () => {
    removeCredentials();
    toast.success('Đăng xuất thành công!');
    navigate('/');
  };

  return (
    <div className='nav-bar__container'>
      <div className='nav-bar__function'>
        <NavbarItem link='/' icon={<FaHome />} />
        <NavbarItem link='/search?filterId=1' label={'HOT'} />
        <NavbarItem link='/search?filterId=2' label={'MỚI CẬP NHẬT'} />

        <div
          className='nav-bar__item item--genres'
          onMouseEnter={genresMenu.show}
          onMouseLeave={genresMenu.hide}
          ref={genresMenu.buttonRef}
        >
          <Link className='item--genres__title' to='/search'>
            THỂ LOẠI <FaCaretDown />
          </Link>
          {genresMenu.isVisible && (
            <div className='item--genres__list' ref={genresMenu.subMenuRef}>
              {genres?.map((genre) => (
                <Link
                  key={genre.genreId}
                  to={`/search?genreId=${genre.genreId}`}
                >
                  {genre.genreName}
                </Link>
              ))}
            </div>
          )}
        </div>

        <NavbarItem link='/search' label={'TÌM TRUYỆN'} />
      </div>

      <div className='nav-bar__account'>
        {!isLoggedIn ? (
          <div className='nav-bar__item item--accounts'>
            <Link className='item--account__title' to='/login'>
              ĐĂNG NHẬP
            </Link>
          </div>
        ) : (
          <div
            className='nav-bar__item item--accounts'
            onMouseEnter={accountMenu.show}
            onMouseLeave={accountMenu.hide}
            ref={accountMenu.buttonRef}
          >
            <Link className='item--account__title' to='/'>
              TÀI KHOẢN <FaCaretDown />
            </Link>
            {accountMenu.isVisible && (
              <div className='item--account__list' ref={accountMenu.subMenuRef}>
                <Link to='#'>Thông báo</Link>
                <Link to='#'>Yêu thích</Link>
                <Link to='#'>Theo dõi</Link>
                <Link to='#'>Lịch sử</Link>
                <Link to='#'>Đổi thông tin</Link>
                <Link to='#'>Đổi mật khẩu</Link>
                <Link to='#' onClick={handleLogout}>
                  Đăng xuất
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
