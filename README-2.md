# Kỹ Thuật Crawl Data Film - PeakCinema

## 1. Cấu Trúc API và Endpoints

### 1.1 TMDB API
- Base URL: `https://api.themoviedb.org/3`
- Các endpoints chính:
  - `/movie/{movie_id}` - Lấy thông tin chi tiết phim
  - `/tv/{tv_id}` - Lấy thông tin chi tiết series
  - `/search/movie` - Tìm kiếm phim
  - `/search/tv` - Tìm kiếm series
  - `/movie/popular` - Danh sách phim phổ biến
  - `/tv/popular` - Danh sách series phổ biến

### 1.2 Cấu Trúc URL Hình Ảnh
- Base URL: `https://image.tmdb.org/t/p/`
- Các kích thước:
  - `/original` - Kích thước gốc
  - `/w500` - Chiều rộng 500px
  - `/w300` - Chiều rộng 300px

## 2. Quy Trình Crawl Data

### 2.1 Lấy Thông Tin Phim
```javascript
async function getMovieDetails(id) {
    const response = await tmdbApi.get(`/movie/${id}`);
    return {
        name: response.data.title,
        original_name: response.data.original_title,
        overview: response.data.overview,
        poster_path: response.data.poster_path,
        backdrop_path: response.data.backdrop_path,
        release_date: response.data.release_date,
        vote_average: response.data.vote_average,
        genres: response.data.genres
    };
}
```

### 2.2 Lấy Thông Tin Series
```javascript
async function getTVShowDetails(id) {
    const response = await tmdbApi.get(`/tv/${id}`);
    return {
        name: response.data.name,
        original_name: response.data.original_name,
        overview: response.data.overview,
        poster_path: response.data.poster_path,
        backdrop_path: response.data.backdrop_path,
        first_air_date: response.data.first_air_date,
        vote_average: response.data.vote_average,
        genres: response.data.genres,
        seasons: response.data.number_of_seasons,
        episodes: response.data.number_of_episodes
    };
}
```

## 3. Xử Lý Hình Ảnh

### 3.1 Cấu Trúc URL Hình Ảnh
```javascript
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';
const posterUrl = `${IMAGE_BASE_URL}${poster_path}`;
const backdropUrl = `${IMAGE_BASE_URL}${backdrop_path}`;
```

### 3.2 Xử Lý Lỗi Hình Ảnh
```javascript
function getImageUrl(path) {
    if (!path) return DEFAULT_IMAGE_URL;
    return `${IMAGE_BASE_URL}${path}`;
}
```

## 4. Lưu Trữ Dữ Liệu

### 4.1 Cấu Trúc Database
```sql
CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    original_name VARCHAR(255),
    overview TEXT,
    poster_path TEXT,
    backdrop_path TEXT,
    release_date DATE,
    vote_average FLOAT,
    tmdb_id INTEGER,
    category VARCHAR(50)
);
```

### 4.2 Lưu Thông Tin Phim
```javascript
async function saveMovie(movieData) {
    const query = `
        INSERT INTO movies (
            name, original_name, overview,
            poster_path, backdrop_path, release_date,
            vote_average, tmdb_id, category
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
    await pool.query(query, [
        movieData.name,
        movieData.original_name,
        movieData.overview,
        movieData.poster_path,
        movieData.backdrop_path,
        movieData.release_date,
        movieData.vote_average,
        movieData.id,
        'movie'
    ]);
}
```

## 5. Xử Lý Video

### 5.1 Cấu Trúc URL Video
```javascript
// Cho phim
const movieUrl = `https://vidsrc.to/embed/movie/${tmdb_id}`;

