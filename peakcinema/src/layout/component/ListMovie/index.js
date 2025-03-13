/* eslint-disable react-hooks/exhaustive-deps */
import styles from './ListMovie.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
<<<<<<< HEAD
import { Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
=======
>>>>>>> 3b7c1e6 (the firt commit)

import requestApi from '~/apiService';
import MovieItem from '../MovieItem';
import Skeleton from 'react-loading-skeleton';
const cs = classNames.bind(styles);

function ListMovie({ category, type }) {
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
<<<<<<< HEAD

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
=======
    useEffect(() => {
        async function getList() {
            if (category === 'movie') {
                const result = await requestApi.getTypeMovie(type, { params: {} });
                setLists(result.data.slice(0, 10));
                setLoading(false);
            } else {
                const result = await requestApi.getTypeTV(type, { params: {} });
                setLists(result.data.slice(0, 10));
>>>>>>> 3b7c1e6 (the firt commit)
                setLoading(false);
            }
        }
        getList();
<<<<<<< HEAD
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
=======
    }, [category]);
    return (
        <div className={cs('wrapper')}>
            <Swiper grabCursor spaceBetween={10} slidesPerView={'auto'} className={cs('swapper')}>
                {loading
                    ? Array(5)
                          .fill(7)
                          .map((v,i) => (
                              <SwiperSlide key ={i} className={cs('swiperitem_ske')}>
>>>>>>> 3b7c1e6 (the firt commit)
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
