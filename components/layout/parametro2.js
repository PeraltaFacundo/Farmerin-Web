import React, { useState,useEffect } from 'react'
import { Botonera, Mensaje, ContenedorSpinner, Contenedor } from '../../components/ui/Elementos';


import { Button, } from 'react-bootstrap';
import { RiArrowDownLine, RiArrowUpLine, RiDeleteBin2Line, RiSubtractLine } from 'react-icons/ri';


const Parametro2 = ({ parametro, parametros, guardarParametros, guardarModifica, borrar, guardarBorrar }) => {

   const { id, idtambo, orden, condicion, min, max, um, racion } = parametro;

   const handleDown = () => {
        
        
        const parOrd = parametros.map(p => {
         // Revisamos que el id recibido coincida con el elemento que queremos actualizar
         if (p.id === id) {
           // Actualizamos el orden
           p.orden += 1;
           // Regresamos el nuevo elemento con el orden actualizad
           return p;
         }
         //Si el el anterior le sumo uno
         if (p.orden=== orden+1){
            p.orden -= 1;
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
       guardarModifica(true);

   };

   function handleUp(){
   
      //console.log(parametros);
      const parOrd = parametros.map(p => {
         // Revisamos que la llave recibida coincida con el elemento que queremos actualizar
         if (p.id === id) {
           // Actualizamos el orden
           p.orden -= 1;
           // Regresamos el nuevo elemento con el orden actualizad
           return p;
         }
         //Si el el anterior le sumo uno
         if (p.orden=== orden-1){
            p.orden += 1;
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
       guardarModifica(true);   
     
   };

   function eliminarParam() {
   
      if (id) {
         //si no es un numero, hay que sacarlo de la base de datos
         if (isNaN(id)){ guardarBorrar([...borrar, id])};
         const filtro = parametros.filter(p => p.id !== id);
         let ord=1;
         filtro.map(function(param, i){
            param.orden=ord;
            ord++;
            
          })
          guardarParametros(filtro);
          
      }
      guardarModifica(true);

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

            <Button
               variant="link"
               onClick={eliminarParam}
            >
               <RiDeleteBin2Line size={24} />
            </Button>
            {(orden != 1) ?
               <Button
                  variant="link"
                  onClick={handleUp}
               >
                  <RiArrowUpLine size={24} />
               </Button>
               :
               <Button
                  variant="link"
               >
                  <RiSubtractLine size={24} />
               </Button>
              
            }

            {(orden != parametros.length) ?
               <Button
                  variant="link"
                  onClick={handleDown}
               >
                  <RiArrowDownLine size={24} />
               </Button>
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

export default Parametro2;