import styles from './Header.module.scss';
import classNames from 'classnames/bind';
import { Link, useNavigate } from 'react-router-dom';
import image from '~/assets/Images';
import SearchBox from '../SearchBox';
import MenuItems from '../MenuItems';

const cs = classNames.bind(styles);

function Header({ className, onClick }) {
    const navigate = useNavigate();
    const userFirebase = JSON.parse(localStorage.getItem('user'));

    return (
        <header className={cs('header-wrapper', className)}>
            <Link to="/movie" className={cs('header-logo')}>
                <img className={cs('header-logo-img')} src={image.logo} alt="logo" />
                <span className={cs('header-first-titl')}>Peak</span>
                <span className={cs('header-last-titl')}>Cinema</span>
            </Link>
            <SearchBox />
            <div className={cs('header-login')}>
                {userFirebase ? (
                    <MenuItems />
                ) : (
                    <button className={cs('header-btn-login')} onClick={() => navigate('/login')}>
                        Đăng nhập
                    </button>
                )}
            </div>
        </header>
    );
}

export default Header;
