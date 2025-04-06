import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '~/context';

function AdminLayout() {
    const { user } = useContext(AuthContext);

    // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
    if (!user) {
        return <Navigate to="/admin/dashboard/signin" />;
    }

    return (
        <div className="admin-layout">
            <Outlet />
        </div>
    );
}

export default AdminLayout; 