// Cho series
const tvUrl = `https://vidsrc.to/embed/tv/${tmdb_id}/${season}/${episode}`;
```

### 5.2 Các Domain Backup
- vidsrc.to
- 2embed.org
- autoembed.to

## 6. Xử Lý Lỗi và Retry

### 6.1 Retry Logic
```javascript
async function fetchWithRetry(url, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url);
            if (response.ok) return response;
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
}
```

### 6.2 Error Handling
```javascript
try {
    const movieData = await getMovieDetails(id);
    await saveMovie(movieData);
} catch (error) {
    console.error(`Error processing movie ${id}:`, error);
    // Log error to monitoring system
}
```

## 7. Rate Limiting và Tối Ưu

### 7.1 Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 100 // giới hạn mỗi IP
});
```

### 7.2 Caching
```javascript
const cache = new Map();

function getCachedData(key) {
    if (cache.has(key)) {
        const { data, timestamp } = cache.get(key);
        if (Date.now() - timestamp < 3600000) { // 1 giờ
            return data;
        }
    }
    return null;
}
```

## 8. Monitoring và Logging

### 8.1 Logging
```javascript
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});
```

### 8.2 Monitoring Metrics
```javascript
const metrics = {
    totalMovies: 0,
    failedRequests: 0,
    successRate: 0
};

function updateMetrics(success) {
    metrics.totalMovies++;
    if (!success) metrics.failedRequests++;
    metrics.successRate = ((metrics.totalMovies - metrics.failedRequests) / metrics.totalMovies) * 100;
}
``` 

Bổ sung thêm:

Giải thích chi tiết về kỹ thuật crawl data film trong dự án PeakCinema:

    Thu Thập Dữ Liệu từ TMDB API
    Sử dụng API của TMDB (The Movie Database) với base URL: https://api.themoviedb.org/3
    Có thể lấy được nhiều loại thông tin:
    Chi tiết phim (/movie/{id})
    Chi tiết series (/tv/{id})
    Danh sách phim phổ biến
    Tìm kiếm phim/series
    Xử Lý Hình Ảnh
    Hình ảnh được lấy từ TMDB với nhiều kích thước:
    Original: kích thước gốc
    w500: chiều rộng 500px
    w300: chiều rộng 300px
    Có xử lý lỗi với hình ảnh mặc định khi không tìm thấy
    Lưu Trữ Dữ Liệu
    Sử dụng database SQL với bảng movies chứa các thông tin:
    Tên phim (name, original_name)
    Mô tả (overview)
    Đường dẫn hình ảnh (poster_path, backdrop_path)
    Ngày phát hành (release_date)
    Điểm đánh giá (vote_average)
    ID từ TMDB (tmdb_id)
    Loại (category)
    Xử Lý Video
    Sử dụng nhiều domain để phát video:
    vidsrc.to (chính)
    2embed.org (backup)
    autoembed.to (backup)
    URL video được tạo dựa trên TMDB ID
    Xử Lý Lỗi và Tối Ưu
    Có cơ chế retry khi request thất bại (tối đa 3 lần)
    Rate limiting để tránh quá tải:
    Giới hạn 100 request/15 phút/IP
    Caching data trong 1 giờ để giảm tải server
    Monitoring và Logging
    Sử dụng Winston để log:
    Log lỗi riêng (error.log)
    Log tổng hợp (combined.log)
    Theo dõi metrics:
    Tổng số phim đã crawl
    Số request thất bại
    Tỷ lệ thành công
    Ưu Điểm của Kỹ Thuật
    Đa dạng nguồn dữ liệu (phim, series)
    Xử lý lỗi tốt với retry và fallback
    Có cache để tối ưu hiệu năng
    Dễ monitor và debug với hệ thống log
    Lưu Ý Khi Sử Dụng
    Cần có API key của TMDB
    Tuân thủ rate limit của TMDB
    Kiểm tra các domain video thường xuyên
    Backup dữ liệu định kỳ
    Đây là một kỹ thuật crawl khá hoàn chỉnh, phù hợp cho việc xây dựng website xem phim với:
    Dữ liệu phim chất lượng từ TMDB
    Xử lý lỗi tốt
    Dễ bảo trì và mở rộng
    Hiệu năng tối ưu với cache