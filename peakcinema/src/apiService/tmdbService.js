import axios from 'axios';
import { supabase } from '~/components/Supabase';

// TMDB Configuration
const TMDB_API_KEY = "27b0380582a2003be9ed58d1becbc4f4";
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

// Tạo instance axios với cấu hình TMDB
const tmdbApi = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: TMDB_API_KEY,
        language: 'vi-VN'
    },
    headers: {
        'Content-Type': 'application/json'
    }
});

// Thêm interceptor để xử lý lỗi
tmdbApi.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('TMDB API Error:', error.response?.data || error.message);
        if (error.response?.status === 401) {
            console.error('Invalid TMDB API key. Please check your configuration.');
        }
        throw error;
    }
);

// Tạo slug từ tên phim
const createSlug = (name) => {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .trim();
};

// Mapping thể loại TMDB sang ID của hệ thống
const genreMapping = {
    // Phim lẻ
    28: '64c7dceebd0a7fb9fcd17b92',    // Action
    12: '64c7dceebd0a7fb9fcd17b93',    // Adventure
    16: '64c7dceebd0a7fb9fcd17b94',    // Animation
    35: '64c7dceebd0a7fb9fcd17b95',    // Comedy
    80: '64c7dceebd0a7fb9fcd17b96',    // Crime
    99: '64c7dceebd0a7fb9fcd17b97',    // Documentary
    18: '64c7dceebd0a7fb9fcd17b98',    // Drama
    10751: '64c7dceebd0a7fb9fcd17b99', // Family
    14: '64c7dceebd0a7fb9fcd17b9a',    // Fantasy
    36: '64c7dceebd0a7fb9fcd17b9b',    // History
    27: '64c7dceebd0a7fb9fcd17b9c',    // Horror
    10402: '64c7dceebd0a7fb9fcd17b9d', // Music
    9648: '64c7dceebd0a7fb9fcd17b9e',  // Mystery
    10749: '64c7dceebd0a7fb9fcd17b9f', // Romance
    878: '64c7dceebd0a7fb9fcd17ba0',   // Science Fiction
    10770: '64c7dceebd0a7fb9fcd17ba1', // TV Movie
    53: '64c7dceebd0a7fb9fcd17ba2',    // Thriller
    10752: '64c7dceebd0a7fb9fcd17ba3', // War
    37: '64c7dceebd0a7fb9fcd17ba4',    // Western

    // Thể loại phim dài tập
    10759: '64c7dceebd0a7fb9fcd17b92', // Action & Adventure -> Action
    10765: '64c7dceebd0a7fb9fcd17ba0', // Sci-Fi & Fantasy -> Science Fiction
    10768: '64c7dceebd0a7fb9fcd17ba3', // War & Politics -> War
    10766: '64c7dceebd0a7fb9fcd17b98', // Soap -> Drama
    10767: '64c7dceebd0a7fb9fcd17b97', // Talk -> Documentary
    10762: '64c7dceebd0a7fb9fcd17b99', // Kids -> Family
    10763: '64c7dceebd0a7fb9fcd17b97', // News -> Documentary
    10764: '64c7dceebd0a7fb9fcd17b97', // Reality -> Documentary
};

// Hàm ánh xạ thể loại
const mapGenres = (tmdbGenres) => {
    const mappedGenres = tmdbGenres
        .map(genre => genreMapping[genre.id])
        .filter(id => id !== undefined);
    
    // Nếu không có thể loại nào được ánh xạ, thêm thể loại mặc định
    if (mappedGenres.length === 0) {
        return ['64c7dceebd0a7fb9fcd17b92']; // Action là mặc định
    }
    
    // Loại bỏ các thể loại trùng lặp
    return [...new Set(mappedGenres)];
};

