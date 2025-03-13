import styles from './Admin.module.scss';
import classNames from 'classnames/bind';
import { Link, Navigate, NavLink, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '~/context';
import image from '~/assets/Images';

const cs = classNames.bind(styles);

function Dashboard() {
    const { role } = useContext(AuthContext);

    const pathname = '/admin/dashboard';

    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        return <Navigate to="/movie" />;
    }
    if (!role) {
        return <Navigate to="/movie" />;
    }
    return (
        <div className={cs('admin_wrapper')}>
            <div className={cs('admin_Sidebar')}>
                <Link to="/movie" className={cs('admin_logo')}>
                    <img className={cs('admin_logo-img')} src={image.logo} alt="logo" />
                    <span className={cs('admin_first-titl')}>Peak</span>
                    <span className={cs('admin_last-titl')}>Cinema</span>
                </Link>
                <NavLink to={`${pathname}/statistic`} className={(nav) => cs('admin_nav-link', { active: nav.isActive })}>
                    Trang chủ
                </NavLink>
                <NavLink to={`${pathname}/movies`} className={(nav) => cs('admin_nav-link', { active: nav.isActive })}>
                    Quản lí phim
                </NavLink>
                <NavLink to={`${pathname}/genres`} className={(nav) => cs('admin_nav-link', { active: nav.isActive })}>
                    Quản lí thể loại
                </NavLink>
                <NavLink to={`${pathname}/users`} className={(nav) => cs('admin_nav-link', { active: nav.isActive })}>
                    Quản lí người dùng
                </NavLink>

                <button className={cs('admin_btn')}>
                    <a
                        href="/movie"
                        onClick={() => {
                            localStorage.removeItem('user');
                        }}
                        className={cs('admin_btn-logout')}
                    >
                        Đăng xuất
                    </a>
                </button>
            </div>

            <div className={cs('admin_Content')}>
                <Outlet />
            </div>
        </div>
    );
}

export default Dashboard;
