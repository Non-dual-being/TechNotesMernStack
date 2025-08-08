import { useRef, useState, useEffect} from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useLoginMutation } from './authApiSlice';
import useTitle from '../../hooks/useTitle';

import usePersist from '../../hooks/usePersist';

const Login = () => {
  useTitle('Zure mossel Login Page');

  const userRef = useRef();
  const errRef = useRef();
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const [persist, setPersist] = usePersist();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const errClass = errMsg ? "errmsg" : "offscreen";

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    setErrMsg('');
  }, [username, password]);

  const handleUserInput = (e) => setUserName(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);
  const handleToggle = () => setPersist(prev => !prev);



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { accessToken} = await login({ username, password }).unwrap();
      console.log(`accesToken: ${accessToken}`);
      dispatch(setCredentials({ accessToken }))
      setUserName('');
      setPassword('');
      navigate('/dash');
    } catch (err) {
      if (!err.status) {
        setErrMsg('No Server Respons');
      } else if (err.status === 400){
        setErrMsg('Missing username or Password');
      } else if (err.status === 401){
        setErrMsg('Unauthorized');
      } else {
        setErrMsg(err.data?.message);
      }

      errRef?.current?.focus() /**de err message moet bestaan om erop te focussen */

    }


  }

  if (isLoading) return <p>is loading .... </p>

  /**
   * De aria-live is bedoeld om gebruikers van screenreaders op de hoogte te stellen van veranderingen in content
   * zonder dat zij handmatig opnieuw moet navigeren
   * Het aria live attribuut vertelt screenreaders hoe ze dynamische inhoud moet aankondingen
   * Dit voor slectziende die dan meteen de foutmessage te horen krijgen 
   * 
   * */

  const content = (
    <section className='public'>
      <header>
        <h1>Employee Login</h1>
      </header>
      <main className='login'>
        <p ref={errRef} className={errClass} aria-live="assertlive">{errMsg}</p>
        <form className='form' onSubmit={handleSubmit}>
          <label htmlFor="username">username:</label>
          <input 
            type="text"
            className='form__input'
            id="username"
            ref={userRef}
            value={username}
            onChange={handleUserInput}
            autoComplete='off'
            required
          />

          <label htmlFor='password'>Password:</label>
          <input 
            className='form__input'
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handlePwdInput}
            value={password}
            required
          />
          <button className='form__submit-button'>Sign in</button>
          <label htmlFor='persist' className='form__persist'>
            <input 
              type="checkbox" 
              className="form__checkbox" 
              id="persist"
              onChange={handleToggle}
              checked={persist}
            />
            Trust this Device
          </label>
        </form>
      </main>
      <footer>
        <Link to="/">Back to home</Link>
      </footer>
    </section>
  )

  return content
}

export default Login