export const tmdbService = {
    // Lấy danh sách phim phổ biến
    getPopularMovies: async (page = 1) => {
        try {
            const response = await tmdbApi.get('/movie/popular', {
                params: { page }
            });
            return response.data.results;
        } catch (error) {
            console.error('Error fetching popular movies:', error);
            throw error;
        }
    },

    // Lấy danh sách phim dài tập phổ biến
    getPopularTVShows: async (page = 1) => {
        try {
            const response = await tmdbApi.get('/tv/popular', {
                params: { page }
            });
            return response.data.results;
        } catch (error) {
            console.error('Error fetching popular TV shows:', error);
            throw error;
        }
    },

    // Lấy thông tin chi tiết phim lẻ
    getMovieDetails: async (movieId) => {
        try {
            const [movieResponse, videoResponse] = await Promise.all([
                tmdbApi.get(`/movie/${movieId}`),
                tmdbApi.get(`/movie/${movieId}/videos`)
            ]);
            
            const movie = movieResponse.data;
            const videos = videoResponse.data.results;
            
            // Lấy trailer với logic ưu tiên mới
            const trailerCode = await tmdbService.getVideos(movieId, 'movie');
            
            // Nếu không có trailer, sử dụng trailer mặc định
            if (!trailerCode) {
                console.warn(`No trailer found for movie ${movieId}, using default trailer`);
            }
            
            const slug = createSlug(movie.title);
            const mappedGenres = mapGenres(movie.genres || []);
            
            // Upload và lấy URL ảnh từ Supabase
            const { backdropPath, posterPath } = await handleMovieImages(movie, movieId);
            
            // Chuẩn bị dữ liệu phim cho API
            const movieData = {
                name: movie.title || '',
                id: `MV${movieId}`,
                slug: slug || createSlug(movie.title || 'untitled'),
                overview: movie.overview || 'Chưa có mô tả cho phim này.',
                releaseDate: movie.release_date || '',
                backdrop_path: backdropPath,
                poster_path: posterPath,
                country: movie.production_countries[0]?.name || 'Unknown',
                ibmPoints: movie.vote_average || 0,
                category: 'movie',
                genres: mappedGenres.length > 0 ? mappedGenres : ['64c7dceebd0a7fb9fcd17b92'],
                trailerCode: trailerCode || 'dQw4w9WgXcQ', // Fallback trailer
                type: 'movie',
                viewed: 0,
                is_Series: false,
                is_TopList: false,
                is_Top10: false,
                tmdb_id: movieId.toString()
            };

            return movieData;
        } catch (error) {
            console.error('Error fetching movie details:', error);
            throw error;
        }
    },

    // Lấy thông tin chi tiết phim dài tập
    getTVShowDetails: async (tvId) => {
        try {
            const [showResponse, videoResponse] = await Promise.all([
                tmdbApi.get(`/tv/${tvId}`),
                tmdbApi.get(`/tv/${tvId}/videos`)
            ]);
            
            const show = showResponse.data;
            const videos = videoResponse.data.results;
            
            // Lấy trailer với logic ưu tiên mới
            const trailerCode = await tmdbService.getVideos(tvId, 'tv');
            
            // Nếu không có trailer, sử dụng trailer mặc định
            if (!trailerCode) {
                console.warn(`No trailer found for TV show ${tvId}, using default trailer`);
            }
            
            const slug = createSlug(show.name);
            const mappedGenres = mapGenres(show.genres || []);
            
            // Upload và lấy URL ảnh từ Supabase
            const { backdropPath, posterPath } = await handleMovieImages(show, tvId);
            
            // Chuẩn bị dữ liệu phim cho API
            const showData = {
                name: show.name || '',
                id: `TV${tvId}`,
                slug: slug || createSlug(show.name || 'untitled'),
                overview: show.overview || 'Chưa có mô tả cho phim này.',
                releaseDate: show.first_air_date || '',
                backdrop_path: backdropPath,
                poster_path: posterPath,
                country: show.production_countries[0]?.name || 'Unknown',
                ibmPoints: show.vote_average || 0,
                category: 'tv',
                genres: mappedGenres.length > 0 ? mappedGenres : ['64c7dceebd0a7fb9fcd17b92'],
                trailerCode: trailerCode || 'dQw4w9WgXcQ', // Fallback trailer
                type: 'tv',
                seasons: show.number_of_seasons || 1,
                episodes: show.number_of_episodes || 1,
                episodeDuration: show.episode_run_time[0] || 30,
                status: show.status === 'Ended' ? 'completed' : 'ongoing',
                viewed: 0,
                is_Series: true,
                is_TopList: false,
                is_Top10: false,
                tmdb_id: tvId.toString()
            };

            return showData;
        } catch (error) {
            console.error('Error fetching TV show details:', error);
            throw error;
        }
    },

    // Lấy trailer
    getVideos: async (id, type = 'movie') => {
        try {
            const response = await tmdbApi.get(`/${type}/${id}/videos`);
            const videos = response.data.results;
            
            // Ưu tiên trailer chính thức bằng tiếng Việt
            let trailer = videos.find(v => 
                v.type === 'Trailer' && 
                v.iso_639_1 === 'vi' && 
                v.official === true
            );
            
            // Nếu không có, tìm trailer chính thức tiếng Anh
            if (!trailer) {
                trailer = videos.find(v => 
                    v.type === 'Trailer' && 
                    v.iso_639_1 === 'en' && 
                    v.official === true
                );
            }
            
            // Nếu không có trailer chính thức, tìm trailer bất kỳ
            if (!trailer) {
                trailer = videos.find(v => v.type === 'Trailer');
            }
            
            // Nếu vẫn không có, tìm video có độ phân giải cao nhất
            if (!trailer && videos.length > 0) {
                trailer = videos.reduce((prev, current) => {
                    const prevSize = prev.size || 0;
                    const currentSize = current.size || 0;
                    return currentSize > prevSize ? current : prev;
                });
            }
            
            return trailer ? trailer.key : null;
        } catch (error) {
            console.error('Error fetching videos:', error);
            return null;
        }
    },

    // Tìm kiếm phim
    searchMovies: async (query, page = 1) => {
        try {
            console.log('Searching movies with query:', query);
            const response = await tmdbApi.get('/search/movie', {
                params: { 
                    query,
                    page,
                    include_adult: false
                }
            });
            
            if (!response.data.results || response.data.results.length === 0) {
                console.log('No results found for query:', query);
                return [];
            }
            
            console.log(`Found ${response.data.results.length} results`);
            return response.data.results;
        } catch (error) {
            console.error('Error searching movies:', error);
            if (error.response?.status === 401) {
                console.error('Invalid API key - please check configuration');
            }
            throw error;
        }
    },

    // Tìm kiếm phim dài tập
    searchTVShows: async (query, page = 1) => {
        try {
            console.log('Searching TV shows with query:', query);
            const response = await tmdbApi.get('/search/tv', {
                params: { 
                    query,
                    page,
                    include_adult: false
                }
            });
            
            if (!response.data.results || response.data.results.length === 0) {
                console.log('No results found for query:', query);
                return [];
            }
            
            console.log(`Found ${response.data.results.length} results`);
            return response.data.results;
        } catch (error) {
            console.error('Error searching TV shows:', error);
            if (error.response?.status === 401) {
                console.error('Invalid API key - please check configuration');
            }
            throw error;
        }
    },

    // Lấy thông tin chi tiết về season của phim dài tập
    getTVShowSeasonDetails: async (tvId, seasonNumber) => {
        try {
            const response = await tmdbApi.get(`/tv/${tvId}/season/${seasonNumber}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching season details:', error);
            throw error;
        }
    },

    // Lấy danh sách diễn viên
    getCredits: async (id, type = 'movie') => {
        try {
            const response = await tmdbApi.get(`/${type}/${id}/credits`);
            return response.data.cast.slice(0, 10); // Lấy 10 diễn viên chính
        } catch (error) {
            console.error('Error fetching credits:', error);
            throw error;
        }
    },

    // Lấy phim tương tự
    getSimilar: async (id, type = 'movie') => {
        try {
            const response = await tmdbApi.get(`/${type}/${id}/similar`);
            return response.data.results.slice(0, 5); // Lấy 5 phim tương tự
        } catch (error) {
            console.error('Error fetching similar movies:', error);
            throw error;
        }
    },

    // Lấy đánh giá và bình luận
    getReviews: async (id, type = 'movie') => {
        try {
            const response = await tmdbApi.get(`/${type}/${id}/reviews`);
            return response.data.results;
        } catch (error) {
            console.error('Error fetching reviews:', error);
            throw error;
        }
    },

    // Tự động cập nhật trạng thái phim dài tập
    updateTVShowStatus: async (tvId) => {
        try {
            const details = await tmdbService.getTVShowDetails(tvId);
            const lastAirDate = new Date(details.last_air_date);
            const now = new Date();
            
            let status;
            if (!details.last_air_date) {
                status = 'upcoming';
            } else if (details.status === 'Ended' || details.status === 'Canceled') {
                status = 'completed';
            } else if (lastAirDate < now) {
                status = 'ongoing';
            } else {
                status = 'upcoming';
            }
            
            return status;
        } catch (error) {
            console.error('Error updating TV show status:', error);
            throw error;
        }
    },

    // Lấy keywords/tags của phim
    getKeywords: async (id, type = 'movie') => {
        try {
            const response = await tmdbApi.get(`/${type}/${id}/keywords`);
            return response.data.keywords || response.data.results;
        } catch (error) {
            console.error('Error fetching keywords:', error);
            throw error;
        }
    },

    // Kiểm tra xem phim đã tồn tại trong database chưa
    checkMovieExists: async (tmdbId, type = 'movie') => {
        try {
            // Sử dụng BASE_URL của backend thay vì relative path
            const response = await axios.get(`http://localhost:5000/api/movies/check/${tmdbId}`, {
                params: { type }
            });
            return response.data.exists;
        } catch (error) {
            if (error.response?.status === 500) {
                console.error('Server error when checking movie:', error.response.data);
            } else {
                console.error('Error checking movie existence:', error);
            }
            return false;
        }
    }
};


 