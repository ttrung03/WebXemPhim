import React from 'react';
import ReactDOM from 'react-dom/client';
<<<<<<< HEAD
import App from '~/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import Style from '~/components/GlobalStyle';
import { BrowserRouter } from 'react-router-dom';
import {AuthProvider} from '~/context';

=======
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import Style from '~/components/GlobalStyle';
import { BrowserRouter } from 'react-router-dom';
import {AuthProvider} from './context';
>>>>>>> 3b7c1e6 (the firt commit)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <Style>
                    <App />
                </Style>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
