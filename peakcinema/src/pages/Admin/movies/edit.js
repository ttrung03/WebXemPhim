/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import styles from './film.edit1.module.scss';
import classNames from 'classnames/bind';
import { Col, Form, Row } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { firebaseConnect } from '~/components/Firebase';

import { editMovie } from '~/apiService/movie';
import { getAll } from '~/apiService/genres';
import requestApi from '~/apiService';
import { AuthContext } from '~/context';
import { Img } from '~/apiService/instance';

const cs = classNames.bind(styles);

const EditMovie = () => {
    const { slug } = useParams();
    const [isTvShow, setIsTvShow] = useState(false);
    const [genres, setGenres] = useState([]);
    const [movie, setMovie] = useState();
    const [backdrop, setBackdrop] = useState('');
    const [posTer, setPosTer] = useState('');

    const { showToastMessage } = useContext(AuthContext);
    const navigate = useNavigate();
    const storage = getStorage();

    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        const getMovie = async () => {
            try {
                const result = await requestApi.getDetails(slug);
                if (result.success) {
                    setMovie(result.data);
                    if (Number.isInteger(result.data.genres[0])) {
                        result.data.genres = result.data.genres.map((genre) => genre.toString());
                    }
                    result.data.seasons = result.data.seasons ? result.data.seasons : 1;
                    reset(result.data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        getMovie();
    }, [slug]);

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
            const res = await editMovie(data, movie._id);
            navigate(-1);
            showToastMessage('success', res.message);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChangeCate = (e) => {
        if (e.target.value == 'tv') {
            setIsTvShow(true);
        } else {
            setIsTvShow(false);
        }
    };

    useEffect(() => {
        const getGenres = async () => {
            try {
                const res = await getAll();
                setGenres(res.data);
            } catch (error) {
                console.log(error);
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
                (snapshot) => {},
                (error) => {
                    console.log(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        try {
                            if (e.target.id == 'backDrop') {
                                setBackdrop(downloadURL);
                            } else {
                                setPosTer(downloadURL);
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    });
                },
            );
        }
    };

    return (
        <div className={cs('edit_film_container')}>
            <h3 className={cs('edit_film_title')}>Sửa phim</h3>
            {movie && (
                <Form className={cs('edit_film_form')} onSubmit={handleSubmit(Onsubmit)}>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label className={cs('edit_film_label')}>Tên phim</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    {...register('name')}
                                    className={cs('edit_film_input')}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label className={cs('edit_film_label')}>Link trailer</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    {...register('trailerCode')}
                                    className={cs('edit_film_input')}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label className={cs('edit_film_label')}>Danh mục</Form.Label>
                                <Form.Select
                                    {...register('category')}
                                    onChange={handleChangeCate}
                                    className={cs('edit_film_select')}
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
                                        <Form.Label className={cs('edit_film_label')}>Phần</Form.Label>
                                        <Form.Control
                                            required
                                            type="number"
                                            {...register('seasons')}
                                            className={cs('edit_film_input')}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label className={cs('edit_film_label')}>Số tập phim</Form.Label>
                                        <Form.Control
                                            required
                                            type="number"
                                            {...register('episodes')}
                                            className={cs('edit_film_input')}
                                        />
                                    </Form.Group>
                                </Col>
                            </>
                        )}
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label className={cs('edit_film_label')}>Quốc gia</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    {...register('country')}
                                    className={cs('edit_film_input')}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label className={cs('edit_film_label')}>Id url phim</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    {...register('id')}
                                    className={cs('edit_film_input')}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label className={cs('edit_film_label')}>Tóm tắt phim</Form.Label>
                                <Form.Control
                                    required
                                    as="textarea"
                                    type="text"
                                    {...register('overview')}
                                    className={cs('edit_film_textarea')}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label className={cs('edit_film_label')}>Ngày phát hành</Form.Label>
                                <Form.Control
                                    required
                                    type="date"
                                    {...register('releaseDate')}
                                    className={cs('edit_film_input')}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label className={cs('edit_film_label')}>Điểm đánh giá</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    {...register('ibmPoints')}
                                    className={cs('edit_film_input')}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label className={cs('edit_film_label')}>Ảnh nền</Form.Label>
                                <img
                                    className={cs('edit_film_image')}
                                    src={backdrop || Img.baseImg(movie.backdrop_path)}
                                    alt="Backdrop"
                                />
                                <Form.Control
                                    type="file"
                                    id="backDrop"
                                    onChange={handleUploadImg}
                                    className={cs('edit_film_input')}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label className={cs('edit_film_label')}>Ảnh đại diện</Form.Label>
                                <img
                                    className={cs('edit_film_image')}
                                    src={posTer || Img.posterImg(movie.poster_path)}
                                    alt="Poster"
                                />
                                <Form.Control
                                    type="file"
                                    onChange={handleUploadImg}
                                    className={cs('edit_film_input')}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <button type="submit" className={cs('edit_film_button')}>
                        Cập nhật phim
                    </button>
                </Form>
            )}
        </div>
    );
};

export default EditMovie;
