import React, { useState, useEffect,useContext } from 'react';
import { FirebaseContext } from '../firebase2';

const useValidacion = (stateInicial, validar, fn) => {

    const [valores, guardarValores ] = useState(stateInicial);
    const [errores, guardarErrores ] = useState({});
    const [ submitForm, guardarSubmitForm ] = useState(false);
    const { firebase } = useContext(FirebaseContext);

    useEffect(() => {
        if(submitForm) {
            const noErrores = Object.keys(errores).length === 0;
            if(noErrores) {
                fn(); // Fn = Función que se ejecuta en el componente
                //vuelve valores a inicial
                guardarValores(stateInicial);
            }
            guardarSubmitForm(false);
        }
    }, [errores]);

    // Función que se ejecuta conforme el usuario escribe algo
    const handleChange = e => {
        guardarValores({
            ...valores,
            [e.target.name] : e.target.value
        })
       
    }

    // Función que se ejecuta cuando el usuario hace submit 
    const handleSubmit = e => {
        e.preventDefault();
        const erroresValidacion =validar(valores,firebase);
        guardarErrores(erroresValidacion);
        guardarSubmitForm(true);
    }


    // cuando se realiza el evento de blur (Cuando el usuario sale del input)
    const handleBlur = () => {
        const erroresValidacion = validar(valores);
        guardarErrores(erroresValidacion);
    }

    return {
        valores, 
        errores, 
        handleSubmit,
        handleChange,
        handleBlur,
        guardarValores
    }
}
 
export default useValidacion;