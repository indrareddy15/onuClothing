import { Navigate, useLocation } from 'react-router-dom'

const CheckAuth = ({isAuthenticated,user,children}) => {
    const location = useLocation();
    console.log('User : ',isAuthenticated,user);
    if (location.pathname === "/") {
        if (!isAuthenticated) {
            return <Navigate to="/auth/login" />;
        } else {
            if (user.role === "admin" || user?.role === "superAdmin") {
                return <Navigate to="/admin/dashboard" />;
            } else {
                return <Navigate to="/auth/login"/>;
            }
        }
    }
    if(!isAuthenticated && !(location.pathname.includes('/login') || location.pathname.includes('/register'))) {
        return <Navigate to={'/auth/login'}/>
    }
    if(isAuthenticated && (location.pathname.includes('/login') || location.pathname.includes('/register'))) {
        if(user?.role === 'admin' || user?.role === "superAdmin") {
            return <Navigate to='/admin/dashboard'/>
        }else{
            return <Navigate to={'/auth/login'}/>
        }
    }
    if(isAuthenticated && location.pathname.includes('/admin') && user?.role === 'user'){
        return <Navigate to={'/unauth-page'}/>
    }
    if(isAuthenticated && (user?.role === "admin" || user?.role === "superAdmin") && location.pathname.includes('/shop')){
        return <Navigate to={'/admin/dashboard'}/>
    }
    return <>{children}</>
}

export default CheckAuth