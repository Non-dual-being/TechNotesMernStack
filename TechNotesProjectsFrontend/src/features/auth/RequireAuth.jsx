import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth"

const RequireAuth = ({ allowedRoles }) => {
    const location = useLocation()
    const { roles } = useAuth()

    const content = (
        roles.some(role => allowedRoles.includes(role))
            ? <Outlet />
            : <Navigate to="/login" state={{from: location}} replace />
    )
    return content
}

export default RequireAuth
/**
 * This component protects routes based on user roles.
 * 
 * If the user's role matches one of the allowed roles, they are granted access
 * to the requested route via <Outlet />.
 * 
 * If the user's role is not allowed, they are redirected to the login page.
 * 
 * The `state={{ from: location }}` prop preserves the original URL the user
 * attempted to access. After a successful login, the app can redirect the user
 * back to that original route (using `location.state.from`).
 *
 * The `replace` prop prevents the login route from being added to the browser
 * history stack, avoiding navigation issues when using the Back button.
 * 
 * This works as follows a users is on /notes and wants to go to users without the approperiate role
 * The replace ensures that users url is preplace by login in the history, so when the users hits back he wont go back to users and so to login agian
 * but he wil in effect go back to notes again
 * 
 * Meanwhile with state from location you store users in location.state.form so your are able to navigate a vistitor to users when they are allowed
 * 
 */