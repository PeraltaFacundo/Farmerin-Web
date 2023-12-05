export default function validarIniciarSesion(valores) {

    let errores = {};

  
    // validar el email
    if(!valores.email) {
        errores.email = "El Email es Obligatorio";
    } else if( !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(valores.email) ) {
        errores.email = "Email no válido"
    }

    // validar el password
    if(!valores.password) {
        errores.password = "La contraseña es obligatoria";
    } else if( valores.password.length < 6 ) {
        errores.password = 'La contraseña debe ser de al menos 6 caracteres'
    }

    return errores;
}