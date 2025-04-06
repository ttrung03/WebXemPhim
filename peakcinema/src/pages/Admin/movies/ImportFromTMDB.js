import { useState } from 'react';
import { Form, Row, Col, Card, Button, Pagination, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './film.create1.module.scss';
import { tmdbService } from '~/apiService/tmdbService';
import { createMovie } from '~/apiService/movie';
import { FaSearch, FaDownload, FaInfoCircle, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import { supabase } from '~/components/Supabase';

const cs = classNames.bind(styles);

// Hàm tải và upload ảnh lên Supabase
const uploadImageToSupabase = async (imageUrl, fileName) => {
    if (!imageUrl) return null;
    
    try {
        // Tải ảnh từ TMDB
        const response = await axios.get(imageUrl, {
            responseType: 'blob'
        });
        
        // Upload lên Supabase
        const { data, error } = await supabase.storage
            .from('movies')
            .upload(fileName, response.data, {
                contentType: 'image/jpeg',
                cacheControl: '3600',
                upsert: true
            });
            
        if (error) {
            console.error('Error uploading to Supabase:', error);
            return null;
        }
        
        // Trả về tên file để lưu vào database
        return fileName;
    } catch (error) {
        console.error('Error processing image:', error);
        return null;
    }
};

const ImportFromTMDB = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [importing, setImporting] = useState(false);
    const [searchType, setSearchType] = useState('movie');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [importedMovieId, setImportedMovieId] = useState(null);
    const [importProgress, setImportProgress] = useState('');
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [cast, setCast] = useState([]);
    const [similar, setSimilar] = useState([]);
    const [keywords, setKeywords] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const results = searchType === 'movie' 
                ? await tmdbService.searchMovies(searchQuery)
                : await tmdbService.searchTVShows(searchQuery);
            setSearchResults(results);
            setTotalPages(Math.ceil(results.length / 12));
            if (results.length === 0) {
                setError('Không tìm thấy kết quả nào');
            }
        } catch (error) {
            console.error('Error searching:', error);
            setError('Lỗi khi tìm kiếm phim');
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async (id, itemIndex) => {
        setImporting(true);
        setError('');
        setSuccess('');
        setImportProgress('Đang lấy thông tin phim...');
        
        try {
            // Lấy chi tiết phim
            const details = searchType === 'movie'
                ? await tmdbService.getMovieDetails(id)
                : await tmdbService.getTVShowDetails(id);

            // Lấy trailer
            setImportProgress('Đang lấy trailer...');
            const trailerCode = await tmdbService.getVideos(id, searchType) || 'dQw4w9WgXcQ';
            details.trailerCode = trailerCode;

            // Tải và upload ảnh lên Supabase
            setImportProgress('Đang xử lý ảnh bìa...');
            const backdropUrl = `https://image.tmdb.org/t/p/original${details.backdrop_path}`;
            const backdropFileName = `backdrop_${id}_${Date.now()}.jpg`;
            
            setImportProgress('Đang xử lý ảnh poster...');
            const posterUrl = `https://image.tmdb.org/t/p/original${details.poster_path}`;
            const posterFileName = `poster_${id}_${Date.now()}.jpg`;
            
            // Upload ảnh lên Supabase
            const [backdropPath, posterPath] = await Promise.all([
                uploadImageToSupabase(backdropUrl, backdropFileName),
                uploadImageToSupabase(posterUrl, posterFileName)
            ]);
            
            // Cập nhật đường dẫn ảnh
            details.backdrop_path = backdropPath || details.backdrop_path;
            details.poster_path = posterPath || details.poster_path;

            setImportProgress('Đang thêm phim vào cơ sở dữ liệu...');
            const response = await createMovie(details);
            
            if (response && response.success) {
                setSuccess(`Thêm phim "${details.name}" thành công!`);
                setImportedMovieId(response.data?._id || response.data?.id);
                
                // Xóa phim đã thêm khỏi danh sách kết quả
                setSearchResults(prev => prev.filter((_, index) => index !== itemIndex));
                
                // Chuyển hướng sau 3 giây
                setTimeout(() => {
                    navigate('/admin/dashboard/movies');
                }, 3000);
            } else {
                throw new Error(response?.message || 'Không thể thêm phim');
            }
        } catch (error) {
            console.error('Error importing movie:', error);
            setError(`Lỗi khi thêm phim: ${error.message}`);
        } finally {
            setImporting(false);
            setImportProgress('');
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const itemsPerPage = 12;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentResults = searchResults.slice(startIndex, endIndex);

    // Hàm xem chi tiết phim
    const handleViewDetails = async (movie) => {
        setSelectedMovie(movie);
        setShowDetails(true);
        
        try {
            // Lấy thông tin bổ sung
            const [castData, similarData, keywordData] = await Promise.all([
                tmdbService.getCredits(movie.id, searchType),
                tmdbService.getSimilar(movie.id, searchType),
                tmdbService.getKeywords(movie.id, searchType)
            ]);
            
            setCast(castData);
            setSimilar(similarData);
            setKeywords(keywordData);
        } catch (error) {
            console.error('Error fetching additional details:', error);
        }
    };

    // Render thông tin chi tiết phim
    const renderMovieDetails = () => {
        if (!selectedMovie || !showDetails) return null;

        return (
            <div className={cs('movie-details')}>
                <h4>Thông tin chi tiết</h4>
                <Row>
                    <Col md={4}>
                        <img
                            src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                            alt={selectedMovie.title || selectedMovie.name}
                            className="img-fluid"
                        />
                    </Col>
                    <Col md={8}>
                        <h5>{selectedMovie.title || selectedMovie.name}</h5>
                        <p>{selectedMovie.overview}</p>
                        
                        <h6>Diễn viên chính:</h6>
                        <div className={cs('cast-list')}>
                            {cast.map(actor => (
                                <span key={actor.id} className={cs('cast-item')}>
                                    {actor.name}
                                </span>
                            ))}
                        </div>
                        
                        <h6>Từ khóa:</h6>
                        <div className={cs('keyword-list')}>
                            {keywords.map(keyword => (
                                <span key={keyword.id} className={cs('keyword-item')}>
                                    {keyword.name}
                                </span>
                            ))}
                        </div>
                        
                        <h6>Phim tương tự:</h6>
                        <div className={cs('similar-list')}>
                            {similar.map(movie => (
                                <div key={movie.id} className={cs('similar-item')}>
                                    {movie.title || movie.name}
                                </div>
                            ))}
                        </div>
                    </Col>
                </Row>
            </div>
        );
    };

    return (
        <div className={cs('create_film_container')}>
            <div className="d-flex align-items-center mb-4">
                <h3 className={cs('create_film_title')}>Import phim từ TMDB</h3>
                <div className="ms-3">
                    <FaInfoCircle className="text-primary" />
                    <small className="ms-1 text-muted">
                        Tìm kiếm và import phim từ cơ sở dữ liệu TMDB
                    </small>
                </div>
                <div className="ms-auto">
                    <Button 
                        variant="secondary" 
                        onClick={() => navigate('/admin/dashboard/movies')}
                        className={cs('create_film_button')}
                    >
                        <FaArrowLeft className="me-2" />
                        Quay lại danh sách phim
                    </Button>
                </div>
            </div>
            
            {error && (
                <Alert variant="danger" className="mb-4">
                    {error}
                </Alert>
            )}
            
            {success && (
                <Alert variant="success" className="mb-4">
                    {success} Đang chuyển hướng đến trang danh sách phim...
                </Alert>
            )}
            
            {importProgress && (
                <Alert variant="info" className="mb-4">
                    <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                    />
                    {importProgress}
                </Alert>
            )}
            
            <Form onSubmit={handleSearch} className="mb-4">
                <Row className="g-3">
                    <Col md={8}>
                        <div className="input-group">
                            <span className="input-group-text">
                                <FaSearch />
                            </span>
                            <Form.Control
                                type="text"
                                placeholder="Nhập tên phim cần tìm..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={cs('create_film_input')}
                            />
                        </div>
                    </Col>
                    <Col md={2}>
                        <Form.Select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                            className={cs('create_film_select')}
                        >
                            <option value="movie">Phim lẻ</option>
                            <option value="tv">Phim dài tập</option>
                        </Form.Select>
                    </Col>
                    <Col md={2}>
                        <Button 
                            type="submit" 
                            className={cs('create_film_button', 'w-100')}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="me-2"
                                    />
                                    Đang tìm...
                                </>
                            ) : (
                                <>
                                    <FaSearch className="me-2" />
                                    Tìm kiếm
                                </>
                            )}
                        </Button>
                    </Col>
                </Row>
            </Form>

            {/* Movie Details Modal */}
            {renderMovieDetails()}
            
            {/* Search Results */}
            <Row className="g-4">
                {currentResults.map((item, index) => (
                    <Col md={4} key={`${item.id}-${index}`}>
                        <Card className="h-100 shadow-sm">
                            <Card.Img
                                variant="top"
                                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                                alt={item.title || item.name}
                                style={{ height: '400px', objectFit: 'cover' }}
                            />
                            <Card.Body>
                                <Card.Title className="h5 mb-3">
                                    {item.title || item.name}
                                </Card.Title>
                                <Card.Text className="text-muted mb-2">
                                    {item.overview?.slice(0, 150)}...
                                </Card.Text>
                                <Card.Text className="small text-muted mb-3">
                                    Ngày phát hành: {item.release_date || item.first_air_date}
                                </Card.Text>
                                <div className="d-flex gap-2">
                                    <Button
                                        variant="outline-primary"
                                        onClick={() => handleViewDetails(item)}
                                        className={cs('btn-sm')}
                                    >
                                        <FaInfoCircle className="me-1" />
                                        Chi tiết
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={() => handleImport(item.id, index)}
                                        disabled={importing}
                                        className={cs('btn-sm')}
                                    >
                                        <FaDownload className="me-1" />
                                        Import
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {searchResults.length > 0 && (
                <div className="mt-5">
                    <Pagination className="justify-content-center">
                        <Pagination.First 
                            onClick={() => handlePageChange(1)} 
                            disabled={currentPage === 1}
                        />
                        <Pagination.Prev 
                            onClick={() => handlePageChange(currentPage - 1)} 
                            disabled={currentPage === 1}
                        />
                        {[...Array(totalPages)].map((_, index) => (
                            <Pagination.Item
                                key={index + 1}
                                active={index + 1 === currentPage}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next 
                            onClick={() => handlePageChange(currentPage + 1)} 
                            disabled={currentPage === totalPages}
                        />
                        <Pagination.Last 
                            onClick={() => handlePageChange(totalPages)} 
                            disabled={currentPage === totalPages}
                        />
                    </Pagination>
                </div>
            )}
        </div>
    );
};

export default ImportFromTMDB; 