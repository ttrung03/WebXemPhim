import { createContext, useState } from 'react';
<<<<<<< HEAD
import '~/context/contex.scss';
=======
import './contex.scss';
>>>>>>> 3b7c1e6 (the firt commit)

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [role,setRole]= useState(false)

    const showToastMessage = (feat, content) => {
        toast[feat](`${content}`, {
            position: toast.POSITION.TOP_RIGHT,
            className: 'toast-message',
            autoClose: 2500,
        });
    };

    return <AuthContext.Provider value={{ showToastMessage, role, setRole }}>{children}</AuthContext.Provider>;
};
