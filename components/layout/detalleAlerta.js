import React, { useState, useContext } from 'react';
import { FirebaseContext } from '../../firebase2';
import { format } from 'date-fns'
import { Contenedor } from '../ui/Elementos';
import { RiDeleteBin2Line } from 'react-icons/ri';
import { Row, Col,Button } from 'react-bootstrap';

const DetalleAlerta = ({ alerta, alertas, guardarAlertas }) => {

   const { id, fecha, mensaje } = alerta;
   //context con las CRUD de firebase
   const { usuario, firebase } = useContext(FirebaseContext);

   let fd = new Date(fecha);
   let f = format(fd, 'dd/MM/yyyy');

   async function borrarAlerta() {
      try {            
           await firebase.db.collection('alerta').doc(id).delete();
            const alertasVigentes = alertas.filter(a => {
            if (a.id === id) return false;
            return a;
            });
            guardarAlertas(alertasVigentes);

         } catch(error) {
           console.log(error);
         }

   }

   return (

      <Contenedor>
         <Row>
            <Col lg={true}>{f}</Col>
            <Col md="auto">
               <Button
                  variant="light"
                  onClick={borrarAlerta}
               >
                  <RiDeleteBin2Line size={20} />
               </Button>
            </Col>
         </Row>

         <h6>{mensaje}</h6>
      </Contenedor>


   );
}

export default DetalleAlerta;