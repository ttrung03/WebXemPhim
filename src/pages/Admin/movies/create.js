const handleUploadImg = async (e) => {
    const image = e.target.files[0];
    if (image) {
        try {
            // Upload file to Supabase Storage
            const fileExt = image.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            
            console.log('Uploading file:', fileName);
            
            const { data, error: uploadError } = await supabase.storage
                .from('movies')
                .upload(fileName, image, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.error('Upload error:', uploadError);
                throw uploadError;
            }

            console.log('Upload successful:', data);

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('movies')
                .getPublicUrl(fileName);

            console.log('Public URL:', publicUrl);

            if (e.target.id === 'backDrop') {
                setBackdrop(fileName);
            } else {
                setPosTer(fileName);
            }
        } catch (error) {
            console.error('Error details:', error);
            showToastMessage('error', `Upload failed: ${error.message}`);
        }
    }
};

const getImageUrl = (fileName) => {
    if (!fileName) return '';
    return `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/movies/${fileName}`;
};

return (
    <div className={cs('create_film_container')}>
        <h3 className={cs('create_film_title')}>Thêm phim mới</h3>
        <Form className={cs('create_film_form')} onSubmit={handleSubmit(Onsubmit)}>
            {/* ... other form fields ... */}
            <Row>
                <Col>
                    <Form.Group>
                        <Form.Label className={cs('create_film_label')}>Ảnh nền</Form.Label>
                        {backdrop && (
                            <img 
                                className={cs('create_film_image')} 
                                src={getImageUrl(backdrop)} 
                                alt="Backdrop" 
                            />
                        )}
                        <Form.Control
                            type="file"
                            id="backDrop"
                            onChange={handleUploadImg}
                            className={cs('create_film_input')}
                            accept="image/*"
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label className={cs('create_film_label')}>Ảnh đại diện</Form.Label>
                        {posTer && (
                            <img 
                                className={cs('create_film_image')} 
                                src={getImageUrl(posTer)} 
                                alt="Poster" 
                            />
                        )}
                        <Form.Control
                            type="file"
                            onChange={handleUploadImg}
                            className={cs('create_film_input')}
                            accept="image/*"
                        />
                    </Form.Group>
                </Col>
            </Row>
            {/* ... rest of the form ... */}
        </Form>
    </div>
); 