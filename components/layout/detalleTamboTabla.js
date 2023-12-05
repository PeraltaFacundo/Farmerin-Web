import React from 'react';
import Link from 'next/link';
import { Contenedor } from '../../components/ui/Elementos';
import { RiEdit2Line, RiAddBoxLine, RiDeleteBin2Line } from 'react-icons/ri';
import { Row, Container, Col, Accordion, Button } from 'react-bootstrap';
import { toDate } from 'date-fns';

const DetalleTambos = ({ tambo }) => {

   const { id, nombre, ubicacion, bajadas, turnos } = tambo;
   return (

      <tr>
         <td lg={true}>
            <h6>{nombre}</h6>
         </td>
         <td lg={true}>
            <h6>{ubicacion}</h6>
         </td>
         <td lg={true}>
           {turnos}
         </td>
         <td lg={true}>
            {bajadas}
         </td>
         <td lg={true}>
            {bajadas}
         </td>
         <td md="auto">


            <Button
               variant="link"
            >
               <Link
                  href="/tambos/[id]" as={`/tambos/${id}`}
               >
                  <RiEdit2Line size={28} />
               </Link>
            </Button>
            <Button
               variant="link"
            >
               <Link
                  href="/tambos/[id]" as={`/tambos/${id}`}
               >
                  <RiDeleteBin2Line size={28} />
               </Link>
            </Button>


         </td>
      </tr>









   );
}

export default DetalleTambos;