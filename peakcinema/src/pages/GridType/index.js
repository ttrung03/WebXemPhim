/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './GridType.module.scss';
import classNames from 'classnames/bind';

import requestApi from '~/apiService';
import MovieItem from '~/layout/component/MovieItem';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Pagination from '~/layout/component/Panigation';

const cs = classNames.bind(styles);

function GridType() {
    const user = JSON.parse(localStorage.getItem('user'));
    const { category, type, name, id } = useParams();
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        async function getList() {
            let result = null;
            setLoading(true);

            try {
                switch (category) {
                    case 'movie':
                        result = await requestApi.getTypeMovie(type, { params: { page: currentPage } });
                        break;
                    case 'tv':
                        result = await requestApi.getTypeTV(type, { params: { page: currentPage } });
                        break;
                    case 'favorite':
                        result = await requestApi.getFavoritesList(user.id);
                        result.data = result.data.map((data) => data.movieId);
                        break;
                    case 'history':
                        result = await requestApi.getHistoryList(user.id);
                        // Sort by most recently watched
                        result.data = result.data
                            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                            .map((data) => ({
                                ...data.movieId,
                                watchedAt: new Date(data.updatedAt).toLocaleDateString('vi-VN')
                            }));
                        break;
                    case 'search':
                        result = await requestApi.getSearch({ params: { keyword: type, page: currentPage } });
                        break;
                    default:
                        result = await requestApi.getGenresMovie(id);
                }

                if (result && result.data) {
                    setLists(result.data);
                    setTotalPages(Math.ceil(result.total / itemsPerPage) || 1);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }
        getList();
    }, [category, type, id, user?.id, currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    return (
        <div className={cs('wrapper')}>
            {category !== 'search' ? (
                <h4 className={cs('title')}>
                    {type === 'upcoming'
                        ? 'Phim Mới'
                        : type === 'top_rated'
                        ? 'Đánh Giá Cao'
                        : type === 'popular'
                        ? 'Phổ Biến'
                        : type === 'favorite'
                        ? 'Danh sách yêu thích'
                        : type === 'history'
                        ? 'Xem gần đây'
                        : name}
                </h4>
            ) : (
                <h4 className={cs('title')}>{`Kết quả của '${type}'`}</h4>
            )}
            {loading ? (
                <div className={cs('wrapiconload')}>
                    <FontAwesomeIcon className={cs('iconLoading')} icon={faSpinner} />
                </div>
            ) : (
                <>
                    <div className={cs('movieList')}>
                        {lists.map((list, index) => (
                            <div key={index} className={cs('movieWrapper')}>
                                <MovieItem 
                                    category={list.category} 
                                    list={list} 
                                    className={cs('movieItem')} 
                                />
                                {category === 'history' && list.watchedAt && (
                                    <div className={cs('watchInfo')}>
                                        Đã xem: {list.watchedAt}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {lists.length === 0 && (
                        <div className={cs('noResults')}>
                            Không có kết quả nào
                        </div>
                    )}
                    {lists.length > 0 && totalPages > 1 && (
                        <div className={cs('pagination')}>
                            <Pagination 
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default GridType;
