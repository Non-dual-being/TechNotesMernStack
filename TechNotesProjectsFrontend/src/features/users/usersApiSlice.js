import {
    createSelector,
    createEntityAdapter,
    bindActionCreators
} from "@reduxjs/toolkit"
import { apiSlice } from "../../app/api/apiSlice";

const usersAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.active === b.active)
        ? 0
        : a.active
            ? 1
            : -1
});

const initialState = usersAdapter.getInitialState();

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

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => ({
                url: '/users',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                 },

            }),
    
            /*
                *keepUnusedDataFor: 5,
                this holds the data for 5 seconds an then the chache loses its active subscription voor get users   
                
            */
            transformResponse: responseData => {
                const loadedUsers = responseData.users.map(user => {
                    user.id = user._id
                    return user
                })


                let message;

                if (typeof responseData.message === "string" && responseData.message.length) {
                    message = responseData.message
                } else {
                    message = '';
                }
                return {
                    ...usersAdapter.setAll(initialState, loadedUsers),
                    message
                }
                /**je spread je users data zodat je je message als key value er aan kan toevoegen */
              
            },
            providesTags: (result, error, arg) => {
                if (result?.ids?.length) {
                    return [
                        {type: 'User', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'User', id }))
                    ]
                } else return [{ type: 'User', id: 'LIST'}]
            }
        }),
        addNewUser: builder.mutation({
            query: initialUserData => ({
                url: '/users',
                method: 'POST',
                body: {
                    ...initialUserData,
                }
            }),
            invalidatesTags: [
                { type: 'User', id: "LIST"}
            ]
        }),
        updateUser: builder.mutation({
            query: initialUserData => ({
                url: '/users',
                method: 'PATCH',
                body: {
                    ...initialUserData
                }
            }),
            invalidatesTags: (result, error, arg) =>  [
                { type: 'User', id: arg.id }
            ]
        }),
        deleteUser: builder.mutation({
            query: ({ id }) => ({
               url: '/users',
               method: 'DELETE',
               body: { id } /**dit is short hand voor id: id */
            }),

            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: arg.id }
        
                /**orginele arugment is het hele object, ook decontrueer je in je query (staat er los van) */
            ]
        })
    })
})

/**
 * bij de query de () zijn om het object als object op te sturen en niet als losse arugmenten
 * anders moet je een object maken en die returnen
 */


/**
 * 
 * bij een error komt je error te staan onder de error key van je state
 * state.api.queries = {
  "getUsers(undefined)": {
    status: "fulfilled",
    data: { ids: [...], entities: {...} },
    ...
  }
}

 */

/**
 * je api is je reducerpaht in je store, dat is simpelweg je mapje waar je slice staat
 * dan je getusers is je methode en je undefined wel zeggen gaan verder argumenten binnen die fetch request
 * bij een error wordt je data undeifned en in je error key vang je de message op
 */

/**de hook is automatisch aangemaakt, use Query en dan de naam van de methode */

export const {
    useGetUsersQuery,
    useAddNewUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation
} = usersApiSlice;

// returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();


//creates memoized selector
const selectUsersData = createSelector(
    selectUsersResult,
    usersResult => usersResult.data //genormaliseerde data met de ids en entities
);

//getSelectors creates these seleectors which we rename using destructuring
export const {
    selectAll: selectAllusers,
    selectById: selectUserbyId,
    selectIds: selectUsersIds
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState);


/**
 * de state hier komt van je store dus state = store.getstate()
 * dat is bijvoorbeeldd ook je notes
 * en dan met selectUsersResult ga je slice eruit filterend horend bij de eindpoint getusers en de data die hier gefetcht wrodt (all je users)
 * daarin zit ok je error en je fulfilled etc, die filterje eruit met je selectusersdata
 * en dat je selector fitlter is user, users of ids eruit
 * dus in de getselector zit al die filtering er automatisch in
 * 
 * *ALLE data komt hier uit je cache
 */