import React, { useState, useContext, useEffect, useRef } from 'react';
import { FirebaseContext } from '../../firebase2';
//import Overlay from 'react-overlays/Overlay';
import { RiReplyLine } from 'react-icons/ri';
import { Alert, Form, Button, Overlay, OverlayTrigger, Tooltip } from 'react-bootstrap';
import differenceInDays from 'date-fns/differenceInDays';
import { format } from 'date-fns'

const DetalleControl = ({ animal, animales, guardarAnimales }) => {

   const { id, rp, lactancia, estrep, fparto, fservicio, categoria, racion, uc, ca, anorm, sugerido, rodeo, actu, diasLact,diasPre,fuc,fracion } = animal;
   const [sug, guardarSug] = useState(0);
   const [error, guardarError] = useState(false);
   const [descError, guardarDescError] = useState('');
   const [colorCelda, guardarColorCelda] = useState('');
   const target = useRef(null);
   const { firebase, usuario } = useContext(FirebaseContext);

   useEffect(() => {
      guardarSug(sugerido);
      guardarColorCelda('text-info');
      if (Number.parseInt(sugerido) < Number.parseInt(racion)) guardarColorCelda('text-danger');
      if (Number.parseInt(sugerido) > Number.parseInt(racion)) guardarColorCelda('text-success');

   }, []);

   function cambiarRacion() {
      guardarError(false);
      //console.log(parametros);
      const animalesAct = animales.map(a => {
         // Revisamos que la llave recibida coincida con el elemento que queremos actualizar
         if (a.id === id) {
            // Actualizamos la racion
            async function fEditar(a) {
               let racionAnt = a.racion;
               let racionManual=false;
               try {
                  a.racion = sug;
                  a.fracion = firebase.nowTimeStamp();
                  a.actu = true;
                  //si cambia a mano lo pongo en true
                  if (sug!=a.sugerido){
                     racionManual=true;
                  }
                  const anim = {
                     racion: a.racion,
                     fracion: a.fracion,
                     racionManual:racionManual
                  }
                  await firebase.db.collection('animal').doc(a.id).update(anim);
                  return a;

               } catch (error) {
                  //volvemos atrás el cambio si hay un error
                  a.racion = racionAnt;
                  a.actu = false;
                  guardarDescError(error.message);
                  guardarError(true);
                  return a;

               }
            }
            fEditar(a);

         }
         // Si no es el elemento que deseamos actualizar lo regresamos tal como está
         return a;
      });

      guardarAnimales(animalesAct);

   };

   // Función que se ejecuta conforme el usuario escribe algo
   const changeSugerido = e => {
      //console.log('cambiar sugerido');
      guardarSug(e.target.value);
      
   }
    let formattedDate=""
   console.log("fuc:",fuc, rp)
   console.log("firebase:",firebase.timeStampToDate(fuc))
   try {
       formattedDate = format(firebase.timeStampToDate(fuc), 'dd/MM/yyyy')
      console.log("formattedDate:", formattedDate, rp)
   }catch(error){console.log(error, rp)}
   return (


      <tr>
         <td >{rp} </td>
         <td >{lactancia}</td>
         <td >{categoria}</td>
         <td >{rodeo}</td>
         <td >{parseFloat(uc).toFixed( 2 )}</td>
         <td >{formattedDate} </td>
         <td >{parseFloat(ca).toFixed( 2 )}</td>
         <td >{anorm}</td>
         <td >{diasLact}</td>
         <td >{estrep}</td>
         <td >{diasPre}</td>
         <td  >{racion}
            <Overlay target={target.current} show={actu} placement="left">
               {({ placement, arrowProps, show: _show, popper, ...props }) => (
                  <div
                     {...props}
                     style={{
                        backgroundColor: 'rgba(30, 144, 255, 0.60)',
                        padding: '2px 2px',
                        color: 'white',
                        borderRadius: 3,
                        ...props.style,
                     }}
                  >
                     Modific.
                  </div>
               )}
            </Overlay>
         </td>
         <td >{format(firebase.timeStampToDate(fracion), 'dd/MM/yyyy')}
         </td>
         
         <td>

            <Button
               ref={target}
               variant="link"
               size="sm"
               onClick={cambiarRacion}
            > <OverlayTrigger
               placement="bottom"
               overlay={<Tooltip >Cambiar Racion</Tooltip>}
            >
                  <RiReplyLine size={20} />
               </OverlayTrigger>
            </Button>
         </td>
         <td>
            <Form.Control
               class={colorCelda}
               type="number"
               id="sug"
               placeholder="Kg"
               name="sug"
               min="1"
               size="2"
               max="50"
               value={sug}
               onChange={changeSugerido}

            />


            <Alert variant="danger" show={error} >
               <Alert.Heading>Oops! Se ha producido un error!</Alert.Heading>
               <p>{descError}</p>
            </Alert>

         </td>


      </tr>


   );
}

export default DetalleControl;