import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../../firebase2'
import { format } from 'date-fns'
import { RiCheckDoubleLine, RiCheckLine, RiAddBoxLine } from 'react-icons/ri';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import DetalleCria from './detalleCria';
import FichaAnimal from './fichaAnimal';

const DetalleEvento = ({ evento, eventos, guardarEventos }) => {
   //usuario.uid
   const { firebase, usuario } = useContext(FirebaseContext);
   const { id, fecha, tipo, detalle, vistoUsuario, crias, rp, erp, animal, fevento } = evento;
   const [show, setShow] = useState(false);
   const [visto, setVisto] = useState(false);
   const handleShow = () => { setShow(true) };

   useEffect(() => {
     
      //chequea que el usuario haya visto el evento
      if (vistoUsuario) {
    
      
            if (vistoUsuario.indexOf(usuario.uid) != -1) {
               setVisto(true);
            } else {
               setVisto(false);
            }
  
      } else {
         setVisto(false);
      }
     

   }, [])

   function cambiarVisto() {

      const eventosAct = eventos.map(e => {
         // Revisamos que la llave recibida coincida con el elemento que queremos actualizar
         if (e.id === id) {
            // Actualizamos la racion
            async function fEditar(e) {

               try {

                  if (e.vistoUsuario) {
                        e.vistoUsuario.push(usuario.uid);
                        setVisto(true);
                  }else{
                     e.vistoUsuario=[usuario.uid];
                     setVisto(true);
                  }
                  await firebase.db.collection('animal').doc(animal.id).collection('eventos').doc(e.id).update(e);
                  return e;
               } catch (error) {
                  console.log(error.message);
                  return e;

               }
            }
            fEditar(e);

         }
         // Si no es el elemento que deseamos actualizar lo regresamos tal como está
         return e;

      });
      guardarEventos(eventosAct);

   };

   return (
      <>
         <tr>
            <td >
               {fevento}
            </td>
            <td >
               {rp}
               <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip >Ficha</Tooltip>}
               >
                  <Button
                     variant="link"
                     onClick={handleShow}
                  >
                     <RiAddBoxLine size={22} />
                  </Button>
               </OverlayTrigger>
            </td>

            <td >
               {tipo}
            </td>
            {tipo == 'Parto' ?
               <td >
                  {detalle + '/ Crias:'}
                  {crias && crias.map(c => (

                     <DetalleCria
                        key={c.id}
                        cria={c}
                     />

                  )
                  )}
               </td>
               :
               <td >
                  {detalle}
               </td>
            }
            <td >
               {erp}
            </td>
            <td >
               {evento.usuario}
            </td>
            <td >
               {visto ?
                  <RiCheckDoubleLine size={24} />
                  :
                  <Button
                     variant="link"
                     onClick={cambiarVisto}
                  >
                     <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip >Marcar</Tooltip>}
                     >

                        <RiCheckLine size={24} />
                     </OverlayTrigger>
                  </Button>

               }
            </td>
         </tr>
         {show &&
            <FichaAnimal
               animal={animal}
               show={show}
               setShow={setShow}
            />
         }
      </>
   )
}

export default DetalleEvento;