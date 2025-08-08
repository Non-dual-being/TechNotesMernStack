import { store } from '../../app/Store'
import { NotesApiSlice } from '../notes/notesApiSlice'
import { usersApiSlice } from '../users/usersApiSlice'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

const Prefetch = () => {
  useEffect(() => {
  /**OLD CODE instead op initating , we want to actualy get the data and query of our hooks made in the slice */
  /*  
   
    const notes = store.dispatch(NotesApiSlice.endpoints.getNotes.initiate())
    const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate()) 
    
  */
    store.dispatch(NotesApiSlice.util.prefetch('getNotes', 'notesList', {force: true}))
    store.dispatch(usersApiSlice.util.prefetch('getUsers', 'usersList', {force: true}))


    /**OLD CLEAN UP BASE UPON THE INITIATIE */
      /*     return () => {
            console.log('unsubscribing')
            notes.unsubscribe();
            users.unsubscribe();
          }
      */

  }, [])
  return <Outlet />
}

export default Prefetch
/**old explanation */
/**
 * empty depency array, only run when the components mount, so data will render after a user routes to a proteced page 
 * manual subscription to notes and users (get)
 * The manual subscription is getting the data and combining it with a subssciption
 * unsubscripting when leaving the proteced page\
 * the outlet  are the children
 * 
 * 
 */

/**
 * Prefetch Component
 * ------------------
 * 
 * Deze component wordt geladen voordat een gebruiker toegang krijgt tot beschermde routes.
 * 
 * ⚡ Gebruik van `.util.prefetch()` i.p.v. `.initiate()`:
 * - `.initiate()` triggert direct een query en geeft een subscription object terug.
 *   Het is geschikt als je handmatig een request wil starten én de data meteen wil gebruiken.
 *   ➤ Werkt goed als je imperatief data nodig hebt binnen een functie of event handler.
 * 
 * - `.util.prefetch()` daarentegen vraagt React-Redux Toolkit Query om een fetch *voor te bereiden*.
 *   Het checkt eerst of de data in de cache aanwezig is, en als je `force: true` opgeeft, wordt er sowieso opnieuw opgehaald.
 *   ➤ Dit is ideaal voor voorspellende data-ophaling: de data is beschikbaar *vóór* de pagina wordt weergegeven.
 * 
 * 🧠 Waarom prefetch in `useEffect`?
 * - De `useEffect` met lege dependency-array zorgt dat de prefetch enkel wordt uitgevoerd bij het mounten van de component.
 * - We geven cache keys op ('notesList' en 'usersList') zodat RTK Query weet hoe deze request in de cache moet worden opgeslagen.
 * 
 * 🔄 Unsubscribing:
 * - Omdat `.initiate()` gebruikt zou worden om een subscription object te krijgen (zoals in de oude code), kon je die unsubscriben.
 * - Maar `.util.prefetch()` geeft géén subscription terug, en doet een fetch zonder component te binden aan de data.
 *   ➤ Dus: je kunt `unsubscribe()` niet meer aanroepen zoals eerder gedaan werd met `notes.unsubscribe()` en `users.unsubscribe()`.
 *   ➤ Die regels kunnen in dit geval worden verwijderd, tenzij je `.initiate()` terug zou gebruiken.
 * 
 * 🎯 Resultaat:
 * - De kinderen in `<Outlet />` (zoals pagina's die gebruik maken van `useGetNotesQuery`) zullen direct toegang hebben tot
 *   reeds geprefetchte data, wat leidt tot snellere laadtijden en minder wachttijd.
 */


/**
 * ✅ RTK Query - Prefetch vs useGetXQuery hook - Uitleg en gedrag
 * ---------------------------------------------------------------
 * 
 * Dit project maakt gebruik van RTK Query voor data-ophaling. Twee belangrijke mechanismen zijn:
 * 
 * 🔹 1. `prefetch()` — Vooraf data ophalen (zonder subscription)
 * 🔹 2. `useGetXQuery()` — Data ophalen én automatisch up-to-date blijven (met subscription)
 * 
 * ---------------------------------------------------------------
 * 
 * 🧠 Verschil in gedrag:
 * 
 * ▶ `prefetch('endpoint', 'cacheKey', { force: true })`
 *    - Haalt data op en slaat deze op in de cache.
 *    - Doet dit nog vóór een component gemount is.
 *    - Forceert ophalen, zelfs als er al cache aanwezig is.
 *    - ❌ Maakt **géén subscription** aan → de component die later mount weet hier nog niets van.
 *    - ⏱️ De data blijft alleen tijdelijk in de cache (standaard 60 sec via `keepUnusedDataFor`)
 *    - ✅ Ideaal voor snelle laadtijd: component hoeft niet meer te wachten op data bij mount.
 * 
 * ▶ `useGetXQuery('cacheKey')`
 *    - Declaratieve React hook voor data-ophaling en binding.
 *    - ✅ Haalt data op **als deze nog niet in cache staat**.
 *    - ✅ Gebruikt geprefetchte data direct als die nog geldig is.
 *    - ✅ Voegt een **subscription** toe: blijft automatisch synchroon met de cache.
 *    - ✅ Ondersteunt polling, refetch bij focus, enz.
 *    - ❌ Triggered enkel fetch bij mount als de cache leeg/verlopen is.
 * 
 * ---------------------------------------------------------------
 * 
 * 📈 Voorbeeld flow:
 * 
 * 1. Bij routing:
 *    store.dispatch(api.util.prefetch('getNotes', 'notesList', { force: true }));
 * 
 *    ➤ Forceert ophalen van 'notesList' en stopt in cache.
 * 
 * 2. 10 seconden later, component mount:
 *    const { data } = useGetNotesQuery('notesList');
 * 
 *    ➤ Detecteert dat er al cache is → gebruikt de data direct.
 *    ➤ Hook voegt een subscription toe → cache blijft actief.
 * 
 * 3. Component blijft up-to-date:
 *    - Polling of refetching worden automatisch afgehandeld.
 * 
 * ---------------------------------------------------------------
 * 
 * 🧼 Waarom geen `unsubscribe()` bij prefetch?
 *    - `prefetch()` geeft geen subscription-object terug.
 *    - Alleen `.initiate()` geeft dat (voor handmatige imperatieve fetches).
 * 
 * 📦 Waarom `force: true` gebruiken?
 *    - Om er zeker van te zijn dat de data vers is (en geen verouderde cache gebruikt wordt).
 *    - Handig bij routing-gestuurde prefetching of gevoelige data.
 * 
 * ---------------------------------------------------------------
 * 
 * ✅ Conclusie:
 * 
 * - Gebruik `prefetch()` voor **voorspellende data-ophaling vóór component mount**.
 * - Gebruik `useGetXQuery()` in je component om de data te **consumeren én up-to-date te blijven**.
 * - De combinatie van beide zorgt voor een snelle, reactieve en schaalbare dataflow.
 */
