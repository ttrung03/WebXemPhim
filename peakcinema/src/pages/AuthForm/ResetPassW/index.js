import styles from './ResetPassw.module.scss';
import classNames from 'classnames/bind';
import { forwardRef, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '~/context';

const cs = classNames.bind(styles);

function ResetPass({ handleCloseModal }, ref) {
    const form = useRef();
    const { showToastMessage } = useContext(AuthContext);

    // Hàm kiểm tra định dạng email
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const sendMessage = async (e) => {
        e.preventDefault();

        const email = form.current.email.value.trim();

        // Kiểm tra email hợp lệ trước khi xử lý
        if (!validateEmail(email)) {
            showToastMessage('error', 'Email không hợp lệ. Vui lòng kiểm tra lại!');
            return;
        }

        try {
            // Gọi API forgot-password
            const response = await axios.post('http://localhost:8888/api/auth/forgot-password', {
                email,
            });

            if (response.data.success) {
                showToastMessage('success', 'Vui lòng kiểm tra email để đặt lại mật khẩu.');
                handleCloseModal();
                form.current.reset(); // Reset form
            } else {
                showToastMessage('error', response.data.message || 'Có lỗi xảy ra.');
            }
        } catch (error) {
            console.error('Lỗi xử lý:', error);
            showToastMessage('error', error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại!');
        }
    };

    return (
        <div ref={ref} className={cs('modal')} onClick={(e) => e.target.classList.remove('openModal')}>
            <form
                ref={form}
                onSubmit={sendMessage}
                className={cs('modalContain')}
                onClick={(e) => e.stopPropagation()}
            >
                <h4 className={cs('modalHeader')}>Hãy nhập email của bạn để đặt lại mật khẩu</h4>
                <input
                    className={cs('inputConfirm')}
                    name="email"
                    required
                    placeholder="Nhập email..."
                    type="email"
                />
                <button className={cs('modalBtn')}>Xác nhận</button>
            </form>
        </div>
    );
}

export default forwardRef(ResetPass);
