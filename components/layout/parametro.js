import React, { useContext, useEffect } from 'react'
import { Botonera, Mensaje, ContenedorSpinner, Contenedor } from '../../components/ui/Elementos';
import { FirebaseContext } from '../../firebase2';
import Link from 'next/link';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { RiArrowDownLine, RiArrowUpLine, RiDeleteBin2Line, RiSubtractLine, RiEdit2Line } from 'react-icons/ri';


const Parametro = ({ parametro, parametros, guardarParametros, porcentaje }) => {

   const { id, idtambo, orden, condicion, min, max, um, racion } = parametro;
   const { firebase, usuario } = useContext(FirebaseContext);

   const handleDown = () => {
      const parOrd = parametros.map(p => {
         // Revisamos que el id recibido coincida con el elemento que queremos actualizar
         if (p.id === id) {
            // Actualizamos el orden
            p.orden += 1;
            try {
               firebase.db.collection('parametro').doc(p.id).update(p);
            } catch (error) {
               console.log(error);
            }
            // Regresamos el nuevo elemento con el orden actualizad
            return p;
         }
         //Si es el anterior le sumo uno
         if (p.orden === orden + 1) {
            p.orden -= 1;
            try {
               firebase.db.collection('parametro').doc(p.id).update(p);
            } catch (error) {
               console.log(error);
            }
            // Regresamos el nuevo elemento con el orden actualizado
            return p;

         }
         // Si no es el elemento que deseamos actualizar lo regresamos tal como está
         return p;
      });

      parOrd.sort(function (a, b) {
         if (a.orden > b.orden) {
            return 1;
         }
         if (a.orden < b.orden) {
            return -1;
         }
         // a must be equal to b
         return 0;
      });

      //actualizamos state
      guardarParametros(parOrd);

   };

   function handleUp() {

      //console.log(parametros);
      const parOrd = parametros.map(p => {
         // Revisamos que la llave recibida coincida con el elemento que queremos actualizar
         if (p.id === id) {
            // Actualizamos el orden
            p.orden -= 1;
            try {
               firebase.db.collection('parametro').doc(p.id).update(p);
            } catch (error) {
               console.log(error);
            }
            // Regresamos el nuevo elemento con el orden actualizad
            return p;
         }
         //Si el el anterior le sumo uno
         if (p.orden === orden - 1) {
            p.orden += 1;
            try {
               firebase.db.collection('parametro').doc(p.id).update(p);
            } catch (error) {
               console.log(error);
            }
            // Regresamos el nuevo elemento con el orden actualizado
            return p;

         }
         // Si no es el elemento que deseamos actualizar lo regresamos tal como está
         return p;
      });

      parOrd.sort(function (a, b) {
         if (a.orden > b.orden) {
            return 1;
         }
         if (a.orden < b.orden) {
            return -1;
         }
         // a must be equal to b
         return 0;
      });

      //actualizamos state
      guardarParametros(parOrd);

   };

   function eliminarParam() {

      try {
         firebase.db.collection('parametro').doc(id).delete();
      } catch (error) {
         console.log(error);
      }
      const filtro = parametros.filter(p => p.id !== id);
      let ord = 1;
      filtro.map(function (param, i) {
         param.orden = ord;
         //actualiza el orden de los parámetros restantes
         try {
            firebase.db.collection('parametro').doc(param.id).update(param);
         } catch (error) {
            console.log(error);
         }
         ord++;

      })
      guardarParametros(filtro);


   };


   return (


      <tr>
         <td >
            <h6>{orden}</h6>
         </td>
         <td >
            <h6>{condicion}</h6>
         </td>
         <td >
            <h6>{min}</h6>
         </td>
         <td >
            <h6>{max}</h6>
         </td>
         <td >
            <h6>{um}</h6>
         </td>
         <td >
            <h6>{racion}</h6>
         </td>
         <td>
            <OverlayTrigger
               placement="bottom"
               overlay={<Tooltip >Eliminar</Tooltip>}
            >
               <Button
                  variant="link"
                  onClick={eliminarParam}
               >
                  <RiDeleteBin2Line size={24} />
               </Button>
            </OverlayTrigger>

            <Link
               href="/parametros/[id]" as={`/parametros/${id}`}

            >

               <Button
                  variant="link"

               >
                  <OverlayTrigger
                     placement="bottom"
                     overlay={<Tooltip >Editar</Tooltip>}
                  >
                     <RiEdit2Line size={24} />
                  </OverlayTrigger>
               </Button>

            </Link>

            {(orden != 1) ?
               <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip >Subir</Tooltip>}
               >
                  <Button
                     variant="link"
                     onClick={handleUp}
                  >
                     <RiArrowUpLine size={24} />
                  </Button>
               </OverlayTrigger>
               :
               <Button
                  variant="link"
               >
                  <RiSubtractLine size={24} />
               </Button>

            }

            {(orden != parametros.length) ?
               <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip >Bajar</Tooltip>}
               >
                  <Button
                     variant="link"
                     onClick={handleDown}
                  >
                     <RiArrowDownLine size={24} />
                  </Button>
               </OverlayTrigger>
               :
               <Button
                  variant="link"
               >
                  <RiSubtractLine size={24} />
               </Button>
            }

         </td>
      </tr>

   )

}

export default Parametro;