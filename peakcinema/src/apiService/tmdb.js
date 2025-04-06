import axios from 'axios';

const tmdbApi = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_TMDB_API_KEY}`
    }
});

export const tmdb = {
    // Lấy danh sách phim mới
    getLatestMovies: (page = 1) => {
        return tmdbApi.get(`/movie/now_playing?page=${page}`);
    },

    // Lấy danh sách phim dài tập mới
    getLatestTVShows: (page = 1) => {
        return tmdbApi.get(`/tv/on_the_air?page=${page}`);
    },

    // Lấy chi tiết phim
    getMovieDetails: (movieId) => {
        return tmdbApi.get(`/movie/${movieId}`);
    },

    // Lấy chi tiết phim dài tập
    getTVShowDetails: (tvId) => {
        return tmdbApi.get(`/tv/${tvId}`);
    },

    // Lấy danh sách tập phim
    getTVShowEpisodes: (tvId, seasonNumber) => {
        return tmdbApi.get(`/tv/${tvId}/season/${seasonNumber}`);
    },

    // Lấy danh sách phim theo thể loại
    getMoviesByGenre: (genreId, page = 1) => {
        return tmdbApi.get(`/discover/movie?with_genres=${genreId}&page=${page}`);
    },

    // Lấy danh sách phim dài tập theo thể loại
    getTVShowsByGenre: (genreId, page = 1) => {
        return tmdbApi.get(`/discover/tv?with_genres=${genreId}&page=${page}`);
    },

    // Tìm kiếm phim
    searchMovies: (query, page = 1) => {
        return tmdbApi.get(`/search/movie?query=${query}&page=${page}`);
    },

    // Tìm kiếm phim dài tập
    searchTVShows: (query, page = 1) => {
        return tmdbApi.get(`/search/tv?query=${query}&page=${page}`);
    },

    // Lấy danh sách thể loại
    getGenres: () => {
        return tmdbApi.get('/genre/movie/list');
    },

    // Lấy danh sách thể loại phim dài tập
    getTVGenres: () => {
        return tmdbApi.get('/genre/tv/list');
    }
};

export default tmdb; 