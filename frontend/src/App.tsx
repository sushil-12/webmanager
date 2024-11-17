import { Routes, Route, Navigate } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';

import './globals.css';
import 'primeicons/primeicons.css';
import { Home } from './_root/pages';

import SignInForm from './_auth/Forms/SignInForm';
import ResetPasswordForm from './_auth/Forms/ResetPasswordForm';

// import SignUpForm from './_auth/Forms/SignUpForm';
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout.tsx';
import { Toaster } from "@/components/ui/toaster"
import UsersList from './_root/pages/UsersList.tsx';
import PostComponent from './_root/pages/PostComponent.tsx';
import Setting from './_root/pages/Setting.tsx';
import Media from './_root/pages/Media.tsx';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { MediaProvider } from './context/MediaProvider.tsx';
import PostOperation from './plugin/post/_custom_post/PostOperation.tsx';
import Category from './plugin/post/category/Category.tsx';
import ManageCustomFields from './plugin/myCustomFields/ManageCustomFields.tsx';
import PageComponent from './_root/pages/PageComponent.tsx'
import PluginComponent from './plugin/PluginComponent.tsx'
import PersonalStats from './_root/pages/PersonalStats.tsx';
import BuisnessStats from './_root/pages/BuisnessStats.tsx';
import DefaultComponent from './_root/pages/DefaultComponent.tsx';
import ProfileUpdated from './_root/pages/ProfileUpdated.tsx';
import VerifyEmail from './_root/pages/VerifyEmail.tsx';
import AddEditWebsite from './settings/websites/AddEditWebsite.tsx';
import Website from './settings/websites/Website.tsx';
import NotAuthorized from './_root/pages/NotAuthorized.tsx';
import { useUserContext } from './context/AuthProvider.tsx';
import EditUser from './_root/pages/User/EditUser';
import AddEditUser from './_root/pages/User/AddEditUser.tsx';
import ManageSeoSchema from './plugin/seoSchema/ManageSeoSchema.tsx';

interface ProtectedRouteProps {
    children: React.ReactNode;
    user: { role: string | undefined } | null;
    allowedRoles: string[];
    isLoading: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, user, allowedRoles, isLoading }) => {
    let role = localStorage.getItem('severty')
    if (!role) return;
    role = atob(role)
    if (!isLoading && user !== null && !user || !allowedRoles.includes(role || '')) {
        // Redirect to a not authorized page or login page
        return <Navigate to="/not-authorized" />;
    }

    return <>{children}</>;
};


const App = () => {
    const { user, isLoading } = useUserContext();
    return (
        <PrimeReactProvider>
            <Toaster />
            <main className='flex h-screen'>
                <Routes>
                    {/* Private Routes start */}
                    <Route element={<RootLayout />}  >
                        <Route index element={<Home />} />
                        <Route path='/dashboard' element={<Home />} />
                        <Route path='/buisness-statistic/:stats?' element={<BuisnessStats />} />
                        <Route path='/personal-statistics/:test?' element={<PersonalStats />} />

                        <Route path='/:domain/media' element={<MediaProvider><Media /></MediaProvider>} />
                        <Route path='/settings' element={<Setting />} />
                        <Route path='/:domain/category/posts/:post_type' element={<Category />} />
                        {/* START____Will be a dynamic routes for creating Custom Post Types (ROUTE NAME MUST BE SIMILAR TO post_type) */}
                        <Route path='/:domain/posts/:post_type?' element={<PostComponent />} />

                        {/* END____Will be a dynamic routes for creating Custom Post Types */}
                        <Route path='/:domain/post/:post_type/:post_id?' element={<PostOperation />} />
                        <Route path='/:domain/manage-custom-fields' element={<ManageCustomFields />} />
                        <Route path='/:domain/manage-seo-schema' element={<ManageSeoSchema />} />

                        <Route path='/:domain/:default' element={<DefaultComponent />} />


                        <Route path='/:domain/pages' element={<PageComponent />} />
                        <Route path='/:domain/pages/:page_id' element={<PostComponent />} />

                        <Route path='/:domain/plugins' element={<PluginComponent />} />
                        <Route path='/:domain/plugins/:plugin' element={<PluginComponent />} />

                        <Route path='/profile/:id' element={<ProfileUpdated />} />

                        {/* Protected routes */}
                        <Route
                            path='/edit-user/:user_id'
                            element={
                                <ProtectedRoute user={user} allowedRoles={['admin','super_admin']} isLoading={isLoading}>
                                    <EditUser />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path='/add-edit-user/:user_id?'
                            element={
                                <ProtectedRoute user={user} allowedRoles={['admin','super_admin']} isLoading={isLoading}>
                                    <AddEditUser />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/users' element={
                                <ProtectedRoute user={user} allowedRoles={['admin','super_admin']} isLoading={isLoading}>
                                    <UsersList />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/website/:action/:website_id?' element={
                                <ProtectedRoute user={user} allowedRoles={['admin','super_admin']} isLoading={isLoading}>
                                    <AddEditWebsite />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='websites' element={
                                <ProtectedRoute user={user} allowedRoles={['admin','super_admin']} isLoading={isLoading}>
                                    <Website />
                                </ProtectedRoute>
                            }
                        />

                        <Route path='*' element={<PersonalStats />} />
                        <Route path="/not-authorized" element={<NotAuthorized />} />

                    </Route>
                    {/* Private Routes */}

                    {/* Public Routes start */}
                    <Route element={<AuthLayout />}  >
                        <Route path='/reset-password/:token' element={<ResetPasswordForm />} />
                        <Route path='/login' element={<SignInForm />} />
                        <Route path='/forgot-password' element={<SignInForm />} />
                        <Route path='/verify-account' element={<SignInForm />} />

                        {/* <Route path='/sign-up' element={<SignUpForm />} /> */}
                    </Route>
                    {/* Public Routes End */}
                    <Route path='/verify-email/:token/:uniqueId/:email' element={<VerifyEmail />} />
                </Routes>
            </main>
        </PrimeReactProvider>
    )
}

export default App
