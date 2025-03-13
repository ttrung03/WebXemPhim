import axios from 'axios';
import queryString from 'query-string';
<<<<<<< HEAD

const instance = axios.create({
    //baseURL: 'https://server-five-chi.vercel.app/api',
    baseURL: 'http://localhost:8888/api',
=======
const instance = axios.create({
    //baseURL: 'https://server-five-chi.vercel.app/api',
     baseURL: 'http://localhost:8888/api',
>>>>>>> 3b7c1e6 (the firt commit)
    headers: {
        'Content-Type': 'application/json',
    },
    //Concat all params with apiKey then toString
    paramsSerializer: (params) => queryString.stringify(params),
});

instance.interceptors.request.use(async function (config) {
    // Do something before request is sent
    return config;
});
<<<<<<< HEAD

=======
>>>>>>> 3b7c1e6 (the firt commit)
instance.interceptors.response.use(
    function (res) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        if (res && res.data) {
            return res.data;
        }

        return res.data;
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        throw error;
    },
);

export default instance;

export const Img = {
    baseImg(imgPath) {
<<<<<<< HEAD
        if (!imgPath) return '';
        if (imgPath.startsWith('https://')) {
            return imgPath;
        }
        return `http://localhost:8888/uploads/${imgPath}`;
    },
    posterImg(imgPath) {
        if (!imgPath) return '';
        if (imgPath.startsWith('https://')) {
            return imgPath;
        }
        return `http://localhost:8888/uploads/${imgPath}`;
=======
        return `${imgPath}`;
    },
    posterImg(imgPath) {
        return `${imgPath}`;
>>>>>>> 3b7c1e6 (the firt commit)
    },
};
