import { useState, useEffect } from "react";
import {  useUpdateNoteMutation, useDeleteNoteMutation } from "./notesApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import useAuth from "../../hooks/useAuth";


const EditNoteForm = ({ users, note }) => {
    const { isAdmin, isManager } = useAuth();

    const [updateNote, {
        isLoading : isUpdating,
        isSuccess,
        isError,
        error
    }] = useUpdateNoteMutation();

    const [deleteNote, {
        isSuccess: isDelSucces,
        isLoading: isDeleting,
        isError: isDelError,
        error: delerror
    }] = useDeleteNoteMutation();

    const navigate = useNavigate();
    const [title, setTitle] = useState(note.title);
    const [text, setText] = useState(note.text);
    const [completed, setCompleted] = useState(note.completed);
    const [userId, setUserid] = useState(note.user);

    useEffect(() => {
        if (isSuccess || isDelSucces){
            setTitle('');
            setText('');
            setUserid('');
            navigate('/dash/notes');
        }
    },[navigate, isSuccess, isDelSucces]);

    /** Het leeghalen is een defensieve vorm van programmeren, lijkt overbodig maar kan geen kwaad */

    const onTitleChanged = e => setTitle(e.target.value);
    const onTextChanged = e => setText(e.target.value);
    const onCompletedChanged = () => setCompleted(prev => !prev);
    const onUserIdChanged = e => setUserid(e.target.value);

    const canSave = !!title && !!text && !!userId && !isUpdating && !isDeleting;
    const canDelete = !isUpdating && !isDeleting && (isAdmin || isManager);
    
    const onSaveNoteClicked = async (e) => {
        if (canSave) {
            await updateNote({
                id: note.id,
                user: userId,
                title,
                text,
                completed
            });
        }
    }

    const onDeleteNoteClicked = async (e) => {
        if (canDelete) {
            await deleteNote({ id: note.id })
        }
    }

    const created = new Date(note.createdAt).toLocaleString('en-US', 
        { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    const updated = new Date(note.updatedAt).toLocaleString('en-US', 
        { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    

    const options = (
        users.map( user => { 
            return (
                <option
                    key={user.id}
                    value={user.id}
                >
                    {user.username}
                </option>
            )
        })
    );

    const errClass = (isError || isDelError)
        ? 'errmsg'
        : 'offscreen';
    
    const validTitleClass = !title 
        ? 'form_input--incomplete' 
        : '';
    
    const validTextClass = !text
        ? 'form_input--incomplete' 
        : '';

    const errContent = (error?.data?.message || delerror?.data?.message) ?? '';

    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form 
                className="form"
                onSubmit={ e => e.preventDefault()}
            >
                <div className="form__title-row">
                    <h2>Edit Note #{note.ticket}</h2>
                    <div className="form__action-buttons">
                        <button 
                            className="icon-button"
                            title="save"
                            onClick={onSaveNoteClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        {   
                            (isAdmin || isManager) 
                            
                            &&

                            (<button 
                                className="icon-button"
                                title="Delete"
                                onClick={onDeleteNoteClicked}
                                disabled={!canDelete}
                            >
                                <FontAwesomeIcon icon={faTrashCan} />
                            </button>)
                        }
                        
                    </div>
                </div>
                <label 
                    htmlFor="note-title" 
                    className="form__label"
                > Title: </label>
                <input 
                    type="text"
                    className={`form__input ${validTitleClass}`}
                    id="note-title"
                    name="title"
                    autoComplete="off"
                    value={title}
                    onChange={onTitleChanged}
                />

                <label 
                    htmlFor="note-text" 
                    className="form_label"
                >Text: </label>

                <textarea 
                    name="text" 
                    id="note-text"
                    className={`form__input form__input--text ${validTextClass}`}
                    value={text}
                    onChange={onTextChanged}                
                />
                <div className="form__row">
                    <div className="form__divider">
                        <label 
                            htmlFor="note-completed" 
                            className="form__label form__checkbox-container"
                        >
                            WORK COMPLETE:
                            <input 
                                type="checkbox"
                                id="note-completed"
                                name="completed" 
                                checked={completed}
                                onChange={onCompletedChanged}
                            />
                        </label>
                        <label 
                            htmlFor="note-username" 
                            className="form__label form__checkbox-container"
                        >ASSIGNED TO: </label>
                        <select 
                            name="user" 
                            id="username"
                            className="form__select"
                            value={userId}
                            onChange={onUserIdChanged}  
                        >
                            {options}
                        </select>
                    </div>
                    <div className="form__divider">
                        <p className="form__created">Created: <br />{created}</p>
                        <p className="form__updated">Updated: <br />{updated}</p>
                    </div>
                </div>
            </form>
        </>
    )

    return content


}

export default EditNoteForm