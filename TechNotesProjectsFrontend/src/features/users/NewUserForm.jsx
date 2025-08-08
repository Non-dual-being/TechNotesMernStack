import { useState, useEffect } from "react";
import { useAddNewUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from '@fortawesome/free-solid-svg-icons';
import ROLES from "../../config/roles";


const NewUserForm = () => {
  const USER_REGEX = /^[A-z\-\_]{3,20}$/
  const PWD_REGEX = /^[A-z0-9!@$%]{4,20}$/

  const [addNewUser, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useAddNewUserMutation();

  /**functie die opgeroepen kan worden en het result object */

  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState('');
  const [validPassword, setValidpassword] = useState(false);
  const [roles, setRoles] = useState([ROLES["Employee"]]);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username))
  }, [username]);

  useEffect(() => {
    setValidpassword(PWD_REGEX.test(password))
  }, [password]);

  useEffect(() => {
    if (isSuccess) {
      setUsername('')
      setPassword('')
      setRoles([])
      navigate('/dash/users')
    }
  }, [isSuccess, navigate]);

  /*
    navigate hoort erbij 
    tenzij het een literal is, constante of gegarandeerd ovnerander blijven zoals een useState setter,
    gebruikte waarden in je dependency array staan 
  
  */

  const onUsernameChanged = e => setUsername(e.target.value);
  const onPasswordChanged = e => setPassword(e.target.value);

  const onRolesChanged = e => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    )
    setRoles(values)
  }

  
  /**array from accepteer een anonieme functie die werpt als map
   * omdat de selectedOPtions een HTML collection is, moet er overheen mappen
   */

  const canSave = roles.length > 0 && validPassword && validUsername && !isLoading

  const onSaveUserClicked = async (e) => {
    e.preventDefault();

    if (canSave) {
      await addNewUser({ username, password, roles })
    }
  }

  const options = Object.values(ROLES).map(role => {
    return (
      <option
        key={role}
        value={role}
        style={{'height' : 'auto', 'width' : 'auto'}}
      >{role}</option>
    )
  });

  const errClass = isError ? "errmsg" : "offscreen";
  const validUserClass = username && !validUsername ? 'form__input--incomplete' : '';
  const validPwdClass = password && !validPassword ? 'form__input--incomplete' : '';
  const validRolesClass = roles.length > 0 ? '' : 'form__input--incomplete';

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveUserClicked}>
        <div className="form__title-row">
          <h2>New User</h2>
          <div className="form_action-buttons">
            <button
              className="icon-button"
              title="save"
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="username">
          username: <span className="nowrap">[3-20 letters]</span>
        </label>
        <input
          className={`form__input ${validUserClass}`}
          id="username"
          name="username"
          type="text"
          autoComplete="off"
          value={username}
          onChange={onUsernameChanged}
        
        />

        <label className="form__label" htmlFor="password">
          Password: <span className="nowrap">[4-12 chars incl. !@$%]</span>
        </label>
        <input
          className={`form__input ${validPwdClass}`}
          id="password"
          name="password"
          type="text"
          autoComplete="off"
          value={password}
          onChange={onPasswordChanged}
        
        />

        <select 
          name="roles" 
          id="roles"
          className = {`form__select ${validRolesClass}`}
          multiple= {true}
          size={ROLES.length}
          defaultValue={[ROLES['Employee']]}
          onChange={onRolesChanged}
          style={{ 'height' : 'auto', 'width' : 'fit-content'}}
        >
          {options}
        </select>
      </form>
    </>
  )


  return content
}

export default NewUserForm