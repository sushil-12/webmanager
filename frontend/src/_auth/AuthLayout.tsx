import { Outlet, Navigate } from 'react-router-dom';
const AuthLayout = () => {
    const token = localStorage.getItem('token');
    const isAuthenticated = token !== null && token !== '';
    return (
        <>
            {isAuthenticated ? (<Navigate to="/" />)
                :
                (<>
                    <section className='flex flex-1 justify-center items-center auth-screen' >
                        <Outlet />
                    </section>
                </>)}
        </>
    )
}

export default AuthLayout
