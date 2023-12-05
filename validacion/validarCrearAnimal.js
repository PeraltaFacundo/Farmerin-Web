import { format } from 'date-fns'
export default function validarCrearAnimal(valores) {

    let errores = {};

    //valida que tenga tambo asociado
    if (valores.idtambo == '0') {
        errores.idtambo = "Debe seleccionar un tambo!";
    }

    //valida que el erp tenga 15 digitos
    if (valores.erp) {
        if (valores.erp.length) {
            if (valores.erp.length != 15) {
                errores.erp = "El eRP debe ser de 15 dígitos";
            }
        }
    }

    // controla categoria
    if (valores.lactancia > 1) {
        valores.categoria = "Vaca";
    } else {
        valores.categoria = "Vaquillona";
    }

    //valida que si tiene una lactancia tenga fecha de parto
    if ((valores.estpro == 'En Ordeñe') && (!valores.fparto)) {
        errores.fparto = "Debe ingresar la fecha del último parto";
    }

    
    if (valores.estrep == 'preñada') {
        //si el numero de serivicio no está seteado o es cero, lo pongo en uno
        if(!valores.nservicio || valores.nservicio==0){
            valores.nservicio=1;
        }
        //valida  si está preñada tenga fecha de servicio
        if (!valores.fservicio) {
            errores.fservicio = "Debe ingresar la fecha del último servicio";
        }
    }else{
        //no tiene servicios
        valores.nservicio=0;
    }
    //si no esta definido la fecha del ultimo control le pongo la de hoy
    if (valores.uc<0) {
        errores.uc = "Litros incorrectos";
    }
    //si no esta definido la fecha del ultimo control le pongo la de hoy
    if (!valores.fuc){
        valores.fuc=format(Date.now(), 'yyyy-MM-dd');
    }

    //si no esta definido la fecha de actualziacion de raciom
    if (!valores.fracion){
        valores.fracion=format(Date.now(), 'yyyy-MM-dd');
    }

     //si no esta definido el control anterior lo pongo en cero
    if (!valores.ca){
        valores.ca=0;
    }

    //si no esta definida la anormalidad, la completo
    if (!valores.anorm){
        valores.anorm="";
    }

    //si no esta definida la fecha de baja, la completo
    if (!valores.fbaja){
        valores.fbaja="";
        valores.mbaja="";
    }


    return errores;
}