import { useParams } from 'react-router-dom'
import EditNoteForm from './EditNoteForm'
import { useGetNotesQuery } from './notesApiSlice'
import { useGetUsersQuery } from '../users/usersApiSlice'
import  useAuth from '../../hooks/useAuth'
import  PulseLoader  from 'react-spinners/PulseLoader'


const EditNote = () => {
  const { id } = useParams();

  const { username, isManager, isAdmin } = useAuth();

  const { note } = useGetNotesQuery('notesList', {
    selectFromResult: ({ data }) => ({
      note: data?.entities[id]
    }),
  })

  const { users } = useGetUsersQuery('usersList', {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map(id => data?.entities[id])
    }),
  })

  if (!note || !users?.length) return <PulseLoader color={"#FFF"} />

  if (!isManager && !isAdmin){
    const validUser = users.find(user => user.username === username);
    const validUserId = validUser?.id ?? null;

    if (validUserId){
      const authorisation = (note.user.toString() === validUserId.toString());
      if (!authorisation) return <p className="errmsg">Salondoors closed big time</p>
    } else {
      return <p className="errmsg">Salondoors closed megabig time</p>
    }
  }

  const content = <EditNoteForm note = {note} users = {users} /> 
    
  return content;
}

export default EditNote








  /** ----------FROM OLD CODE USING THE SELECTOR
   * !niet useSelector(selectAllusers()
   * todo de bedoeling is dat useSelector dit zelf doe en dat je de referentie meegeeft
   */