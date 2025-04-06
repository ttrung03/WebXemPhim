import styles from './Header.module.scss';
import classNames from 'classnames/bind';
import { Link, useNavigate } from 'react-router-dom';
import image from '~/assets/Images';
import SearchBox from '../SearchBox';
import MenuItems from '../MenuItems';

const cs = classNames.bind(styles);

function Header({ className, onClick }) {
    const navigate = useNavigate();
<<<<<<< HEAD
    const userFirebase = JSON.parse(localStorage.getItem('user'));
=======
<<<<<<< HEAD
    const user = JSON.parse(localStorage.getItem('user'));
=======
    const userFirebase = JSON.parse(localStorage.getItem('user'));
>>>>>>> 3b7c1e6 (the firt commit)
>>>>>>> method

    return (
        <header className={cs('header-wrapper', className)}>
            <Link to="/movie" className={cs('header-logo')}>
                <img className={cs('header-logo-img')} src={image.logo} alt="logo" />
                <span className={cs('header-first-titl')}>Peak</span>
                <span className={cs('header-last-titl')}>Cinema</span>
            </Link>
            <SearchBox />
            <div className={cs('header-login')}>
<<<<<<< HEAD
                {userFirebase ? (
=======
<<<<<<< HEAD
                {user ? (
=======
                {userFirebase ? (
>>>>>>> 3b7c1e6 (the firt commit)
>>>>>>> method
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
