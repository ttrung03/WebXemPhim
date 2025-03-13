import styles from './genres.edit.module.scss';
import classNames from 'classnames/bind';
import { Form } from 'react-bootstrap';
import { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getDetail, editGenres } from '~/apiService/genres';
import { AuthContext } from '~/context';
import { useNavigate, useParams } from 'react-router-dom';

const cs = classNames.bind(styles);

const EditGenres = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToastMessage } = useContext(AuthContext);

    const { register, handleSubmit, reset } = useForm();

    const Onsubmit = async (data) => {
        try {
            const res = await editGenres(data, id);
            navigate('/admin/dashboard/genres');
            showToastMessage('success', res.message);
        } catch (error) {
            showToastMessage(error);
        }
    };

    useEffect(() => {
        const getGenres = async () => {
            try {
                const res = await getDetail(id);
                if (res.success) {
                    reset(res.data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        getGenres();
    }, [id, reset]);

    return (
        <div className={cs('edit_genres_container')}>
            <h3 className={cs('edit_genres_title')}>Sửa thể loại</h3>
            <Form className={cs('edit_genres_form')} onSubmit={handleSubmit(Onsubmit)}>
                <Form.Group className="mb-3">
                    <Form.Label className={cs('edit_genres_label')}>Tên thể loại</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        {...register('name')}
                        className={cs('edit_genres_input')}
                    />
                </Form.Group>
                <button type="submit" className={cs('edit_genres_button')}>
                    Lưu thông tin
                </button>
            </Form>
        </div>
    );
};

export default EditGenres;
