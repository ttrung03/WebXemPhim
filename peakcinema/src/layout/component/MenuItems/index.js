import Tippy from '@tippyjs/react/headless';
import styles from './MenuItems.module.scss';
import classNames from 'classnames/bind';
import { memo, useState } from 'react';

import Wrapper from '~/components/Popper';
import image from '~/assets/Images';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut, faUser } from '@fortawesome/free-solid-svg-icons';

const cs = classNames.bind(styles);

function MenuItems() {
    const [menu, setMenu] = useState(false);
<<<<<<< HEAD
    const user = JSON.parse(localStorage.getItem('user'));
=======
    const userFirebase = JSON.parse(localStorage.getItem('user'));
>>>>>>> 3b7c1e6 (the firt commit)
    const handleClick = () => setMenu((menu) => !menu);

    return (
        <div>
            <Tippy
                interactive
                visible={menu}
                offset={[15, 10]}
                delay={[0, 700]}
                placement="bottom-end"
                render={(attrs) => (
                    <div className={cs('more-options')} tabIndex="-1" {...attrs}>
                        {/* dùng cái popper này để có thể dùng đc các hiệu ứng boxshadow,... của nó bên chỗ khác */}
                        <Wrapper className={cs('menu-popper')}>
                            <Link to="/profile" className={cs('btn')} onClick={() => setMenu(false)}>
                                <FontAwesomeIcon className={cs('icon')} icon={faUser} />
                                Xem thông tin cá nhân
                            </Link>
                            <a
                                href="/movie"
                                className={cs('btn')}
                                onClick={() => {
                                    localStorage.removeItem('user');
                                }}
                            >
                                <FontAwesomeIcon className={cs('icon')} icon={faSignOut} />
                                Đăng xuất
                            </a>
                        </Wrapper>
                    </div>
                )}
                onClickOutside={() => setMenu(false)}

                //khi ấn vào avatar ko bị ẩn
                // hideOnClick={false}
            >
                <img
<<<<<<< HEAD
                    src={user.avatar || image.avatar}
=======
                    src={userFirebase.avatar || image.avatar}
>>>>>>> 3b7c1e6 (the firt commit)
                    className={cs('user-avatar')}
                    alt=""
                    onClick={handleClick}
                />
            </Tippy>
        </div>
    );
}

export default memo(MenuItems);
