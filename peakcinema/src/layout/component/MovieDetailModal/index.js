import { useEffect } from 'react';
import styles from './MovieDetailModal.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTimes, faCalendar, faEye } from '@fortawesome/free-solid-svg-icons';
import { Img } from '~/apiService/instance';

const cs = classNames.bind(styles);

function MovieDetailModal({ movie, genres, onClose }) {
    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    if (!movie) return null;

    return (
        <div className={cs('modal-overlay')} onClick={onClose}>
            <div className={cs('modal-content')} onClick={e => e.stopPropagation()}>
                <button className={cs('close-button')} onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                
                <div className={cs('modal-header')}>
                    <img 
                        src={Img.posterImg(movie.poster_path || movie.backdrop_path)} 
                        alt={movie.name}
                        className={cs('movie-poster')}
                    />
                    <div className={cs('header-info')}>
                        <h2 className={cs('movie-title')}>{movie.name}</h2>
                        <div className={cs('movie-meta')}>
                            <div className={cs('rating')}>
                                <FontAwesomeIcon icon={faStar} className={cs('icon')} />
                                <span>{movie.ibmPoints}</span>
                            </div>
                            <div className={cs('release-date')}>
                                <FontAwesomeIcon icon={faCalendar} className={cs('icon')} />
                                <span>{new Date(movie.releaseDate).getFullYear()}</span>
                            </div>
                            <div className={cs('views')}>
                                <FontAwesomeIcon icon={faEye} className={cs('icon')} />
                                <span>{movie.viewed || 0} lượt xem</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={cs('modal-body')}>
                    <div className={cs('genres')}>
                        <h3>Thể loại:</h3>
                        <div className={cs('genres-list')}>
                            {genres.map((genre, index) => (
                                <span key={index} className={cs('genre-item')}>
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className={cs('overview')}>
                        <h3>Tóm tắt:</h3>
                        <p>{movie.overview}</p>
                    </div>

                    {movie.category === 'tv' && (
                        <div className={cs('seasons')}>
                            <h3>Số tập:</h3>
                            <p>{movie.seasons} tập</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MovieDetailModal; 