import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit"
import { apiSlice } from "../../app/api/apiSlice";

const notesAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.completed === b.completed) 
    ? 0 
    : a.completed
        ? 1
        : -1
});

const initialState = notesAdapter.getInitialState();

/**
 * zonder vooraf definiering is je innitialState 
 * {
 *  ids: [],
 *  enitities: {}
 * }
 */



/**
 * entityadapter normaliseert je data 
 * genormaliseertde data werkt met een array van je ids en een lookup zodat je data op id kunt opzoekemn
 * {
  ids: ['1', '2'],
  entities: {
    '1': { id: '1', name: 'Kevin' },
    '2': { id: '2', name: 'Maarten' }
        }
    }

 */

export const NotesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getNotes: builder.query({
            query: () => ({
                url: '/notes',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                    /**the isError flag in the backend middleware triggers this is error if a error occurs */
                },
            }),
            /*keepUnusedDataFor: 5,*/
            transformResponse: responseData => {
                const loadedNotes = responseData.notes.map(note=> {
                    note.id = note._id
                    return note               
                });

                let message;

                if (responseData.message){
                    message = responseData.message;
                }
                return {
                    ...notesAdapter.setAll(initialState, loadedNotes),
                    message
                }
              
            },
            providesTages: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        {type: 'Note', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Note', id }))
                    ]
                } else return [{ type: 'Note', id: 'LIST'}]
            }
        }),
        addNewNote: builder.mutation({
            query: initialNoteData => ({
                url: '/notes',
                method: 'POST',
                body: {
                    ...initialNoteData
                }
            }),
            invalidatesTags: [
                { type: 'Note', tag: 'LIST'}
            ]
        }),
        updateNote: builder.mutation({
            query: initialNoteData => ({
                url: '/notes',
                method: 'PATCH',
                body : {
                    ...initialNoteData
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Note', id: arg.id}
            ]
        }),
        deleteNote: builder.mutation({
            query: ({ id }) => ({
                url: '/notes',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [{
                type: 'Note',
                id: arg.id
            }]
        })
    })
})


/**
 * 
 * bij een error komt je error te staan onder de error key van je state
 * state.api.queries = {
  "getNotes(undefined)": {
    status: "fulfilled",
    data: { ids: [...], entities: {...} },
    ...
  }
}

 */

/**
 * je api is je reducerpaht in je store, dat is simpelweg je mapje waar je slice staat
 * dan je getNotes is je methode en je undefined wel zeggen gaan verder argumenten binnen die fetch request
 * bij een error wordt je data undeifned en in je error key vang je de message op
 */

/**de hook is automatisch aangemaakt, use Query en dan de naam van de methode */

export const {
    useGetNotesQuery,
    useAddNewNoteMutation,
    useUpdateNoteMutation,
    useDeleteNoteMutation
} = NotesApiSlice;

// returns the query result object
export const selectNotesResult = NotesApiSlice.endpoints.getNotes.select();


//creates memoized selector
const selectNotesData = createSelector(
    selectNotesResult,
    NotesResult => NotesResult.data //genormaliseerde data met de ids en entities
);

//getSelectors creates these seleectors which we rename using destructuring
export const {
    selectAll: selectAllNotes,
    selectById: selectNotebyId,
    selectIds: selectNotesIds
} = notesAdapter.getSelectors(state => selectNotesData(state) ?? initialState);


/**
 * de state hier komt van je store dus state = store.getstate()
 * dat is bijvoorbeeldd ook je Notes
 * en dan met selectNotesResult ga je slice eruit filterend horend bij de eindpoint getNotes en de data die hier gefetcht wrodt (all je Notes)
 * daarin zit ok je error en je fulfilled etc, die filterje eruit met je selectNotesdata
 * en dat je selector fitlter is Notes Notes of ids eruit
 * dus in de getselector zit al die filtering er automatisch in
 * 
 * *ALLE data komt hier uit je cache
 */