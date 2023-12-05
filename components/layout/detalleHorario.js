import React, { useState } from 'react';
import moment from 'moment';

const DetalleHorario = ({ horario}) => {

   const { turno,inicio,fin } = horario;


   return (
 
         <tr>
            <td >
               {turno}
            </td>

            <td >
               {moment(inicio).format("HH:mm")}
            </td>
            <td >
               {moment(fin).format("HH:mm")}
            </td>

         </tr>

   );
}

export default DetalleHorario;