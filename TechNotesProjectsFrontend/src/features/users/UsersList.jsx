import { useGetUsersQuery } from  "./usersApiSlice"
import User from "./User";

const UsersList = () => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetUsersQuery('usersList', {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  });

  let content;

  if ( isLoading ) {
    content = <p> Ronilla is getting ready to say warp </p>;

  } else if (isError ){
    content = <p className="errmsg">Ronnilla said wrap due to error: {error?.data?.message ?? "error loading the users"}</p>;

  } else if (isSuccess) {
    const { ids } = users;
    let { message } = users;

    if (!message){
      message = `Technotes had currently ${ids.length} users`
    }

    const tableContent = ids?.length
      ? ids.map(userId => <User key={userId} userId={userId} />)
      : null;

    content = (
      <table className="table table--users">
        <thead className="table__thead">
          <tr>
            <th 
              scope="col" 
              className="table__th user__username"
            >
              Username
            </th>
            <th 
              scope="col" 
              className="table__th user__roles"
            >
              Roles
            </th>
            <th 
              scope="col" 
              className="table__th user__edit"
            >
              Edit
            </th>
          </tr>

        </thead>
        <tbody>
          {tableContent}
          {
            message && (
              <tr className="table__row user">
                <td  className="table__message">{message}</td>
              </tr>
              /**tis een grid dus geen collspan */
            )
          }
        </tbody>
      </table>
    )
  }
    
  return content
}

export default UsersList