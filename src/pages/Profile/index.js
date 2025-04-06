import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { cs } from '../../utils/classNames';
import { updateUserClient } from '../../services/userService';

const [avatar, setAvatar] = useState(user?.avatar || image.avatar);

const handleUploadImg = async (e) => {
    const image = e.target.files[0];
    filterRef.current.classList.add(cs('filter'));
    
    if (image) {
        try {
            setLoading(true);
            
            // Check file size and type
            if (image.size > 2 * 1024 * 1024) {
                throw new Error('File size should be less than 2MB');
            }
            
            // Upload file to Supabase Storage
            const fileExt = image.name.split('.').pop();
            const fileName = `${user.id || Date.now()}.${fileExt}`;
            
            const { data, error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, image, {
                    upsert: true,
                    contentType: `image/${fileExt}`
                });

            if (uploadError) {
                console.error('Upload error:', uploadError);
                throw uploadError;
            }

            // Get public URL from Supabase
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            // Update user profile
            const res = await updateUserClient({ avatar: publicUrl }, user.email);
            
            if (!res.success) {
                throw new Error('Failed to update user profile');
            }

            // Update local storage and states
            const updatedUser = { ...user, avatar: publicUrl };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setAvatar(publicUrl); // Update avatar state
            
            filterRef.current.classList.remove(cs('filter'));
            showToastMessage('success', 'Cập nhật ảnh đại diện thành công');
        } catch (error) {
            console.error('Error details:', error);
            showToastMessage('error', `Upload failed: ${error.message}`);
            filterRef.current.classList.remove(cs('filter'));
        } finally {
            setLoading(false);
        }
    }
};

// Update avatar when user changes
useEffect(() => {
    setAvatar(user?.avatar || image.avatar);
}, [user]);

// Helper function to get avatar URL
const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return image.avatar;
    return avatarPath; // Return the URL as is since we're now storing full URLs
};

return (
    <div className={cs('wrapper')}>
        <div className={cs('picture')}>
            <h4 className={cs('title')}>Ảnh đại diện</h4>
            <div className={cs('pictureContain')}>
                {loading && <FontAwesomeIcon className={cs('iconLoading')} icon={faSpinner} />}
                <img 
                    src={avatar} 
                    className={cs('imageProfile')} 
                    alt="Avatar" 
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = image.avatar;
                    }}
                />
                <div ref={filterRef}></div>
            </div>
            <div className={cs('uploadContain')}>
                <button className={cs('uploadBtn')}>
                    <FontAwesomeIcon className={cs('iconUpload')} icon={faArrowRightFromBracket} />
                    Cập nhật ảnh mới
                </button>
                <input
                    className={cs('chooseFile')}
                    onChange={handleUploadImg}
                    type="file"
                    accept="image/*"
                />
            </div>
        </div>
    </div>
); 