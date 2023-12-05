import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../../firebase2';
import { format } from 'date-fns'
import DetalleCria from './detalleCria';

const DetalleEventoAnimal = ({ evento }) => {

   const { firebase } = useContext(FirebaseContext);
   const { id, fecha, tipo, detalle, crias } = evento;
   const [fevento,setFecha]=useState('');

   useEffect(() => {

      try{
         const f =format(firebase.timeStampToDate(fecha), 'dd/MM/yyyy');
         setFecha(f);
         
      }catch (error){
         setFecha('');
      }

   }, []);

   return (
      <tr>
         <td >
            {fevento}
         </td>

         <td >
            {tipo}
         </td>
         {tipo == 'Parto' ?
            <td >
               {detalle + '/ Crias:'}
               {crias.map(c => (

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


      </tr>
   )
}

export default DetalleEventoAnimal;