import styles from './Genres.module.scss';
import classNames from 'classnames/bind';
import { Button, Table } from 'react-bootstrap';
import { deleteGenres, getAll } from '~/apiService/genres';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Panigation from '~/layout/component/Panigation';

const cs = classNames.bind(styles);

function GenresPage() {
    const [genres, setGenres] = useState();
    const [pages, setPages] = useState(1);
    const [currPage, setCurrPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const getGenres = async () => {
        try {
            const res = await getAll(currPage, 15);
            if (res.success) {
                setGenres(res.data);
                setPages(res.pages);
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getGenres();
    }, [currPage]);

    const handleDeleteGenres = async (id) => {
        if (window.confirm('Bạn thật sự muốn xoá thể loại này')) {
            try {
                await deleteGenres(id);
                getGenres();
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <div className={cs('genre_admin_container')}>
            <h3>Danh sách thể loại</h3>
            <Link to="/admin/dashboard/genres/create" className={cs('genres_button')}>
                <span className="genres_label">+ Thêm thể loại</span>
                <span className="genres_gradient-container">
                    <span className="genres_gradient"></span>
                </span>
            </Link>

            {loading && <div className="text-center mt-3">Đang tải dữ liệu...</div>}
            {genres && (
                <>
                    <Table striped bordered hover responsive className={cs('genre_table')}>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên thể loại</th>
                                <th>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {genres.map((item, index) => (
                                <tr key={item._id}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>
                                        <Link
                                            to={`/admin/dashboard/genres/edit/${item._id}`}
                                            className={cs('genre_btn-success')}
                                        >
                                            Sửa
                                        </Link>
                                        <Button
                                            variant="danger"
                                            className={cs('genre_btn-danger')}
                                            onClick={() => handleDeleteGenres(item._id)}
                                        >
                                            Xoá
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Panigation
                        pages={pages}
                        currPage={currPage}
                        onSetCurrentPage={setCurrPage}
                        className={cs('genre_pagination')}
                    />
                </>
            )}
        </div>
    );
}

export default GenresPage;
