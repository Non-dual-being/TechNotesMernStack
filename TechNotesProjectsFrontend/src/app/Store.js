import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "../features/auth/authSlice";



export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: import.meta.env.Dev /**alleem in Development true zetten */
})

setupListeners(store.dispatch)

/**
 * devTools maakt het mogelijk in de brwoser state verandedringen te zien
 * De store slaat alle data op in 1 centrale plek
 * De state koppelt slices (stukjes van de data) aan een reducer
 * Maakt het ophalen van stukjes data mogelijk in je componenten
 * Ondersteunt middleware en debugging
 * 
 *  *-------{ computed property [] } ----------*
 * computed proberty of dynamisch sleutel pakt dynamische de waarde 
 * apiSlice.reducerpath is in dit geval de api folder, dus met haakjes pakt je die waarde
 * gaat om een namepsace, dus geen fysieke locatie. 
 * 
 * *----{ concat }
 * aan de standaard middleware wordt de RTK query middleware toegegevoegd
 * Dit is nodig voor fetchen, cachen, en autoamtisch refechen van data
 * 
 * *--{packages}*'
 * createapislice maakt het automatische de reducer, reducerpath en andere functionaliteit aan
 * createapi is onderdeel van RTKQ query wat op zijn beurt onderdeel is van Redux tookkit
 * 
 */