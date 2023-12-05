export default function validarCrearTambo(valores) {

    let errores = {};

  
    // validar el email
    if(!valores.descripcion) {
        errores.descripcion = "La descripción es obligaroria";
    }

     return errores;
}