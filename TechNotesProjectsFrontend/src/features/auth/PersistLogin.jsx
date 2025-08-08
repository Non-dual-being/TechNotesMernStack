import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";
import { PulseLoader } from "react-spinners";


const PersistLogin = () => {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const effectRan = useRef(false); /**react 18 strict mode */
  const [trueSuccess, setTrueSuccess] = useState(false);

  const [refresh, {
    isUninitialized,
    isLoading,
    isSuccess,
    isError,
    error
  }] = useRefreshMutation();

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
      const verifyRefreshToken = async () => {
        console.log('verify refreshtoken');
        try {
          await refresh()
          setTrueSuccess(true);
          /**
           * the extra step, on top of the isSucces inherit to the Mutation from the apiSlice
           * is needed for getting the credentials, in this case the accestoken and setting them with dispatch to update the state
           * Without this extra step, a is Success comes before a state update with the new credentails
           * 
           */
        } catch (err) {
          console.log(err);
        }
      }

      if (!token && persist) verifyRefreshToken()

        /**
         * essentialy when the user refreshes the page, the token is set to null 
         * however with the component wrapper a new accestoken wil be granted on the remount
         */
    }
    return () => effectRan.current = true;
  }, [] /*
  *estlint disable-next-line this 
  essentialy react wants stuff in de dependcy array cuz your ussing changeable consts 
  however you only wants this an a initial mount and not when a piece of state changes
  
  */)

  let content;

  if (!persist) {
    content = <Outlet />
    //persist: no
  } else if (isLoading) {
    content = <PulseLoader color={"#FFF"}/>
  } else if (isError) {
    /**persist yes --||-- token: no */
    content = (
      <p className="errmsg" role="alert" aria-live="assertive">
        {/**alert en assertive zijn instructie voor schermlezers */}
        {error?.data?.message || "Authorization error"}{' - '}
        <Link to="/login">Please login agian</Link>
      </p>
    )
  } else if (isSuccess && trueSuccess){
      /**persist yes --||-- token: yes */
      content = <Outlet />
  } else if (token && isUninitialized){
      /**persist yes --||-- token: yes --||-- refresh needed: no*/
    console.log(isUninitialized);
    content = <Outlet />

    /**
     * 
     */

  }

  return content
}

export default PersistLogin

/**
 * In development mode react components mount, unmount and remount
 * The first time useeffect runs with the initial mount it effectRan wil be false
 * However during Remount it will be set to true with the clean up function during unmount wihtin useeffect
 * The refresh token we want to set one time en not two times
 * 
 */

