import classNames from 'classnames/bind';
<<<<<<< HEAD
import styles from './Popper.module.scss';
=======
<<<<<<< HEAD
import styles from '~/components/Popper/Popper.module.scss';
=======
import styles from './Popper.module.scss';
>>>>>>> 3b7c1e6 (the firt commit)
>>>>>>> method
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

function Wrapper({ children,className }) {
    return <div className={cx('wrapper',className)}>{children}</div>;
}

Wrapper.propTypes={
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
}

export default Wrapper;