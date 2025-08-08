import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../../features/auth/authSlice'

const shouldAttemptRefresh = (url) => !url.startsWith('/auth');


const baseQuery = fetchBaseQuery({
    baseUrl: 'https://technotes-api-qgcr.onrender.com/',
    credentials: 'include', //that way we wil allway send our cookie
    prepareHeaders: (headers, { getState, endpoint, type }) => {

        const token = getState().auth.token 
        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        } else {
            headers.delete('authorization')
        }
        return headers
    }
})

/**
 * specifiek function prepareHeaders within fetchBaseQuery
 * prepareHeader is specific to fetchbasequre en the object within the perpare headers is spefifciek to that function
 * In he backend moet Acces-Control-Allow-Credentioals: true aanstaan in combi met CORS
 */

const baseQueryWithReauth = async (args, api, extraOptions) => {
    //console.log(args) //request url, method, body
    //console.log(api) // signal, dispatch, getSate(
    //console.log(extraOptions) //custom like { shout: true}

    const origUrl = typeof args === 'string' ? args : args.url

    let result = await baseQuery(args, api, extraOptions)

    if ((result?.error?.status === 403  || result?.error?.status === 401) && shouldAttemptRefresh(origUrl)){

        /**
         * 403 forbidden is al er een token is, maar hij is verlopen
         * 401 is al er geen token is, en dus geen Authorization header met een bearer
         * Heeft te maken met je redux state als die de token op null heeft staan of een token heeft die verlopen is
         * 
         */

        //send refresh token to get new acces token
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

        /**
         * je refresh cookie wordt met de include optie automatisch meeverenden
         * je api is je hulpgereedschap van redux tookit dus je dispatch of je getstate
         * 
         */
        
        if (refreshResult?.data) {
            //store the new token
            api.dispatch(setCredentials({...refreshResult.data }))

            //retry original query with new acces token
            result = await baseQuery(args, api, extraOptions) // in args zit je users, je notes en je body etc

        } else {
            if (refreshResult?.error?.status === 403){
                refreshResult.error.data.message = "your login has expired. "
                
            }
            return refreshResult
        }   
    }
    return result   
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth, 
    /**
     * In de baseQuery With Reauth zit ook de basequery met de headers waarin de token wordt opgslagne
     * In de back wordt daarop gecontroleerd
     * De refreshtoken wordt ingezet om een accestoken  op te halen met een get request waarin de refreshtoken zit
     */

    tagTypes: ['Note', 'User'],
    endpoints: builder => ({

    })
})



/**
 * apiSlice met fetchBaseQuery
 * ----------------------------
 * Deze slice gebruikt fetchBaseQuery als baseQuery, wat het volgende mogelijk maakt:
 * 
 * ✅ Base URL injectie:
 *    Alle endpoints gebruiken automatisch de base URL 'http://localhost:3500',
 *    dus je hoeft enkel het pad (zoals '/users') te specificeren in je query/mutation.
 * 
 * ✅ Automatisch JSON-verwerking:
 *    Responses worden automatisch geparsed naar JSON (net als fetch().json()).
 * 
 * ✅ Error handling:
 *    Foutcodes zoals 404 of 500 worden netjes doorgegeven aan je component via RTK Query.
 * 
 * ✅ Headers aanpassen:
 *    Via 'prepareHeaders' kun je headers instellen, zoals Authorization tokens,
 *    die dynamisch uit je Redux store komen (bijv. getState().auth.token).
 * 
 * ✅ Minder boilerplate:
 *    Je hoeft geen fetch(), try-catch of JSON.parse te schrijven in elk endpoint.
 * 
 * ✅ Te combineren met providesTags / invalidatesTags voor caching!
 * 
 * fetchBaseQuery is ideaal als je:
 * - Snel een REST API wil integreren
 * - Geen externe dependencies (zoals axios) wil
 * - Een simpele maar uitbreidbare basis nodig hebt
 */
