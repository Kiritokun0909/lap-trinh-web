import TopHeader from '../TopHeader/TopHeader';
import NavigationBar from '../NavigationBar/NavigationBar';

import '../../../styles/App.css';
import './Header.css';

export default function Header() {
  return (
    <div className='header'>
      <div className='top-header container'>
        <div className='sidebar'></div>
        <div className='main__container'>
          <TopHeader />
        </div>
        <div className='sidebar'></div>
      </div>
      <div className='nav-bar container'>
        <div className='sidebar'></div>
        <div className='main__container'>
          <NavigationBar />
        </div>
        <div className='sidebar'></div>
      </div>
    </div>
  );
}
