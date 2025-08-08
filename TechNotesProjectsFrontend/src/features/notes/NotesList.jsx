import { useGetNotesQuery } from "./notesApiSlice";
import { useGetUsersQuery } from "../users/usersApiSlice";
import Note from "./Note";
import useAuth from "../../hooks/useAuth";


const NotesList = () => {
  const { username, isManager, isAdmin, status } = useAuth();
  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetNotesQuery('notesList', {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  });

  const {
  data: users,
  isLoading: usersLoading,
  isError: usersError,
  error: usersErrorData,
  isSuccess: isUsersSuccess
} = useGetUsersQuery('usersList', {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
});


  let content;
  let filteredIds = [];

  if (isLoading || usersLoading) content = <PulseLoader color={"#FFF"}/>

  if (isError || usersError) {
    const errorMsg =
    error?.data?.message ||
    usersErrorData?.data?.message || "Unknown error loading notes or users";

    content = <p className="errmsg">Error: {errorMsg}</p>;
  }

  if (isSuccess && isUsersSuccess){
    const {ids, message, entities } = notes;
    const { ids: userIds, entities: userEntities } = users;

    const myUser = userIds.map(id => userEntities[id]).find(user => user.username === username);

    if (isManager || isAdmin) {
      filteredIds = [...ids]
    } else {
      if (myUser){
        filteredIds = ids.filter(noteId=> entities[noteId].user === myUser._id);
      } else {
        filteredIds = [];
      }
 
    }

    const tableContent = filteredIds?.length 
        ? filteredIds.map(noteId => <Note key={noteId} noteId={noteId} users={userEntities}/>)
        : null;

    let noNotesMessage;

    if (!tableContent){
      if (status === "Employee"){
        noNotesMessage = (<p>No personal notes</p>)
      } else {
            noNotesMessage = (<p>No notes to list</p>)
      }
    
    } else {
      noNotesMessage = null;
    }

      
    content = (
      <>
        { noNotesMessage && noNotesMessage }
        <table className="table table--notes"> 
          <thead className="table__thead">
            <tr>
              <th scope="col" className="table__th note__status">Status</th>
              <th scope="col" className="table__th note__created">Created</th>
              <th scope="col" className="table__th note__updated">Updated</th>
              <th scope="col" className="table__th note__title">Title</th>
              <th scope="col" className="table__th note__username">Owner</th>
              <th scope="col" className="table__th note__edit">Edit</th>
            </tr>
          </thead>
          <tbody>
            {
              tableContent && tableContent
            }
            {
              message &&            
              (
                <tr className="table__row message">
                  <td  className="table__message">{message}</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </>
    
    )

    return content;

  }




} 

export default NotesList