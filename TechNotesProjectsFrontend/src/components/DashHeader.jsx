import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faFileCirclePlus,
    faUserGear,
    faUserPlus,
    faFilePen,
    faRightFromBracket 
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";




const DashHeader = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { isManager, isAdmin } = useAuth();
    const [logout, setLogout] = useState(false);
    let dashClass = '';
    let newNoteButton = null;
    let newUserButton = null;
    let usersButton = null;
    let notesButton = null;
    let buttonContent = null;


    const DASH_REGEX = /^\/dash(\/)?$/;
    const NOTES_REGEX = /^\/dash\/notes(\/)?$/;
    const USERS_REGEX = /^\/dash\/users(\/)?$/;

    const [sendLogout, {
        isLoading,
        isError,
        error,
        isSuccess
    }] = useSendLogoutMutation();


    const onNewNoteClicked = () => navigate('/dash/notes/new');
    const onNewUserClicked = () => navigate('/dash/users/new');
    const onNotesClicked = () => navigate('/dash/notes');
    const onUsersClicked = () => navigate('/dash/users');


    const onLogoutClicked = async () => {
        try {
            await sendLogout().unwrap()
            !isLoading && navigate('/login')

        } catch (err) {
            console.error('Logout failed:', err);
              setLogout(false);
        }
    }


    if (!DASH_REGEX.test(pathname) && !NOTES_REGEX.test(pathname) && !USERS_REGEX.test(pathname)) {
        dashClass = "dash-header__container--small"
    }

    if (NOTES_REGEX.test(pathname)){
        newNoteButton = (
            <button
                className="icon-button"
                title="New-Note"
                onClick={onNewNoteClicked}
            >
                <FontAwesomeIcon icon={faFileCirclePlus} />
            </button>
        )
    }

    if (USERS_REGEX.test(pathname)){
        newUserButton = (
            <button
                className="icon-button"
                title="New-User"
                onClick={onNewUserClicked}
            >
                <FontAwesomeIcon icon={faUserPlus} />
            </button>
        )
    }

    if ((isManager || isAdmin) 
        && 
        (!USERS_REGEX.test(pathname) && pathname.includes('/dash'))){
        usersButton = (
            <button
                className="icon-button"
                title="Users"
                onClick={onUsersClicked}
            >
                <FontAwesomeIcon icon={faUserGear} />
            </button>
        )
    }

    if ((isManager || isAdmin) 
        && 
        (!NOTES_REGEX.test(pathname) && pathname.includes('/dash'))){
        notesButton = (
            <button
                className="icon-button"
                title="Notes"
                onClick={onNotesClicked}
            >
                <FontAwesomeIcon icon={faFilePen} />
            </button>
        )
    }

    const logoutButton = (
        <button
            className="icon-buton"
            title="Logout"
            onClick={onLogoutClicked}
        >
            <FontAwesomeIcon icon={faRightFromBracket } />
        </button>
    )

    const errClass = isError ? "errmsg" : "offscreen"

    if (isLoading){
        buttonContent = <p>Adioss..</p>
    } else {
        buttonContent = (
            <>
                {newNoteButton}
                {newUserButton}
                {notesButton}
                {usersButton}
                {logoutButton}
            </>
        )
    }

    const content = (
        <>
            <p className={errClass}>{isError && error?.data?.message}</p>

            <header className="dash-header">
                <div className={`dash-header__container ${dashClass}`}>
                    <Link to="/dash">
                        <h1 className="dash-header__title">techNotes</h1>
                    </Link>
                    <nav className="dash-header__nav">
                        {buttonContent}
                    </nav>
                </div>
            </header>   
        </>
        
    )
    return content;
}

export default DashHeader