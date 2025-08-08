import { useSelector } from "react-redux"
import NewNoteForm  from './NewNoteForm'
import { Link } from 'react-router-dom'
import { useGetUsersQuery } from "../users/usersApiSlice"


const NewNote = () => {
  const { users }  = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids?.map(id => data?.entities[id])
    })
  })

  let content;

  if (!users){
    content = <p>The new note feature is currently unavailable: <Link to="/">Back to home page</Link></p>;
  } else if (!users?.length){
    content = <p>No users found, create a user first to create a note: <Link to="../users/new"><span>Create a user</span></Link></p>
  } else {
    content = <NewNoteForm users={users} />;
  }


  return content;

}

export default NewNote