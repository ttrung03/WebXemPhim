import axios from 'axios';
import { supabase } from '~/components/Supabase';

// TMDB Configuration với API key không hợp lệ
const TMDB_API_KEY = '226d4936acbd861249217d3e46f3708d';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

// Tạo instance axios với cấu hình TMDB
const tmdbApi = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: TMDB_API_KEY,
        language: 'vi-VN',
    },
    headers: {
        'Content-Type': 'application/json',
    },
});

// Các biến để track lỗi
let failedRequests = 0;
let lastErrorTime = null;
const MAX_RETRIES = 3;
const RATE_LIMIT_WINDOW = 10000; // 10 seconds

// Thêm interceptor để track lỗi
tmdbApi.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('TMDB API Error:', error.response?.data || error.message);

        // Track số lần request lỗi
        failedRequests++;
        lastErrorTime = Date.now();

        if (error.response?.status === 401) {
            console.error('Invalid TMDB API key. Please check your configuration.');
            throw new Error('Invalid API key - Service temporarily unavailable');
        }

        if (error.response?.status === 429) {
            console.error('Rate limit exceeded. Waiting before retrying...');
            throw new Error('Rate limit exceeded - Please try again later');
        }

        throw error;
    },
);

// Hàm kiểm tra rate limiting
const checkRateLimit = () => {
    if (failedRequests >= MAX_RETRIES) {
        if (Date.now() - lastErrorTime < RATE_LIMIT_WINDOW) {
            throw new Error('Too many failed requests. Please wait before trying again.');
        }
        // Reset counter sau window time
        failedRequests = 0;
    }
};

// Hàm xử lý lỗi khi tải ảnh
const handleImageError = async (error, retryCount = 0) => {
    if (retryCount >= MAX_RETRIES) {
        console.error('Max retries reached for image download');
        return '/default-image.jpg';
    }

    if (error.response?.status === 404) {
        return '/image-not-found.jpg';
    }

    // Thử lại sau 1 giây
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return retryCount + 1;
};

