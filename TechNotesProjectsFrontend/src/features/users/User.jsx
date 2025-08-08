import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useGetUsersQuery } from "./usersApiSlice"
import { memo } from "react"

const User = ({ userId }) => {
    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[userId]
        }),
    })
    if (user) {
        const handleEdit = () => navigate(`/dash/users/${userId}`);
        const userRoleString = user.roles.toString().replaceAll(',', ', ');
        const cellStatus = user.active ? '' : 'table__cell--inactive';
        return (
            <tr className="table__row user">
                <td className={`table__cell ${cellStatus}`}>{user.username}</td>
                <td className={`table__cell ${cellStatus}`}>{userRoleString}</td>
                <td className={`table__cell ${cellStatus}`}>
                    <button
                        className="icon-button table__button"
                        onClick={handleEdit}
                    >
                    <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        )

    } else return null
}

const memoizedUser = memo(User)

export default User


/**
 * je moet bij de class name een jsx expreesie gebruiken opmdat user.active pas gekend is bij het redneren
 */