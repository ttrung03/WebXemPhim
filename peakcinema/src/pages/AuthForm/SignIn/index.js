import { useContext, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './SignIn.module.scss';
import classNames from 'classnames/bind';
import image from '~/assets/Images';

import { login } from '~/apiService/auth';
import { AuthContext } from '~/context';
import ResetPassW from '../ResetPassW';

const cs = classNames.bind(styles);

const Login = () => {
    const resetPassRef = useRef();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { showToastMessage } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            showToastMessage('error', 'Vui lòng nhập đủ thông tin');
        } else {
            const res = await login({
                email,
                password,
            });
            if (res.success) {
                localStorage.setItem('user', JSON.stringify(res.data));
                navigate('/movie');
                showToastMessage('success', res.message);
                setEmail('');
                setPassword('');
            } else {
                showToastMessage('error', res.message);
            }
        }
    };

    const handleResetPassword = () => {
        resetPassRef.current.classList.add('openModal');
    };

    const handleCloseModal = () => {
        resetPassRef.current.classList.remove('openModal');
    };

    return (
        <div className={cs('login_wrapper')} style={{ backgroundImage: `url(${image.background})` }}>
            <div className={cs('login_modal')}>
                <Link to="/movie" className={cs('login_header')}>
                    <img className={cs('login_logo-img')} src={image.logo} alt="logo" />
                    <h4>Đăng nhập PEAKCINEMA</h4>
                </Link>
                <form onSubmit={handleSubmit} className={cs('login_form')}>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        placeholder="Nhập địa chỉ email..."
                        required
                        className={cs('login_input')}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        name="password"
                        value={password}
                        placeholder="Nhập mật khẩu..."
                        required
                        className={cs('login_input')}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className={cs('login_button')}>
                        Đăng nhập
                    </button>
                </form>
                <p className={cs('login_textNote')}>
                    Bạn chưa có tài khoản? <Link to="/register">Đăng kí ngay bây giờ</Link>
                </p>
                <p className={cs('login_textNote', 'login_reset')}>
                    <button onClick={handleResetPassword}>Quên mật khẩu?</button>
                </p>
                <ResetPassW ref={resetPassRef} handleCloseModal={handleCloseModal} />
            </div>
        </div>
    );
};
export default Login;
