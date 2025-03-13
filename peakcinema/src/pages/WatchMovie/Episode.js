import { Link, useLocation, useSearchParams } from 'react-router-dom';
import styles from './WatchMovie.module.scss';
import classNames from 'classnames/bind';

const cs = classNames.bind(styles);

function Episode({ movieDetail }) {
    const { pathname } = useLocation();
    const [searchParams] = useSearchParams();

    // Xác định mùa hiện tại từ URL hoặc mặc định là 1
    const currentSeason = parseInt(searchParams.get('s') || 1, 10);

    // Lấy số tập từ mùa hiện tại
    const selectedSeason = movieDetail.seasons.find(
        (season) => season.season_number === currentSeason
    );

    const episodeCount = selectedSeason ? selectedSeason.episode_count : 0;
    const episodes = Array(episodeCount).fill(null); // Tạo danh sách tập từ số tập

    return (
        <div className={cs('allEpisode')}>
            {episodes.map((_, index) => (
                <Link
                    to={`${pathname}?s=${currentSeason}&episode=${index + 1}`}
                    className={cs('episode')}
                    key={index}
                >
                    Tập {index + 1}
                </Link>
            ))}
        </div>
    );
}

export default Episode;