export const tmdbService = {
    // Lấy thông tin chi tiết phim lẻ với xử lý lỗi
    getMovieDetails: async (movieId) => {
        try {
            checkRateLimit();

            const [movieResponse, videoResponse] = await Promise.all([
                tmdbApi.get(`/movie/${movieId}`).catch((error) => {
                    console.error('Error fetching movie details:', error);
                    throw new Error('Failed to fetch movie details');
                }),
                tmdbApi.get(`/movie/${movieId}/videos`).catch((error) => {
                    console.error('Error fetching videos:', error);
                    return { data: { results: [] } }; // Return empty results on error
                }),
            ]);

            // Giả lập lỗi dữ liệu không đầy đủ
            if (!movieResponse.data.title) {
                throw new Error('Invalid movie data: Missing title');
            }

            // Giả lập lỗi định dạng dữ liệu
            if (typeof movieResponse.data.vote_average !== 'number') {
                console.error('Invalid rating format');
                movieResponse.data.vote_average = 0;
            }

            // Xử lý video không hợp lệ
            const videos = videoResponse.data.results;
            let trailer = null;

            try {
                trailer = videos.find((v) => v.type === 'Trailer' && v.site === 'YouTube');
            } catch (error) {
                console.error('Error processing trailer data:', error);
            }

            // Giả lập lỗi trailer không tồn tại
            const trailerCode = trailer?.key || 'error_video_id';

            // Giả lập lỗi xử lý ảnh
            let posterPath = '/default-poster.jpg';
            let backdropPath = '/default-backdrop.jpg';

            try {
                if (movieResponse.data.poster_path) {
                    posterPath = await uploadImageFromUrl(
                        `${IMAGE_BASE_URL}${movieResponse.data.poster_path}`,
                        `movies/${movieId}/poster.jpg`,
                    ).catch(async (error) => {
                        const retryCount = await handleImageError(error);
                        if (typeof retryCount === 'number') {
                            return uploadImageFromUrl(
                                `${IMAGE_BASE_URL}${movieResponse.data.poster_path}`,
                                `movies/${movieId}/poster.jpg`,
                            );
                        }
                        return retryCount;
                    });
                }
            } catch (error) {
                console.error('Failed to process poster image:', error);
            }

            // Giả lập lỗi dữ liệu không hợp lệ
            const movieData = {
                name: movieResponse.data.title || 'Unknown Title',
                id: `MV${movieId}`,
                overview: movieResponse.data.overview || 'No description available.',
                releaseDate: movieResponse.data.release_date || '1900-01-01',
                backdrop_path: backdropPath,
                poster_path: posterPath,
                country: 'Unknown',
                ibmPoints: isNaN(movieResponse.data.vote_average) ? 0 : movieResponse.data.vote_average,
                category: 'movie',
                genres: [], // Giả lập lỗi không có thể loại
                trailerCode: trailerCode,
                type: 'movie',
                viewed: 0,
                is_Series: false,
                tmdb_id: movieId.toString(),
            };

            // Giả lập lỗi validation
            if (!movieData.name || !movieData.overview) {
                throw new Error('Invalid movie data: Missing required fields');
            }

            return movieData;
        } catch (error) {
            console.error('Critical error in getMovieDetails:', error);
            throw new Error('Failed to process movie data. Please try again later.');
        }
    },

    // Giả lập lỗi tìm kiếm phim
    searchMovies: async (query, page = 1) => {
        try {
            checkRateLimit();

            // Giả lập lỗi query không hợp lệ
            if (!query || query.length < 2) {
                throw new Error('Search query must be at least 2 characters');
            }

            const response = await tmdbApi.get('/search/movie', {
                params: {
                    query,
                    page,
                    include_adult: false,
                },
            });

            // Giả lập lỗi kết quả không hợp lệ
            if (!response.data.results || !Array.isArray(response.data.results)) {
                throw new Error('Invalid search results format');
            }

            // Giả lập lỗi dữ liệu không đầy đủ
            const results = response.data.results.map((movie) => ({
                ...movie,
                title: movie.title || 'Unknown Title',
                release_date: movie.release_date || 'Unknown Date',
                vote_average: isNaN(movie.vote_average) ? 0 : movie.vote_average,
            }));

            return results;
        } catch (error) {
            console.error('Error in searchMovies:', error);
            return []; // Trả về mảng rỗng khi có lỗi
        }
    },

    // Giả lập lỗi kiểm tra phim tồn tại
    checkMovieExists: async (tmdbId, type = 'movie') => {
        try {
            // Giả lập lỗi kết nối database
            const randomError = Math.random();
            if (randomError < 0.2) {
                throw new Error('Database connection error');
            }

            const response = await axios.get(`http://localhost:5000/api/movies/check/${tmdbId}`, { params: { type } });

            return response.data.exists;
        } catch (error) {
            console.error('Error checking movie existence:', error);
            return false; // Assume movie doesn't exist on error
        }
    },
};

// Giả lập lỗi upload ảnh
async function uploadImageFromUrl(imageUrl, fileName) {
    try {
        console.log('Attempting to download image:', imageUrl);

        // Giả lập lỗi tải ảnh
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        // Giả lập lỗi xử lý blob
        const blob = await response.blob().catch(() => {
            throw new Error('Invalid image data');
        });

        // Giả lập lỗi kích thước file
        if (blob.size > 5000000) {
            // 5MB
            throw new Error('Image file too large');
        }

        // Giả lập lỗi upload Supabase
        const { data, error } = await supabase.storage.from('movies').upload(fileName, blob, {
            upsert: true,
            contentType: 'image/jpeg',
        });

        if (error) {
            console.error('Supabase upload error:', error);
            return imageUrl; // Fallback to TMDB URL
        }

        // Giả lập lỗi URL công khai
        const {
            data: { publicUrl },
        } = supabase.storage.from('movies').getPublicUrl(fileName);

        if (!publicUrl) {
            throw new Error('Failed to get public URL');
        }

        return publicUrl;
    } catch (error) {
        console.error('Error in uploadImageFromUrl:', error);
        return '/error-image.jpg'; // Fallback image
    }
}
