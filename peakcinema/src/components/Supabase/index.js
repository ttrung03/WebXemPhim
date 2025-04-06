import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://akoympazruabvhmddeoh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrb3ltcGF6cnVhYnZobWRkZW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMjY4MTQsImV4cCI6MjA1ODgwMjgxNH0.bzW3hds-jnDopvYVzmQky9kdi4gFsrNF3lRop7gxidk'

// Khởi tạo Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Hàm xử lý upload file
export const uploadFile = async (file, bucket, path) => {
    try {
        const { error } = await supabase.storage
            .from(bucket)
            .upload(path, file)

        if (error) throw error

        // Lấy URL công khai của file
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(path)

        return publicUrl
    } catch (error) {
        console.error('Error uploading file:', error.message)
        throw error
    }
}

// Hàm xử lý xóa file
export const deleteFile = async (bucket, path) => {
    try {
        const { error } = await supabase.storage
            .from(bucket)
            .remove([path])

        if (error) throw error
    } catch (error) {
        console.error('Error deleting file:', error.message)
        throw error
    }
}

// Hàm xử lý authentication
export const signIn = async (email, password) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) throw error
        return data
    } catch (error) {
        console.error('Error signing in:', error.message)
        throw error
    }
}

export const signUp = async (email, password) => {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })
        if (error) throw error
        return data
    } catch (error) {
        console.error('Error signing up:', error.message)
        throw error
    }
}

export const signOut = async () => {
    try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    } catch (error) {
        console.error('Error signing out:', error.message)
        throw error
    }
}

// Hàm lấy thông tin user hiện tại
export const getCurrentUser = async () => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        return user
    } catch (error) {
        console.error('Error getting current user:', error.message)
        throw error
    }
} 