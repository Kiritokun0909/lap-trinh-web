import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaList } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { FaClock } from 'react-icons/fa';

import { getMangas } from '../../../api/mangaApi';
import DarkModeButton from '../../DarkModeButton/DarkModeButton';
import { useAuth } from '../../../context/AuthContext';
import { formatDate } from '../../../utils/utils';

import './TopHeader.css';
import HandleCode from '../../../utils/HandleCode';

const MAX_RESULT = 10;

function SearchInput({ searchContext, setSearchContext, searchResult, closeMenu }) {
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef();

  const handleLinkClick = () => {
    setIsSearching(false);
    inputRef.current?.blur();
    if (closeMenu) closeMenu();
  };

  return (
    <div className='search-bar__search'>
      <input
        ref={inputRef}
        type='text'
        placeholder='Tìm kiếm truyện...'
        value={searchContext}
        onChange={(e) => setSearchContext(e.target.value)}
        onFocus={() => setIsSearching(true)}
        onBlur={() => setIsSearching(false)}
      />
      {isSearching && searchResult.length > 0 && (
        <div className='search-result'>
          {searchResult.map((manga) => (
            <Link
              key={manga.mangaId}
              to={`/manga/${manga.mangaId}`}
              onClick={handleLinkClick}
              onMouseDown={(e) => e.preventDefault()}
            >
              <div className='search-item'>
                <img
                  src={manga.coverImageUrl}
                  alt={manga.mangaName}
                  className='search-item__cover'
                />
                <div className='search-item__info'>
                  <div className='search-item__info-row'>{manga.mangaName}</div>
                  <div className='search-item__info-row search-item__info-row--secondary'>
                    {manga.otherName}
                  </div>
                  <div className='search-item__info-row search-item__info-row--secondary'>
                    <div className='btn-icon'>
                      <FaClock />
                      {formatDate(manga.updateAt)}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarMenuLink({ to, label, onClick }) {
  return (
    <Link to={to} onClick={onClick}>
      {label}
    </Link>
  );
}

export default function TopHeader() {
  const { isLoggedIn, removeCredentials } = useAuth();
  const [searchContext, setSearchContext] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();

  // Fetch search results
  useEffect(() => {
    const fetchSearchResult = async () => {
      if (searchContext === '') {
        setSearchResult([]);
        return;
      }

      try {
        const data = await getMangas(1, MAX_RESULT, searchContext);
        setSearchResult(data.items);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSearchResult();
  }, [searchContext]);

  const handleLogout = () => {
    removeCredentials();
    toast.success('Đăng xuất thành công!');
    navigate('/');
    setShowMenu(false); // Close the menu after logout
  };

  const handleCloseSidebarMenu = () => setShowMenu(false);

  const handleClickSearchButton = () => {
    navigate(`/search?keyword=${searchContext}`);
  };

  return (
    <div className='top-header__container'>
      <div className='top-header__logo'>
        <Link to='/'>MReader</Link>
      </div>
      <div className='top-header__search-bar'>
        <SearchInput
          searchContext={searchContext}
          setSearchContext={setSearchContext}
          searchResult={searchResult}
        />
        <div className='search-bar__btn-search'>
          <button onClick={handleClickSearchButton}>
            <img src='/icon/search-icon.png' alt='Search' className='search-icon' />
          </button>
        </div>
      </div>
      <div className='top-header__function'>
        <div className='function__dark-mode-toggle'>
          <DarkModeButton />
        </div>
        <div className='function__menu'>
          <button type='button' onClick={() => setShowMenu(!showMenu)}>
            <FaList />
          </button>
          <div className='sidebar-menu'>
            {showMenu && (
              <div className='sidebar-menu__container'>
                <div className='sidebar-menu-search'>
                  <SearchInput
                    searchContext={searchContext}
                    setSearchContext={setSearchContext}
                    searchResult={searchResult}
                    closeMenu={handleCloseSidebarMenu}
                  />
                </div>
                <SidebarMenuLink to='/' label='TRANG CHỦ' onClick={handleCloseSidebarMenu} />
                <SidebarMenuLink
                  to={`/search?filterId=${HandleCode.FILTER_BY_MANGA_NUM_FOLLOWS_DESC}`}
                  label='HOT'
                  onClick={handleCloseSidebarMenu}
                />
                <SidebarMenuLink
                  to={`/search?filterId=${HandleCode.FILTER_BY_MANGA_UPDATE_AT_DESC}`}
                  label='MỚI CẬP NHẬT'
                  onClick={handleCloseSidebarMenu}
                />
                <SidebarMenuLink to='/search' label='TÌM KIẾM' onClick={handleCloseSidebarMenu} />

                {isLoggedIn ? (
                  <>
                    <SidebarMenuLink
                      to='/account/notifications'
                      label='THÔNG BÁO'
                      onClick={handleCloseSidebarMenu}
                    />
                    <SidebarMenuLink
                      to='/account/likes'
                      label='YÊU THÍCH'
                      onClick={handleCloseSidebarMenu}
                    />
                    <SidebarMenuLink
                      to='/account/follows'
                      label='THEO DÕI'
                      onClick={handleCloseSidebarMenu}
                    />
                    <SidebarMenuLink
                      to='/account/histories'
                      label='LỊCH SỬ'
                      onClick={handleCloseSidebarMenu}
                    />
                    <SidebarMenuLink
                      to='/account/info'
                      label='ĐỔI THÔNG TIN'
                      onClick={handleCloseSidebarMenu}
                    />
                    <SidebarMenuLink
                      to='/account/password'
                      label='ĐỔI MẬT KHẨU'
                      onClick={handleCloseSidebarMenu}
                    />
                    <SidebarMenuLink to='/#' label='ĐĂNG XUẤT' onClick={handleLogout} />
                  </>
                ) : (
                  <SidebarMenuLink to='/login' label='ĐĂNG NHẬP' onClick={handleCloseSidebarMenu} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
