/* eslint-disable eqeqeq */
import styles from './film.create1.module.scss';
import classNames from 'classnames/bind';
import { Col, Form, Row } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { createMovie } from '~/apiService/movie';
import { getAll } from '~/apiService/genres';
import { AuthContext } from '~/context';

import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

const cs = classNames.bind(styles);

const CreateMovie = () => {
    const [isTvShow, setIsTvShow] = useState(false);
    const [genres, setGenres] = useState([]);
    const [backdrop, setBackdrop] = useState('');
    const [posTer, setPosTer] = useState('');

    const { showToastMessage } = useContext(AuthContext);
    const navigate = useNavigate();
    const storage = getStorage();

    const { register, handleSubmit, reset } = useForm();

    const Onsubmit = async (data) => {
        data.ibmPoints = Number(data.ibmPoints);
        data.episodes = Number(data.episodes);
        if (posTer) {
            data.poster_path = posTer;
        }
        if (backdrop) {
            data.backdrop_path = backdrop;
        }

        try {
            const res = await createMovie(data);
            navigate('/admin/dashboard/movies');
            showToastMessage('success', res.message);
            reset();
        } catch (error) {
            showToastMessage('error', error.message);
        }
    };

    const handleChangeCate = (e) => {
        setIsTvShow(e.target.value === 'tv');
    };

    useEffect(() => {
        const getGenres = async () => {
            try {
                const res = await getAll();
                setGenres(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        getGenres();
    }, []);

    const handleUploadImg = (e) => {
        const image = e.target.files[0];
        if (image) {
            const storageRef = ref(storage, `images/${image.name}`);
            const uploadTask = uploadBytesResumable(storageRef, image);
            uploadTask.on(
                'state_changed',
                () => {},
                (error) => {
                    console.error(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        if (e.target.id === 'backDrop') {
                            setBackdrop(downloadURL);
                        } else {
                            setPosTer(downloadURL);
                        }
                    });
                },
            );
        }
    };

    return (
        <div className={cs('create_film_container')}>
            <h3 className={cs('create_film_title')}>Thêm phim mới</h3>
            <Form className={cs('create_film_form')} onSubmit={handleSubmit(Onsubmit)}>
                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label className={cs('create_film_label')}>Tên phim</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                {...register('name')}
                                className={cs('create_film_input')}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label className={cs('create_film_label')}>Link trailer</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                {...register('trailerCode')}
                                className={cs('create_film_input')}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label className={cs('create_film_label')}>Danh mục</Form.Label>
                            <Form.Select
                                {...register('category')}
                                onChange={handleChangeCate}
                                className={cs('create_film_select')}
                            >
                                <option value="movie">Phim Lẻ</option>
                                <option value="tv">Phim Dài Tập</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    {isTvShow && (
                        <>
                            <Col>
                                <Form.Group>
                                    <Form.Label className={cs('create_film_label')}>Phần</Form.Label>
                                    <Form.Control
                                        required
                                        type="number"
                                        {...register('seasons')}
                                        className={cs('create_film_input')}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label className={cs('create_film_label')}>Số tập phim</Form.Label>
                                    <Form.Control
                                        required
                                        type="number"
                                        {...register('episodes')}
                                        className={cs('create_film_input')}
                                    />
                                </Form.Group>
                            </Col>
                        </>
                    )}
                </Row>
                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label className={cs('create_film_label')}>Thể loại</Form.Label>
                            <Form.Select
                                {...register('genres')}
                                multiple
                                className={cs('create_film_select')}
                            >
                                {genres.map((genre, index) => (
                                    <option value={genre.id} key={index}>
                                        {genre.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label className={cs('create_film_label')}>Quốc gia</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                {...register('country')}
                                className={cs('create_film_input')}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label className={cs('create_film_label')}>Id url phim</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                {...register('id')}
                                className={cs('create_film_input')}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label className={cs('create_film_label')}>Tóm tắt phim</Form.Label>
                            <Form.Control
                                required
                                as="textarea"
                                {...register('overview')}
                                className={cs('create_film_textarea')}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label className={cs('create_film_label')}>Ngày phát hành</Form.Label>
                            <Form.Control
                                required
                                type="date"
                                {...register('releaseDate')}
                                className={cs('create_film_input')}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label className={cs('create_film_label')}>Điểm đánh giá</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                {...register('ibmPoints')}
                                className={cs('create_film_input')}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label className={cs('create_film_label')}>Ảnh nền</Form.Label>
                            {backdrop && <img className={cs('create_film_image')} src={backdrop} alt="Backdrop" />}
                            <Form.Control
                                type="file"
                                id="backDrop"
                                onChange={handleUploadImg}
                                className={cs('create_film_input')}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label className={cs('create_film_label')}>Ảnh đại diện</Form.Label>
                            {posTer && <img className={cs('create_film_image')} src={posTer} alt="Poster" />}
                            <Form.Control
                                type="file"
                                onChange={handleUploadImg}
                                className={cs('create_film_input')}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <button type="submit" className={cs('create_film_button')}>
                    Thêm phim
                </button>
            </Form>
        </div>
    );
};

export default CreateMovie;
