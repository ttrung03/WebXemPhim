/* eslint-disable eqeqeq */
import styles from './Users.module.scss';
import classNames from 'classnames/bind';
import { Form } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import { getDetail, editUser } from '~/apiService/user';
import { AuthContext } from '~/context';
<<<<<<< HEAD
import { supabase } from '~/components/Supabase';
=======
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { firebaseConnect } from '~/components/Firebase';

>>>>>>> 3b7c1e6 (the firt commit)
import image from '~/assets/Images';

const cs = classNames.bind(styles);

const EditUser = () => {
    const [user, SetUser] = useState({});
    const [avatar, setAvatar] = useState('');

    const { email } = useParams();
    const naviagte = useNavigate();
    const { showToastMessage } = useContext(AuthContext);

<<<<<<< HEAD
=======
    const storage = getStorage();

>>>>>>> 3b7c1e6 (the firt commit)
    const { register, handleSubmit, reset } = useForm();

    const Onsubmit = async (data) => {
        try {
            if (avatar) {
                data.avatar = avatar;
            }
            await editUser(data, email);
            naviagte('/admin/dashboard/users');
            showToastMessage('success', 'Cập nhật thành công');
        } catch (error) {
            showToastMessage('error', error.message);
        }
    };

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await getDetail(email);
                if (res.success) {
                    SetUser(res.data);
                    reset(res.data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        getUser();
<<<<<<< HEAD
    }, [email, reset]);

    const handleUploadImg = async (e) => {
        const image = e.target.files[0];
        if (image) {
            try {
                // Tạo tên file duy nhất
                const fileExt = image.name.split('.').pop();
                const fileName = `${user._id}_${Date.now()}.${fileExt}`;
                const filePath = fileName;

                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, image, {
                        upsert: true
                    });

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(filePath);

                setAvatar(publicUrl);
            } catch (error) {
                console.error(error);
                showToastMessage('error', error.message);
            }
=======
    }, []);

    const handleUploadImg = (e) => {
        const image = e.target.files[0];
        if (image) {
            const storageRef = ref(storage, `images/${image.name}`);
            const uploadTask = uploadBytesResumable(storageRef, image);
            uploadTask.on(
                'state_changed',
                (snapshot) => {},
                (error) => {
                    console.log(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        try {
                            setAvatar(downloadURL);
                        } catch (error) {
                            console.log(error);
                            // setLoading(false);
                        }
                    });
                },
            );
>>>>>>> 3b7c1e6 (the firt commit)
        }
    };

    return (
        <div className={cs('admin_container', 'user')}>
            <h3 className="text-center mt-4 mb-3 fs-1 fw-bold">Sửa người dùng</h3>
            <Form className={cs('genres_form')} onSubmit={handleSubmit(Onsubmit)}>
                <Form.Group className="mb-3">
                    <Form.Label>Avatar người dùng</Form.Label>
                    <img className={cs('user_avatar_Base')} src={avatar || user.avatar || image.avatar} alt="" />
                    <Form.Control className="mt-4" type="file" style={{ border: 'none' }} onChange={handleUploadImg} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Tên người dùng</Form.Label>
                    <Form.Control required type="text" {...register('name')} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Check type="checkbox" label="Quyền quản trị" {...register('isAdmin')} />
                </Form.Group>
                <button type="submit" className={cs('movie_btn_submit')}>
                    Lưu thông tin
                </button>
            </Form>
        </div>
    );
};

export default EditUser;
