import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import styles from './Dashboard.module.scss';
import classNames from 'classnames/bind';

import { getAllCount } from '~/apiService/user';
import { getCountMovieMonth, getTotalView } from '~/apiService/movie';
import { getCountCommentMonth } from '~/apiService/comment';
import { Link } from 'react-router-dom';

import { MdOutlineMovieCreation } from 'react-icons/md';
import { BiMessageDetail } from 'react-icons/bi';
import { FiPlayCircle } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const cs = classNames.bind(styles);

function StatisticDashboard() {
    const [totalUser, setTotalUser] = useState([]);
    const [totalView, setTotalView] = useState(0);
    const [countMovie, setCountMovie] = useState(0);
    const [countComment, setCountComment] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getCount = async () => {
            const userByMonth = await getAllCount();
            const movieByMonth = await getCountMovieMonth();
            const commentByMonth = await getCountCommentMonth();
            const totalView = await getTotalView();
            setTotalUser(userByMonth.total);
            setCountMovie(movieByMonth.data);
            setCountComment(commentByMonth.data);
            setTotalView(totalView.count);
            setLoading(false);
        };
        getCount();
    }, []);

    return (
        <div className={cs('dask_wrapper')}>
            <div className={cs('dask_box-contain')}>
                <div className={cs('dask_box-item')}>
                    <div className={cs('dask_box-item-info')}>
                        <p>
                            <span>
                                {loading ? <AiOutlineLoading3Quarters className={cs('dask_loading')} /> : countMovie}
                            </span>
                            <span>Phim Mới tháng này</span>
                        </p>
                        <MdOutlineMovieCreation size={50} />
                    </div>
                    <Link to={`/admin/dashboard/movies/month/${new Date().getMonth() + 1}`}>Chi tiết</Link>
                </div>
                <div className={cs('dask_box-item')}>
                    <div className={cs('dask_box-item-info')}>
                        <p>
                            <span>
                                {loading ? <AiOutlineLoading3Quarters className={cs('dask_loading')} /> : countComment}
                            </span>
                            <span>Tương tác tháng này</span>
                        </p>
                        <BiMessageDetail size={50} />
                    </div>
                    <Link to="/admin/dashboard/movies/comment/month">Chi tiết</Link>
                </div>
                <div className={cs('dask_box-item')}>
                    <div className={cs('dask_box-item-info')}>
                        <p>
                            <span>
                                {loading ? <AiOutlineLoading3Quarters className={cs('dask_loading')} /> : totalView}
                            </span>
                            <span>Tổng Số Lượt Xem</span>
                        </p>
                        <FiPlayCircle size={50} />
                    </div>
                    <Link to="/admin/dashboard/movies/">Chi tiết</Link>
                </div>
            </div>
            <div className={cs('dask_chart')}>
                <LineChart width={900} height={300} data={totalUser}>
                    <Line type="monotone" dataKey="Số_Lượng" stroke="#8884d8" />
                    <XAxis dataKey="Tháng" />
                    <YAxis />
                    <Tooltip />
                </LineChart>
                <h4>Số Lượng Người Dùng Đăng Kí Trên Hệ Thống</h4>
            </div>
        </div>
    );
}

export default StatisticDashboard;
