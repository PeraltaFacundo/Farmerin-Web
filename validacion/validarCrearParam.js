export default function validarCrearTambo(valores) {

    let errores = {};

    if(valores.condicion=="entre" || valores.condicion=="menor") {
    if(!valores.min) {
        errores.min = "Este valor es obligatorio";
    }
    }

    if(valores.condicion=="entre" || valores.condicion=="mayor") {
        if (!valores.max){
            errores.max = "Este valor es obligatorio";
        }else{
            if (parseInt(valores.max) <=parseInt(valores.min)){
                errores.max = "El máximo debe ser mayor al mínimo";
            }
        }
    }
    
    if(!valores.racion) {
        errores.racion = "Este valor es obligatorio";
    }
     return errores;
}