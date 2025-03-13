/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/iframe-has-title */
import styles from './WatchMovie.module.scss';
import classNames from 'classnames/bind';
import { useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
<<<<<<< HEAD
import { faStar, faInfoCircle, faComment } from '@fortawesome/free-solid-svg-icons';
=======
import { faStar } from '@fortawesome/free-solid-svg-icons';
>>>>>>> 3b7c1e6 (the firt commit)

import requestApi from '~/apiService';
//import Season from './Season';
import Episode from './Episode';
import { Img } from '~/apiService/instance';
import SimilarMovie from '~/layout/component/SimilarMovie';
import { addHistoryMovie } from '~/apiService/user';
import { getMulti } from '~/apiService/genres';
import Comment from '~/layout/component/Comments';
import { updateView } from '~/apiService/movie';
import Skeleton from 'react-loading-skeleton';
<<<<<<< HEAD
import MovieDetailModal from '~/layout/component/MovieDetailModal';
=======
>>>>>>> 3b7c1e6 (the firt commit)

const cs = classNames.bind(styles);

function WatchMovie() {
    const user = JSON.parse(localStorage.getItem('user'));
    const { category, id, slug } = useParams();
    const [searchParams] = useSearchParams();
    const [genres, setGenres] = useState([]);
<<<<<<< HEAD
    const [movieDetail, setMovieDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Xây dựng URL video
    const getVideoUrl = () => {
        // Lấy ID thuần từ movieDetail hoặc URL
        const rawId = id.replace('MV', '').replace('TV', '');
        
        // Xây dựng URL dựa trên loại phim
        if (category === 'movie') {
            return `https://vidsrc.to/embed/movie/${rawId}`;
        } else {
            let url = `https://vidsrc.to/embed/tv/${rawId}`;
            const season = searchParams.get('season') || movieDetail?.seasons || 1;
            const episode = searchParams.get('episode') || 1;
            url += `/${season}/${episode}`;
            return url;
        }
    };
=======
    const [movieDetail, setMovieDetail] = useState([]);
    const [loading, setLoading] = useState(true);


    let src = `https://www.2embed.cc/embed/${id}`;


    
    //let src = `https://www.2embed.cc/embed/tmdb${category}?id=${id}`;
    //let src = `https://youtube.com/embed/${category}?id=${id}`;
    //let src =`https://www.2embed.cc/embed/tmdb/movie?id=${id ?? 1}`
    //let src = 'https://2anime.xyz/embed/${category}?id=${id}';
    //let src = 'https://animevietsub.cx/${category}?id=${id}';
    //let src = `https://animevietsub.cx/embed/${category}?id=${id}`;



    if (category === 'tv') {
        src += `&s=${movieDetail?.seasons ?? 1}&e=${searchParams.get('episode') ?? 1}`;
    }
>>>>>>> 3b7c1e6 (the firt commit)

    useEffect(() => {
        async function getDeTailMovie() {
            try {
                const result = await requestApi.getDetails(slug);
<<<<<<< HEAD
                console.log("Movie details:", result.data); // Debug log
                if (result.data) {
                    const dataGenres = await getMulti(result.data.slug);
                    setGenres(dataGenres.data);
                    setMovieDetail(result.data);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching movie details:", error);
                setLoading(false);
            }
        }
        getDeTailMovie();
    }, [slug]);

    // Cập nhật lượt xem
=======
                const dataGenres = await getMulti(result.data.slug);
                setGenres(dataGenres.data);
                setMovieDetail(result.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }
        getDeTailMovie();
    }, []);

>>>>>>> 3b7c1e6 (the firt commit)
    useEffect(() => {
        const handleAddView = async () => {
            try {
                await updateView(slug);
            } catch (error) {
<<<<<<< HEAD
                console.error("Error updating view count:", error);
=======
                console.log(error);
>>>>>>> 3b7c1e6 (the firt commit)
            }
        };

        const index = setTimeout(() => {
            handleAddView();
        }, 10000);

        return () => clearTimeout(index);
<<<<<<< HEAD
    }, [slug]);

    // Thêm vào lịch sử xem
    useEffect(() => {
        if (user && movieDetail?._id) {
=======
    }, []);

    useEffect(() => {
        if (user && movieDetail) {
>>>>>>> 3b7c1e6 (the firt commit)
            const handleAddHistory = async () => {
                try {
                    await addHistoryMovie(movieDetail._id, user.id);
                } catch (error) {
<<<<<<< HEAD
                    console.error("Error adding to history:", error);
=======
                    console.log(error);
>>>>>>> 3b7c1e6 (the firt commit)
                }
            };

            const index = setTimeout(() => {
                handleAddHistory();
            }, 10000);

            return () => clearTimeout(index);
        }
<<<<<<< HEAD
    }, [movieDetail, user]);

    // Lấy URL video
    const videoUrl = !loading ? getVideoUrl() : '';

    return (
        <div className={cs('wrapper')}>
            {loading ? (
                <div className={cs('video-loading')}>
                    <Skeleton height={550} />
                </div>
            ) : !videoUrl ? (
                <div className={cs('video-error')}>
                    <p>Không thể tải video. Vui lòng thử lại sau.</p>
                    <p className={cs('debug-info')}>Movie ID: {id}</p>
                </div>
            ) : (
                <iframe
                    className={cs('videofilm')}
                    src={videoUrl}
                    width="100%"
                    height="550px"
                    allowFullScreen
                    allow="encrypted-media"
                    referrerPolicy="origin"
                ></iframe>
            )}

            {/* Rest of the component */}
            {movieDetail && (
                <>
                    <div className={cs('InforDetail')}>
                        <img
                            src={Img.posterImg(movieDetail.poster_path || movieDetail.backdrop_path)}
                            className={cs('poster')}
                            alt={movieDetail.name}
                        />
                        <div className={cs('content')}>
                            <div className={cs('title-wrapper')}>
                                <h2 className={cs('title')}>{movieDetail.name}</h2>
                                <button 
                                    className={cs('info-button')} 
                                    onClick={() => setShowModal(true)}
                                    title="Xem chi tiết"
                                >
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                </button>
                            </div>
                            <div className={cs('genres')}>
                                {genres.map((genre, index) => (
                                    <span className={cs('genres-item')} key={index}>
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                            <div className={cs('rate')}>
                                <FontAwesomeIcon className={cs('icon')} icon={faStar} />
                                <span>{movieDetail.ibmPoints}</span>
                            </div>
                            <div className={cs('summary')}>
                                <h4 className={cs('summary-title')}>Tóm tắt</h4>
                                <p className={cs('overview')}>{movieDetail.overview}</p>
                            </div>
                        </div>
                    </div>

                    {category === 'tv' && (
                        <>
=======
    }, [movieDetail, slug]);

    return (
        <div className={cs('wrapper')}>
            <iframe
                className={cs('videofilm')}
                src={src}
                width="100%"
                height="550px"
                allowFullScreen
                // frameBorder="0"
            ></iframe>
            {movieDetail && (
                <>
                    <div className={cs('InforDetail')}>
                        {loading ? (
                            <Skeleton className={cs('poster')} style={{ width: '200px' }} />
                        ) : (
                            <img
                                src={Img.posterImg(movieDetail.poster_path || movieDetail.backdrop_path)}
                                className={cs('poster')}
                                alt=""
                            ></img>
                        )}
                        {loading ? (
                            <div className={cs('content')}>
                                <Skeleton className={cs('title')} />
                                <div className={cs('genres')}>
                                    <Skeleton className={cs('genres-item')}   style={{ width: '100px'}}/>
                                </div>
                                <div className={cs('rate')}>
                                    <FontAwesomeIcon className={cs('icon')} icon={faStar} />
                                    {movieDetail.ibmPoints}
                                </div>
                                <div className={cs('summary')}>
                                    <h4>Tóm tắt</h4>
                                    <Skeleton className={cs('overview')} style={{ width: '900px',height:'70px' }} />
                                </div>
                            </div>
                        ) : (
                            <div className={cs('content')}>
                                <h2 className={cs('title')}>{movieDetail.name} </h2>
                                <div className={cs('genres')}>
                                    {genres.map((genre, index) => {
                                        return (
                                            <span className={cs('genres-item')} key={index}>
                                                {genre.name}
                                            </span>
                                        );
                                    })}
                                </div>
                                <div className={cs('rate')}>
                                    <FontAwesomeIcon className={cs('icon')} icon={faStar} />
                                    {movieDetail.ibmPoints}
                                </div>
                                <div className={cs('summary')}>
                                    <h4>Tóm tắt</h4>
                                    <p className={cs('overview')}>{movieDetail.overview}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    {category === 'tv' && (
                        <>
                            {/* <h4 className={cs('titleTv')}>Season</h4>
                            <div className={cs('allSeaon')}>
                                {movieDetail.seasons
                                    .filter((season) => season.season_number !== 0 && season.episode_count > 0)
                                    .map((season, index) => (
                                        <Season key={index} season={season} />
                                    ))}
                            </div> */}
>>>>>>> 3b7c1e6 (the firt commit)
                            <h4 className={cs('titleTv')}>Tập</h4>
                            <Episode movieDetail={movieDetail} />
                        </>
                    )}

                    <div className={cs('Similar')}>
                        <h4 className={cs('titleOverview')}>Đề xuất</h4>
                        <SimilarMovie category={movieDetail.category} slug={movieDetail.slug} />
                    </div>

<<<<<<< HEAD
                    <div className={cs('comments-section')} id="comments">
                        <div className={cs('comments-header')}>
                            <FontAwesomeIcon icon={faComment} className={cs('comment-icon')} />
                            <h4 className={cs('comments-title')}>Bình luận</h4>
                        </div>
                        <Comment movieId={movieDetail._id} />
                    </div>

                    {showModal && (
                        <MovieDetailModal 
                            movie={movieDetail}
                            genres={genres}
                            onClose={() => setShowModal(false)}
                        />
                    )}
=======
                    <div>
                        <Comment MovieId={movieDetail._id} />
                    </div>
>>>>>>> 3b7c1e6 (the firt commit)
                </>
            )}
        </div>
    );
}

export default WatchMovie;
