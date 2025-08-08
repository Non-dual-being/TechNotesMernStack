import { Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"


const Welcome = () => {
    const date = new Date();
    const today = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'full',
        timeStyle : 'long'}).format(date);
    const { username, isManager, isAdmin } = useAuth();
    
    const content = (
        <section className="welcome">
            <p>{today}</p>

            <h1>Welcome {username || "technotes USer"}!</h1>

            <p><Link to="/dash/notes">View techNotes</Link></p>

            <p><Link to="/dash/notes/new">Add a new TechNote</Link></p>

            { 
                (isAdmin || isManager ) && <p><Link to="/dash/users">View User Setttings</Link></p>
            }

            {
                (isAdmin || isManager ) && <p><Link to="/dash/users/new">Add a new user</Link></p>
            }

        </section>
    )

    return content
}

export default Welcome