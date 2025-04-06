/* eslint-disable eqeqeq */
import styles from './film.create1.module.scss';
import classNames from 'classnames/bind';
import { Col, Form, Row } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { createMovie } from '~/apiService/movie';
import { getAll } from '~/apiService/genres';
import { AuthContext } from '~/context';
import { supabase } from '~/components/Supabase';

const cs = classNames.bind(styles);

const CreateMovie = () => {
    const [isTvShow, setIsTvShow] = useState(false);
    const [genres, setGenres] = useState([]);
    const [backdrop, setBackdrop] = useState('');
    const [posTer, setPosTer] = useState('');
    const [uploading, setUploading] = useState(false);
    const [seasons, setSeasons] = useState('');
    const [episodes, setEpisodes] = useState('');
    const [episodeDuration, setEpisodeDuration] = useState('');
    const [tvStatus, setTvStatus] = useState('ongoing');

    const { showToastMessage } = useContext(AuthContext);
    const navigate = useNavigate();

    const { register, handleSubmit, reset } = useForm();

    const handleUploadImg = async (e) => {
        try {
            setUploading(true);
            const image = e.target.files[0];
            if (!image) return;

            const fileExt = image.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            
            const { error: uploadError } = await supabase.storage
                .from('movies')
                .upload(fileName, image);

            if (uploadError) {
                throw uploadError;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('movies')
                .getPublicUrl(fileName);

            if (e.target.id === 'backDrop') {
                setBackdrop(publicUrl);
            } else {
                setPosTer(publicUrl);
            }
        } catch (error) {
            console.error('Error uploading image:', error.message);
            showToastMessage('error', 'Lỗi khi tải ảnh lên: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const Onsubmit = async (e) => {
        e.preventDefault();
        if (!backdrop || !posTer) {
            showToastMessage('error', 'Vui lòng chọn đầy đủ ảnh');
            return;
        }

        const formData = {
            name: e.target.elements.name.value,
            trailerCode: e.target.elements.trailerCode.value,
            category: e.target.elements.category.value,
            type: isTvShow ? 'tv' : 'movie',
            ...(isTvShow && {
                seasons: Number(e.target.elements.seasons.value),
                episodes: Number(e.target.elements.episodes.value),
                episodeDuration: Number(e.target.elements.episodeDuration.value),
                status: e.target.elements.status.value
            }),
            genres: Array.from(e.target.elements.genres.selectedOptions, option => option.value),
            country: e.target.elements.country.value,
            id: e.target.elements.id.value,
            overview: e.target.elements.overview.value,
            releaseDate: e.target.elements.releaseDate.value,
            ibmPoints: Number(e.target.elements.ibmPoints.value),
            backdrop_path: backdrop,
            poster_path: posTer
        };

        try {
            const res = await createMovie(formData);
            navigate('/admin/dashboard/movies');
            showToastMessage('success', res.message);
            reset();
            setBackdrop('');
            setPosTer('');
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
                        <div className={styles.tv_show_section}>
                            <h3>Thông tin phim dài tập</h3>
                            <div className={styles.form_group}>
                                <label>Số phần:</label>
                                <input
                                    type="number"
                                    name="seasons"
                                    min="1"
                                    value={seasons}
                                    onChange={(e) => setSeasons(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.form_group}>
                                <label>Số tập phim:</label>
                                <input
                                    type="number"
                                    name="episodes"
                                    min="1"
                                    value={episodes}
                                    onChange={(e) => setEpisodes(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.form_group}>
                                <label>Thời lượng mỗi tập (phút):</label>
                                <input
                                    type="number"
                                    name="episodeDuration"
                                    min="1"
                                    value={episodeDuration}
                                    onChange={(e) => setEpisodeDuration(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.form_group}>
                                <label>Trạng thái:</label>
                                <select
                                    name="status"
                                    value={tvStatus}
                                    onChange={(e) => setTvStatus(e.target.value)}
                                    required
                                >
                                    <option value="ongoing">Đang chiếu</option>
                                    <option value="completed">Đã hoàn thành</option>
                                    <option value="upcoming">Sắp chiếu</option>
                                </select>
                            </div>
                        </div>
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
                            {backdrop && (
                                <div className={cs('image-preview')}>
                                    <img 
                                        className={cs('create_film_image')} 
                                        src={backdrop} 
                                        alt="Backdrop"
                                    />
                                </div>
                            )}
                            <Form.Control
                                type="file"
                                accept="image/*"
                                id="backDrop"
                                onChange={handleUploadImg}
                                className={cs('create_film_input')}
                                disabled={uploading}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label className={cs('create_film_label')}>Ảnh đại diện</Form.Label>
                            {posTer && (
                                <div className={cs('image-preview')}>
                                    <img 
                                        className={cs('create_film_image')} 
                                        src={posTer} 
                                        alt="Poster"
                                    />
                                </div>
                            )}
                            <Form.Control
                                type="file"
                                accept="image/*"
                                id="poster"
                                onChange={handleUploadImg}
                                className={cs('create_film_input')}
                                disabled={uploading}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <button type="submit" className={cs('create_film_button')} disabled={uploading}>
                    {uploading ? 'Đang tải ảnh...' : 'Thêm phim'}
                </button>
            </Form>
        </div>
    );
};

export default CreateMovie;