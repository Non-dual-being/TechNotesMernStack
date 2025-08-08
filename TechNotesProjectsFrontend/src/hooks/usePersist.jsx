import { useState, useEffect } from "react"

const usePersist = () => {
    const [persist, setPersist] = useState(() => {
        try {
            const raw = localStorage.getItem("persist");
            if (raw === null) return false; //als de key niet bestaat
            return JSON.parse(raw);
        } catch {
            return false; //falback by corrupte localstorage die niet geparsed kan worden
        }
    });

    useEffect(() => {
        localStorage.setItem("persist", JSON.stringify(persist))
    }, [persist])

    return [persist, setPersist]
}


export default usePersist
/**
 * de OR pakt de rechtkant als het links "", -, false, Nan of null is
 * de ?? pakt alleen recchts als het nul of undefined is
 * localstorga is altijd een string
 * 
 */