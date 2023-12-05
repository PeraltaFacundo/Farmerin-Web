import React, { useState, useEffect } from 'react';
import { RiAddBoxLine } from 'react-icons/ri';
import FichaAnimal from './fichaAnimal';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import differenceInDays from 'date-fns/differenceInDays'
import { format } from 'date-fns'

const DetalleGralAnimal = ({ animal }) => {

   const { id, idtambo, rp, erp, racion, lactancia, ingreso, observaciones, estpro, estrep, fparto, fservicio, categoria, uc, ca, rodeo, nservicio,diasLact } = animal;
   const [show, setShow] = useState(false);
   const [calculado, guardarCalculado] = useState({})
   const handleShow = () => { setShow(true) };


   useEffect(() => {

      let fser;
      //formateo fecha de servicio
      try {
         fser = format(new Date(fservicio), 'dd/MM/yy');
      } catch (error) {
         fser = "";
      }

      const calc = {
         fser
      };
      guardarCalculado(calc);

   }, []);

   return (
      <>
         <tr>
            <td >
               {rp}
            </td>

            <td >
               {categoria}
            </td>
            <td >
               {rodeo}
            </td>
            <td >
               {estrep}
            </td>
            <td >
               {estpro}
            </td>
            <td >
               {lactancia}
            </td>
            <td >
               {uc}
            </td>
            <td >
               {ca}
            </td>
            <td >
               {diasLact}
            </td>
            <td >
               {racion}
            </td>
            <td >
               {nservicio}
            </td>
            <td >
               {calculado.fser}
            </td>
            <td >
               {erp}
            </td>

            <td>
               <Button
                  variant="link"
                  onClick={handleShow}
               >
                  <OverlayTrigger
                     placement="bottom"
                     overlay={<Tooltip >Ficha</Tooltip>}
                  >
                     <RiAddBoxLine size={22} />
                  </OverlayTrigger>
               </Button>

            </td>
         </tr>
         { show &&
            <FichaAnimal
               animal={animal}
               show={show}
               setShow={setShow}
            />
         }

      </>

   );
}

export default DetalleGralAnimal;