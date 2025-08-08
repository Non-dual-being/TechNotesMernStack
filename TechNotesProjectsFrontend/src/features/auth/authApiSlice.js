import { apiSlice } from "../../app/api/apiSlice";
import { logOut, setCredentials } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/auth',
                method: 'POST',
                body: { ...credentials}, //username && password
                credentials: 'include'
            })
        }),
        sendLogout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST'
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled}) {
                try {
                    const { data } = await queryFulfilled /** this would be cookie cleared */
                
                    //token to null in local state
                    dispatch(logOut())

                    /**
                     * clear out cache, the timeout is to make sure when you logout from
                     * notes list or userlist
                     * that the unsubscribing kicks in en the component is umountend
                     * see the prefetch 
                    */


                    setTimeout(() => {
                      dispatch(apiSlice.util.resetApiState())
                    }, 500)
              

                    } catch (err) {
                    console.log(err);

                    //using dispatch in onquery started enables it to use it without using dispatch in the forms
                }
            }
        }),
        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET'
            }),
            async onQueryStarted(arg, {dispatch, queryFulfilled}){
                try {
                    const { data } = await queryFulfilled
                    const { accessToken } = data
                    dispatch(setCredentials({ accessToken }))
                } catch (err) {
                    console.log(err)
                }
            }
        })
    })
})

export const {
    useLoginMutation,
    useSendLogoutMutation,
    useRefreshMutation,
} = authApiSlice