/* eslint-disable react-hooks/exhaustive-deps */
import styles from './ListMovie.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';

import requestApi from '~/apiService';
import MovieItem from '../MovieItem';
import Skeleton from 'react-loading-skeleton';
const cs = classNames.bind(styles);

function ListMovie({ category, type }) {
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getList() {
            try {
                let result;
                if (category === 'movie') {
                    result = await requestApi.getTypeMovie(type, { params: {} });
                } else {
                    result = await requestApi.getTypeTV(type, { params: {} });
                }
                
                if (result && result.data) {
                    // Hiển thị tối đa 20 phim
                    setLists(result.data.slice(0, 20));
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching movies:', error);
                setLoading(false);
            }
        }
        getList();
    }, [category, type]);

    return (
        <div className={cs('wrapper')}>
            <Swiper
                modules={[Navigation]}
                navigation
                grabCursor
                spaceBetween={15}
                slidesPerView={'auto'}
                className={cs('swiper')}
                breakpoints={{
                    320: {
                        slidesPerView: 2,
                        spaceBetween: 10
                    },
                    480: {
                        slidesPerView: 3,
                        spaceBetween: 15
                    },
                    768: {
                        slidesPerView: 4,
                        spaceBetween: 15
                    },
                    1024: {
                        slidesPerView: 5,
                        spaceBetween: 15
                    },
                    1200: {
                        slidesPerView: 6,
                        spaceBetween: 15
                    }
                }}
            >
                {loading
                    ? Array(6)
                          .fill(0)
                          .map((_, i) => (
                              <SwiperSlide key={i} className={cs('swiperitem_ske')}>
                                  <Skeleton className={cs('skeleton-movie-item')} />
                              </SwiperSlide>
                          ))
                    : lists.map((list, index) => (
                          <SwiperSlide key={index} className={cs('swiperitem')}>
                              <MovieItem className={cs('movieItem')} category={category} list={list} />
                          </SwiperSlide>
                      ))}
            </Swiper>
        </div>
    );
}

export default ListMovie;
