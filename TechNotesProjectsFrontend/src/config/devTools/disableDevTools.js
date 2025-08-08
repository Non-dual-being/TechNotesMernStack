const disableReactDevTools = () => {
    //alleen in productie functies uitzetten
    if (!import.meta.env.PROD) return;

    const hook = globalThis.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!hook || typeof hook !== 'Object') return;

    //probeer alle methodes/velden onschadelijk te maken
    for (const key of Object.keys(hook)){
        try {
            hook[key] = typeof hook[key] === 'function' 
                ? () => {}
                : null;
        } catch {
            //fouten negeren als ze zich voordoen
        }
    }
    
    // Extra: probeer het object te bevriezen zodat het niet opnieuw kan worden ingesteld
    try {
        Object.freeze(hook)

    } catch {}


}

export default disableReactDevTools;


/** *-----------------[uitleg devToolsHook]------------*
 * import.meta.env.pro -----> kijkt op je in productie draait
 * Dan `globalTHis` is een universele naam voor het globale Object in JS
 * Als je script in de browser draait is het window, daar het in nodejs dan is het gliobal en in Web Workers is het self
 * globalThis pakt dus ongeact je omgeving altijd het globale object
 * 
 * 
 * De keuze voor for of is dat je alleen de eigen object keys pakt en niet de geerfde 
 * Geen for each hier omdat for each alleen op arrays werkt en minder controle heeft
 * for of is vaak sneller dan foreach
 * 
 */