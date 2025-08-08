import { useState, useEffect } from "react";
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import ROLES  from "../../config/roles";


const EditUserForm = ({ user }) => {
    const USER_REGEX = /^[A-z\-\_)]{3,20}$/;
    const PWD_REGEX = /^[A-z0-9!@$%]{4,20}$/;

    const [updateUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUserMutation();

    const [deleteUser, {
        isSuccess: isDelSucces,
        isError: isDelError,
        error: delerror
    }] = useDeleteUserMutation();

    const navigate = useNavigate();
    const [username, setUsername] = useState(user.username);
    const [validUsername, setValidUsername] = useState(false);
    const [password, setPassword] = useState('');
    const [validPassword, setValidpassword] = useState(false);
    const [roles, setRoles] = useState(user.roles);
    const [active, setActive] = useState(user.active);

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username]);

    useEffect(() => {
        setValidpassword(PWD_REGEX.test(password))
    }, [password]);

    useEffect(() => {
        if (isSuccess || isDelSucces ){
            setUsername('');
            setPassword('');
            setRoles([]);
            navigate('/dash/users')
        }
        
    }, [isSuccess, isDelSucces, navigate]);

    const onUsernameChanged = e => setUsername(e.target.value);
    const onPasswordChanged = e => setPassword(e.target.value);
    const onActiveChanged = () => setActive(prev => !prev);

    const onRolesChanged = e => {
        const values = Array.from (
            e.target.selectedOptions,
            (option) => option.value
        )
        setRoles(values)
    };

    const onSaveUserClicked = async (e) => {

        if (password) {
            await updateUser({
                   id: user.id,
                   username,
                   password,
                   roles,
                   active 
                });   
        } else {
            await updateUser({
                id: user.id,
                username,
                roles,
                active
            }); 
        }
    }

    const onDeleteUserClicked = async (e) => {
        if (user.id) {
            await deleteUser({ id: user.id })
        }
    }
    
    const baseChecks = (
        validUsername &&  
        (typeof active === 'boolean' ) && 
        roles.length > 0 && 
        roles.every(role => Object.values(ROLES).includes(role)) &&
        !isLoading
    )

    let canSave = password ? (validPassword && baseChecks) : baseChecks;


    const errClass = (isError || isDelError ) 
        ? 'errmsg'
        : 'offscreen'; 
    const validUserClass = !validUsername 
        ? 'form__input--incomplete'
        : '';
    const validPwdClass = (password && !validPassword)
        ? 'form__input--incomplete'
        : '';
    const validRolesClass = !(roles.length > 0 && roles.every(role => Object.values(ROLES).includes(role)))
        ? 'form__input--incomplete'
        : '';

    const errContent = (error?.data?.message || delerror?.data.message) ?? '';

    const options = Object.values(ROLES).map(role => {
    return (
      <option
        key={role}
        value={role}
      >{role}</option>
    )
  });

  const content = 
  <>
    <p className={errClass}>{errContent}</p>

    <form  
        className="form"
        onSubmit={ e => e.preventDefault()}
    >
        <div className="form__title-row">
            <h2>Edit User</h2>
            <div className="form__action-buttons">
                <button
                    className="icon-button"
                    title="Save"
                    onClick={onSaveUserClicked}
                    disabled={!canSave}
                >
                    <FontAwesomeIcon icon={faSave} />
                </button>
                <button 
                    className="icon-button"
                    title="Delete"
                    onClick={onDeleteUserClicked}
                >
                    <FontAwesomeIcon icon={faTrashCan} />
                </button>
            </div>
        </div>

        <label className="form__label" htmlFor="username">
            Username: <span className="nowrap">[3-20 letters]</span>
        </label>
        <input 
            type="text" 
            name="username"
            id="username"
            autoComplete="off"
            value = {username}
            onChange={onUsernameChanged}
            className= {`form__input ${validUserClass}`}
        />

        <label className="form__label" htmlFor="password">
            Password: <span className="nowrap">[empty = no change]</span>
            <span className="nowrap">[4-12 chars incl. !@$%]</span>
        </label>
        <input 
            type="password"
            id="password"
            name="password"
            autoComplete="new-password"
            value={password}
            onChange={onPasswordChanged}
        />

        <label htmlFor="user-active" className="form__label form__checkbox-container">
            ACTIVE:
            <input 
                className="form__checkbox"
                id="user-active"
                name="user-active"
                type="checkbox"
                checked={active}
                onChange={onActiveChanged}            
            
            />
        </label>
        
        <label 
            htmlFor="roles" 
            className="form__label"
        >
        ASSIGNED ROLES:</label>

        <select 
            name="roles" 
            id="roles"
            className={`form__select ${validRolesClass}`}
            multiple={true}
            size="3"
            value={roles}
            onChange={onRolesChanged}
        >
            {options}
        </select>
    </form>
  
  
  </>

  return content;
}

export default EditUserForm