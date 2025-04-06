const handleUploadImg = async (e) => {
    const image = e.target.files[0];
    if (image) {
        try {
            // Upload file to Supabase Storage
            const fileExt = image.name.split('.').pop();
            const fileName = `${movie._id}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;
            
            const { data, error: uploadError } = await supabase.storage
                .from('movies')
                .upload(filePath, image);

            if (uploadError) {
                throw uploadError;
            }

            if (e.target.id == 'backDrop') {
                setBackdrop(filePath);
            } else {
                setPosTer(filePath);
            }
        } catch (error) {
            console.error(error);
            showToastMessage('error', error.message);
        }
    }
}; 