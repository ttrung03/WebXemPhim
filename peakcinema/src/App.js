import { Routes, Route } from 'react-router-dom';
import allRoute from '~/routes';
import SignIn from '~/pages/AuthForm/SignIn';
import SignUp from '~/pages/AuthForm/SignUp';
<<<<<<< HEAD
=======
<<<<<<< HEAD
import MainLayout from '~/layout/MainLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Dashboard from '~/pages/Admin';
import UsersPage from '~/pages/Admin/Users';
import MoviesPage from '~/pages/Admin/movies';
import GenresPage from '~/pages/Admin/Genres';
import CreateMovie from '~/pages/Admin/movies/create';
import EditMovie from '~/pages/Admin/movies/edit';
import CreateGenres from '~/pages/Admin/Genres/create';
import EditGenres from '~/pages/Admin/Genres/edit';
import EditUser from '~/pages/Admin/Users/edit';
import CommentMovie from '~/pages/Admin/movies/commentMovie';
import StatisticDashboard from '~/pages/Admin/Dashboard';
import FormInputNewPassW from '~/pages/AuthForm/ResetPassW/formInputNew';
import ImportFromTMDB from './pages/Admin/movies/ImportFromTMDB';
=======
>>>>>>> method
import MainLayout from './layout/MainLayout';
import { ToastContainer } from 'react-toastify';

import Dashboard from './pages/Admin';
import UsersPage from './pages/Admin/Users';
import MoviesPage from './pages/Admin/movies';
import GenresPage from './pages/Admin/Genres';
import CreateMovie from './pages/Admin/movies/create';
import EditMovie from './pages/Admin/movies/edit';
import CreateGenres from './pages/Admin/Genres/create';
import EditGenres from './pages/Admin/Genres/edit';
import EditUser from './pages/Admin/Users/edit';
import CommentMovie from './pages/Admin/movies/commentMovie';
import StatisticDashboard from './pages/Admin/Dashboard';
import FormInputNewPassW from './pages/AuthForm/ResetPassW/formInputNew';
<<<<<<< HEAD
=======
>>>>>>> 3b7c1e6 (the firt commit)
>>>>>>> method

function App() {
    return (
        <>
            <Routes>
<<<<<<< HEAD
                {allRoute.map((route, index) => {
                    const Pages = route.component;
=======
<<<<<<< HEAD
                {/* Public Routes */}
                {allRoute.map((route, index) => {
                    const Page = route.component;
=======
                {allRoute.map((route, index) => {
                    const Pages = route.component;
>>>>>>> 3b7c1e6 (the firt commit)
>>>>>>> method
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <MainLayout>
<<<<<<< HEAD
                                    <Pages />
=======
<<<<<<< HEAD
                                    <Page />
=======
                                    <Pages />
>>>>>>> 3b7c1e6 (the firt commit)
>>>>>>> method
                                </MainLayout>
                            }
                        />
                    );
                })}
                <Route path="/register" element={<SignUp />} />
                <Route path="/login" element={<SignIn />} />
<<<<<<< HEAD
=======
<<<<<<< HEAD
                <Route path="/reset-password" element={<FormInputNewPassW />} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<Dashboard />}>
                    <Route index element={<StatisticDashboard />} />
=======
>>>>>>> method

                {/* <Route path="/reset" element={<FormInputNewPassW />} /> */}

                <Route path="/reset-password" element={<FormInputNewPassW />} />

                <Route path="/admin/dashboard" element={<Dashboard />}>
<<<<<<< HEAD
=======
>>>>>>> 3b7c1e6 (the firt commit)
>>>>>>> method
                    <Route path="statistic" element={<StatisticDashboard />} />
                    <Route path="movies">
                        <Route index element={<MoviesPage />} />
                        <Route path="month/:month" element={<MoviesPage />} />
                        <Route path="search/:searchValue" element={<MoviesPage />} />
                        <Route path="create" element={<CreateMovie />} />
                        <Route path="edit/:slug" element={<EditMovie />} />
                        <Route path="comment/:id" element={<CommentMovie />} />
                    </Route>

                    <Route path="genres">
                        <Route index element={<GenresPage />} />
                        <Route path="create" element={<CreateGenres />} />
                        <Route path="edit/:id" element={<EditGenres />} />
                    </Route>

                    <Route path="users">
                        <Route index element={<UsersPage />} />
                        <Route path="edit/:email" element={<EditUser />} />
                    </Route>
<<<<<<< HEAD
                </Route>


=======
<<<<<<< HEAD

                    <Route path="import-tmdb" element={<ImportFromTMDB />} />
                </Route>
=======
                </Route>


>>>>>>> 3b7c1e6 (the firt commit)
>>>>>>> method
            </Routes>
            <ToastContainer />
        </>
    );
}

export default App;
