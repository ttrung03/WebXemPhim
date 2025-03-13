import styles from './ResetPassw.module.scss';
import classNames from 'classnames/bind';
import { useRef, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '~/context';

const cs = classNames.bind(styles);

function FormInputNewPassW() {
    const form = useRef();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { showToastMessage } = useContext(AuthContext);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        const newPassword = form.current.password.value.trim();
        const key = searchParams.get('key');

        if (!newPassword) {
            showToastMessage('error', 'Mật khẩu mới không được để trống!');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8888/api/auth/reset-password', {
                key,
                newPassword,
            });

            if (response.data.success) {
                showToastMessage('success', 'Cập nhật mật khẩu thành công!');
                navigate('/login');
            } else {
                showToastMessage('error', response.data.message || 'Có lỗi xảy ra.');
            }
        } catch (error) {
            console.error('Lỗi đặt lại mật khẩu:', error);
            showToastMessage('error', error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại!');
        }
    };

    return (
        <div className={cs('modalInputNewPass')}>
            <form
                ref={form}
                onSubmit={handleResetPassword}
                className={cs('modalContain')}
                style={{ marginTop: '40px', width: '400px', maxWidth: 'calc(100% - 32px)' }}
            >
                <h4 className={cs('modalHeader')}>Đặt lại mật khẩu</h4>
                <input
                    className={cs('inputConfirm')}
                    name="password"
                    type="password"
                    placeholder="Nhập mật khẩu mới..."
                    required
                />
                <button className={cs('modalBtn')}>Xác nhận</button>
            </form>
        </div>
    );
}

export default FormInputNewPassW;
