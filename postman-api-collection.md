# API Collection cho Postman - PeakCinema

## TMDB API Endpoints
Base URL: `https://api.themoviedb.org/3`
API Key: Thêm vào Headers: `Authorization: Bearer {your_access_token}`

### 1. Movies
```
# Lấy phim đang hot
GET https://api.themoviedb.org/3/movie/popular
GET https://api.themoviedb.org/3/movie/popular?page=1&language=vi-VN

# Chi tiết phim
GET https://api.themoviedb.org/3/movie/{movie_id}
GET https://api.themoviedb.org/3/movie/{movie_id}?language=vi-VN

# Tìm kiếm phim
GET https://api.themoviedb.org/3/search/movie?query={search_term}
GET https://api.themoviedb.org/3/search/movie?query={search_term}&language=vi-VN

# Phim sắp chiếu
GET https://api.themoviedb.org/3/movie/upcoming
GET https://api.themoviedb.org/3/movie/upcoming?language=vi-VN

# Phim đang chiếu
GET https://api.themoviedb.org/3/movie/now_playing
GET https://api.themoviedb.org/3/movie/now_playing?language=vi-VN

# Phim top rated
GET https://api.themoviedb.org/3/movie/top_rated
GET https://api.themoviedb.org/3/movie/top_rated?language=vi-VN

# Credits của phim
GET https://api.themoviedb.org/3/movie/{movie_id}/credits

# Trailer và video
GET https://api.themoviedb.org/3/movie/{movie_id}/videos

# Phim tương tự
GET https://api.themoviedb.org/3/movie/{movie_id}/similar
```

### 2. TV Shows
```
# Lấy TV shows đang hot
GET https://api.themoviedb.org/3/tv/popular
GET https://api.themoviedb.org/3/tv/popular?language=vi-VN

# Chi tiết TV show
GET https://api.themoviedb.org/3/tv/{tv_id}
GET https://api.themoviedb.org/3/tv/{tv_id}?language=vi-VN

# Tìm kiếm TV show
GET https://api.themoviedb.org/3/search/tv?query={search_term}
GET https://api.themoviedb.org/3/search/tv?query={search_term}&language=vi-VN

# Chi tiết season
GET https://api.themoviedb.org/3/tv/{tv_id}/season/{season_number}

# Chi tiết episode
GET https://api.themoviedb.org/3/tv/{tv_id}/season/{season_number}/episode/{episode_number}

# TV shows top rated
GET https://api.themoviedb.org/3/tv/top_rated
GET https://api.themoviedb.org/3/tv/top_rated?language=vi-VN

# TV shows đang chiếu
GET https://api.themoviedb.org/3/tv/on_the_air
GET https://api.themoviedb.org/3/tv/on_the_air?language=vi-VN
```

### 3. Multi Search
```
# Tìm kiếm tổng hợp (phim, TV shows, người)
GET https://api.themoviedb.org/3/search/multi?query={search_term}
GET https://api.themoviedb.org/3/search/multi?query={search_term}&language=vi-VN
```

### 4. Genres
```
# Lấy danh sách thể loại phim
GET https://api.themoviedb.org/3/genre/movie/list
GET https://api.themoviedb.org/3/genre/movie/list?language=vi-VN

# Lấy danh sách thể loại TV show
GET https://api.themoviedb.org/3/genre/tv/list
GET https://api.themoviedb.org/3/genre/tv/list?language=vi-VN
```

### 5. Images
```
# Base URL cho hình ảnh
https://image.tmdb.org/t/p/original/{image_path}
https://image.tmdb.org/t/p/w500/{image_path}
https://image.tmdb.org/t/p/w300/{image_path}
```

### 6. Video Sources
```
# URL xem phim
https://vidsrc.to/embed/movie/{tmdb_id}
https://vidsrc.to/embed/tv/{tmdb_id}/{season}/{episode}

# URL backup
https://2embed.org/embed/movie/{tmdb_id}
https://2embed.org/embed/tv/{tmdb_id}/{season}/{episode}

https://autoembed.to/movie/tmdb/{tmdb_id}
https://autoembed.to/tv/tmdb/{tmdb_id}/{season}/{episode}
```

## PeakCinema Backend API

### 1. Authentication
```
# Đăng ký
POST /api/auth/register
Body: {
    "username": "string",
    "email": "string",
    "password": "string"
}

# Đăng nhập
POST /api/auth/login
Body: {
    "email": "string",
    "password": "string"
}

# Refresh token
POST /api/auth/refresh-token
Headers: {
    "Authorization": "Bearer {refresh_token}"
}
```

### 2. Movies
```
# Lấy danh sách phim
GET /api/movies
GET /api/movies?page=1&limit=20

# Chi tiết phim
GET /api/movies/{id}

# Tìm kiếm phim
GET /api/movies/search?q={search_term}

# Lọc phim theo thể loại
GET /api/movies/filter?genre={genre_id}

# Phim mới cập nhật
GET /api/movies/latest

# Phim theo thể loại
GET /api/movies/genre/{genre_id}
```

### 3. TV Shows
```
# Lấy danh sách TV shows
GET /api/tv-shows
GET /api/tv-shows?page=1&limit=20

# Chi tiết TV show
GET /api/tv-shows/{id}

# Tìm kiếm TV show
GET /api/tv-shows/search?q={search_term}

# Episodes của season
GET /api/tv-shows/{id}/season/{season_number}
```

### 4. User
```
# Thông tin user
GET /api/users/profile

# Cập nhật thông tin
PUT /api/users/profile
Body: {
    "username": "string",
    "email": "string"
}

# Đổi mật khẩu
PUT /api/users/change-password
Body: {
    "currentPassword": "string",
    "newPassword": "string"
}
```

### 5. Favorites
```
# Lấy danh sách yêu thích
GET /api/favorites

# Thêm vào yêu thích
POST /api/favorites
Body: {
    "movieId": "string"
}

# Xóa khỏi yêu thích
DELETE /api/favorites/{id}
```

### 6. History
```
# Lấy lịch sử xem
GET /api/history

# Thêm vào lịch sử
POST /api/history
Body: {
    "movieId": "string"
}

# Xóa lịch sử
DELETE /api/history/{id}
```

### 7. Comments
```
# Lấy comments của phim
GET /api/comments/movie/{movie_id}

# Thêm comment
POST /api/comments
Body: {
    "movieId": "string",
    "content": "string"
}

# Xóa comment
DELETE /api/comments/{id}
```

## Headers mẫu
```
# TMDB API
Authorization: Bearer {your_tmdb_token}

# PeakCinema API
Authorization: Bearer {your_access_token}
Content-Type: application/json
```

## Query Parameters phổ biến
```
language: vi-VN hoặc en-US
page: số trang (mặc định: 1)
limit: số item trên trang (mặc định: 20)
``` 