import { supabase } from '~/components/Supabase';

export const Img = {
    baseImg(imgPath) {
        if (!imgPath) return '';
        if (imgPath.startsWith('http')) {
            return imgPath;
        }
        return `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/movies/${imgPath}`;
    },
    posterImg(imgPath) {
        if (!imgPath) return '';
        if (imgPath.startsWith('http')) {
            return imgPath;
        }
        return `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/movies/${imgPath}`;
    },
}; 