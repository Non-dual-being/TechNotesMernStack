import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import { useGetNotesQuery } from "./notesApiSlice";
import { memo } from 'react';



const Note = ({ noteId, users }) => {
  const { note } = useGetNotesQuery("notesList", {
    selectFromResult: ({ data }) => ({
        note: data?.entities[noteId]
    })
  })

  /**
   * je queried hier van de cache 
   * je pakt alleen de specfifieke note
   * De component rerenderd alleen als de note veranderd en niet als de hele lijst verandered
   * De notes:st is een cache key en heeft dus invloed op je opnieuw data ophalen en invladeren
   * prefetch en de notelist gebruiken deze ook, dus dit levert een hit op de cache op
   */

  const navigate = useNavigate();

  if (note){
    const user = users[note.user]
    if (!user) return null;

    const created = new Date(note.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long'})
    const updated = new Date(note.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long'})

    const handleEdit = () => navigate(`/dash/notes/${noteId}`);


    return (
        <tr className="table__row">
            <td className="table__cell note__status">
                {
                    note.completed
                        ?   <span className="note__status--completed">Completed</span>
                        : <span className="note__status--open">Open</span>
                }
            </td>
            <td className="table__cell note__created">{created}</td>
            <td className="table__cell note__updated">{updated}</td>
            <td className="table__cell note__title">{note.title}</td>
            <td className="table__cell note__username">{user?.username}</td>
            <td className="table__cell">
                <button
                    className="icon-button table__button"
                    onClick={handleEdit}
                >
                    <FontAwesomeIcon icon={faPenToSquare} />
                </button>
            </td>
        </tr>
    )        

  } else return null;

}

const memoizedNote = memo(Note) /**aalleen rerender als de data verandernd */

export default memoizedNote 