import styles from './genres.create.module.scss';
import classNames from 'classnames/bind';
import { Form } from 'react-bootstrap';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { createGenres } from '~/apiService/genres';
import { AuthContext } from '~/context';
import { useNavigate } from 'react-router-dom';

const cs = classNames.bind(styles);

const CreateGenres = () => {
    const { showToastMessage } = useContext(AuthContext);
    const navigate = useNavigate();

    const { register, handleSubmit, reset } = useForm();

    const Onsubmit = async (data) => {
        try {
            const res = await createGenres(data);
            navigate('/admin/dashboard/genres');
            showToastMessage('success', res.message);
            reset();
        } catch (error) {
            showToastMessage('error', 'Id đã tồn tại trên hệ thống');
        }
    };

    return (
        <div className={cs('create_genres_container')}>
            <h3 className={cs('create_genres_title')}>Thêm thể loại mới</h3>
            <Form className={cs('create_genres_form')} onSubmit={handleSubmit(Onsubmit)}>
                <Form.Group className="mb-4">
                    <Form.Label className={cs('create_genres_label')}>Id</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        {...register('id')}
                        className={cs('create_genres_input')}
                    />
                </Form.Group>
                <Form.Group className="mb-4">
                    <Form.Label className={cs('create_genres_label')}>Tên thể loại</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        {...register('name')}
                        className={cs('create_genres_input')}
                    />
                </Form.Group>
                <button type="submit" className={cs('create_genres_button')}>
                    <span className={cs('create_genres_label_button')}>Thêm thể loại</span>
                    <span className={cs('create_genres_gradient-container')}>
                        <span className={cs('create_genres_gradient')}></span>
                    </span>
                </button>
            </Form>
        </div>
    );
};

export default CreateGenres;
