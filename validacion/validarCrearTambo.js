export default function validarCrearTambo(valores) {

    let errores = {};

  
    // validar el email
    if(!valores.nombre) {
        errores.nombre = "El Nombre es Obligatorio";
    }

    if(valores.turnos<0) {
        errores.turnos = "Los turnos no pueden ser menores a 0";
    }

    if(valores.turnos>4) {
        errores.turnos = "No puede haber más de 4 turnos";
    }

    if(valores.bajadas<0) {
        errores.bajadas = "Las bajadas no pueden ser menores a 0";
    }

    if(valores.tolvas<0) {
        errores.tolvas = "Las tolvas no pueden ser menores a 0";
    }

     return errores;
}