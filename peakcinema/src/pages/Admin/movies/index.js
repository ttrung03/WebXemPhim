import styles from './Movies.module.scss';
import classNames from 'classnames/bind';
import { Button, Form, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useContext, useRef } from 'react';

import requestApi from '~/apiService/index';
import { deleteMovie, getMovieMonth } from '~/apiService/movie';
import { Img } from '~/apiService/instance';
import { AuthContext } from '~/context';
import Panigation from '~/layout/component/Panigation';
import CountCmt from './CountComment';

const cs = classNames.bind(styles);

function MoviesPage() {
    const [movies, setMovies] = useState();
    const [loading, setLoading] = useState(true);
    const [pages, setPages] = useState();
    const [currPage, setCurrPage] = useState(1);
    const [inputValue, setInputValue] = useState('');
    const [category, setCategory] = useState('all');
    const { showToastMessage } = useContext(AuthContext);

    const { searchValue, month } = useParams();
    const navigate = useNavigate();
    const inputRef = useRef();

    const handleChange = (e) => {
        const inputValue = e.target.value;
        if (!inputValue.startsWith(' ')) {
            setInputValue(inputValue);
        }
    };

    const getAllMovies = async (currPage) => {
        try {
            if (month) {
                const result = await getMovieMonth();
                if (result.success) {
                    setMovies(result.data);
                    setLoading(false);
                }
            } else if (searchValue) {
                const result = await requestApi.getSearch({ params: { keyword: searchValue } });
                if (result.success) {
                    setMovies(result.data);
                    setLoading(false);
                }
            } else {
                const result = await requestApi.getAll(currPage, category);
                if (result.success) {
                    setMovies(result.data);
                    setPages(result.pages);
                    setLoading(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllMovies(currPage);
    }, [currPage, searchValue, category, month]);

    const handleDeleteMovie = async (id) => {
        if (window.confirm('Bạn thật sự muốn xoá phim này')) {
            const res = await deleteMovie(id);
            showToastMessage('success', res.message);
            getAllMovies();
        }
    };

    useEffect(() => {
        if (inputValue) {
            const ref = inputRef.current;
            const enterKey = async (e) => {
                e.preventDefault();
                if (e.keyCode === 13) {
                    navigate(`/admin/dashboard/movies/search/${inputValue}`);
                    setInputValue('');
                }
            };
            ref.addEventListener('keyup', enterKey);
            return () => {
                ref.removeEventListener('keyup', enterKey);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue]);

    const handleChangeCate = (e) => {
        setCurrPage(1);
        setCategory(e.target.value);
    };

    return (
        <div className={cs('index_list_container')}>
            <h3 className={cs('index_list_title')}>Danh sách phim</h3>
            <div className={cs('index_list_utils')}>
                <Link to="/admin/dashboard/movies/create" className={cs('index_list_add-btn')}>
                    + Thêm phim mới
                </Link>
                <div className={cs('index_list_search-box')}>
                    <input
                        ref={inputRef}
                        placeholder="Nhập tên phim..."
                        value={inputValue}
                        required
                        onChange={handleChange}
                    />
                    <Link
                        to={`/admin/dashboard/movies/search/${inputValue}`}
                        onClick={(e) => {
                            if (!inputValue) e.preventDefault();
                        }}
                    >
                        <button>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </button>
                    </Link>
                </div>
                {!month && !searchValue && (
                    <Form.Select className={cs('index_list_select-form')} onChange={(e) => handleChangeCate(e)}>
                        <option value="all">-- Tất Cả --</option>
                        <option value="movie">Phim Lẻ</option>
                        <option value="tv">Phim Dài Tập</option>
                    </Form.Select>
                )}
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : movies.length < 1 ? (
                <h4 style={{ textAlign: 'center', fontSize: '1.8rem', marginTop: '30px' }}>Không có kết quả nào</h4>
            ) : (
                <>
                    <Table striped bordered hover className={cs('index_list_table')}>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên phim</th>
                                <th>Danh mục</th>
                                <th>Ảnh</th>
                                <th>Điểm đánh giá IMDb</th>
                                <th>Lượt xem</th>
                                <th>Ngày phát hành</th>
                                <th>Bình luận</th>
                                <th>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movies.map((movie, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{movie.name}</td>
                                    <td>{movie.category === 'movie' ? 'Phim lẻ' : 'Phim dài tập'}</td>
                                    <td>
                                        <img
                                            className={cs('index_list_img')}
                                            src={Img.baseImg(movie.backdrop_path)}
                                            alt="Phim"
                                        />
                                    </td>
                                    <td>{movie.ibmPoints}</td>
                                    <td>{movie.viewed ?? 0}</td>
                                    <td>{new Date(movie.releaseDate).toLocaleDateString()}</td>
                                    <CountCmt movieId={movie._id} />
                                    <td>
                                        <Link
                                            to={`/admin/dashboard/movies/edit/${movie.slug}`}
                                            className={cs('index_list_action-link')}
                                        >
                                            Sửa
                                        </Link>
                                        <Button
                                            variant="danger"
                                            className={cs('index_list_action-btn')}
                                            onClick={() => handleDeleteMovie(movie._id)}
                                        >
                                            Xoá
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    {pages && !searchValue && (
                        <Panigation pages={pages} currPage={currPage} onSetCurrentPage={setCurrPage} />
                    )}
                </>
            )}
        </div>
    );
}

export default MoviesPage;
