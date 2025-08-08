import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from 'react-router-dom';
import  useAuth  from "../hooks/useAuth"


const DashFooter = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const onGoHomeClicked = () => navigate('/dash');
    const { username, status } = useAuth();

    let goHomeButton = null;

    if (pathname !== '/dash') {
        goHomeButton = (
            <button
                className='dash-footer__button icon-button'
                title='Home'
                onClick={onGoHomeClicked} /**fuctie door geven en uitvoeren bij een onclick  */
            >
            <FontAwesomeIcon icon={faHouse}/>
            </button>

        )
    }
    const content = (
        <footer className="dash-footer">
            {goHomeButton /**javascript uitdrukkingen binne jsx omsluit je met {} */}
            <p>Current User: {username}</p>
            <p>Status:  {status} </p>
        </footer>
    )
  return (
    content
  )
}

export default DashFooter