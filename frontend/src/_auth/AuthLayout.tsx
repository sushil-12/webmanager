import { Outlet, Navigate } from 'react-router-dom';
const AuthLayout = () => {
    const token = localStorage.getItem('token');
    const isAuthenticated = token !== null && token !== '';
    const currentYear = new Date().getFullYear();

    return (
        <>
            {isAuthenticated ? (<Navigate to="/" />)
                :
                (<>
                    <section className='flex flex-1 flex-col justify-center items-center bg-primary-500 overflow-y-auto' >
                        <Outlet />
                        <p className="text-sm flex justify-center font-semibold bottom-0 absolute py-2 text-white ">
                            &copy; {currentYear} Sushil. Content Locker. All rights reserved.
                        </p>
                    </section>
                </>)}
        </>
    )
}

export default AuthLayout
