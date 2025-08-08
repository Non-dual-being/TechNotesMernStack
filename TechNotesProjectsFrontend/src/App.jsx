import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PublicPage from './components/public';
import Login from './features/auth/Login';
import DashLayout from './components/DashLayout';
import Welcome from './features/auth/Welcome';
import NotesList from './features/notes/NotesList';
import UsersList from './features/users/UsersList';
import EditUser from './features/users/EditUser';
import NewUserForm from './features/users/NewUserForm';
import EditNote from './features/notes/EditNote';
import NewNote from './features/notes/NewNote';
import Prefetch from './features/auth/Prefetch';
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import ROLES from "./config/roles";
import useTitle from './hooks/useTitle';


function App() {
  useTitle('TechNotes Dan D. Repairs');
  return (
    <Routes>
      {/* 'Public Routes' */}
      <Route path='/' element={<Layout/>}>
        <Route index element={<PublicPage />} />
        <Route path="login" element={<Login />} />
        
        {/* 'Protected Routes' */}
        <Route element={<PersistLogin/>}> 
        {/**je heb je persist login nodig om als er geen token is, dat je de roles uit je token kan halen met na de refresh */}
          <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
            <Route element={<Prefetch/>}>  
                <Route path="dash" element={<DashLayout />}>{/**dash is gewrapped om prefetch en persistlogin */}
                  <Route index element={<Welcome />} />

                  <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Admin]} />}>
                    <Route path="users">
                      <Route index element={<UsersList />} />            
                      <Route path=":id" element={<EditUser />} />
                      <Route path="new" element={<NewUserForm />} />
                    </Route>
                  </Route>
                  
                  <Route path="notes">
                    <Route index element={<NotesList />} />
                    <Route path=":id" element={<EditNote />} />
                    <Route path="new" element={<NewNote />} />
                  </Route>
                </Route> {/* 'end dash'  */}
              </Route>
            </Route>
        </Route> {/* 'End protected routers' */}
      </Route>
    </Routes>
  )
}

/**
 * door je binnen je Layout als parent te definieren ontvangen de kinderen via de oulet functionalitiet dezelfde layout
 */
export default App