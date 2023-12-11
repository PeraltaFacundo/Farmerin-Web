import React, { useState, useEffect, useContext } from 'react'
import { FirebaseContext } from '../../firebase2';
import { Mensaje, Botonera, Contenedor } from '../../components/ui/Elementos';
import Parametro from '../layout/parametro';
import Link from 'next/link';
import StickyTable from "react-sticky-table-thead"
import { Button, Form, Row, Col, Alert, Spinner, Table, Modal } from 'react-bootstrap';
import { RiAddBoxLine } from 'react-icons/ri';
import { format } from 'date-fns';


const DetalleParametro = ({ idTambo, categoria, porcentaje }) => {


   const { firebase, usuario } = useContext(FirebaseContext);
   const [parametros, guardarParametros] = useState([]);
   const [animal, guardarAnimal] = useState ([]);
   const [fracion, guardarFracion] = useState ([]);


   useEffect(() => {

      if (idTambo) {
         //obtiene los parametros del tambo
         obtenerParam();
      }
   }, [idTambo])
       
   useEffect(() => {

      if (idTambo) {
         //obtiene los parametros del tambo
         obtenerParam();
      }
   }, [porcentaje])
   const obtenerParam = () => {
      try {

         firebase.db.collection('parametro').where('idtambo', '==', idTambo).where('categoria', '==', categoria).orderBy('orden').get().then(snapshotParametros)
         firebase.db.collection('animal').where('idtambo', '==', idTambo).get().then(snapshotAnimal)         
      } catch (error) {
         guardarDescError(error.message);
         guardarError(true);
      }


   };
 

function snapshotParametros(snapshot) {
      const param = snapshot.docs.map(doc => {
         let p;
         if(porcentaje == 0){
            p = {
               porcentaje: 0
            }
         }else{
         p = {
            porcentaje: Number(porcentaje)
         }
      }
      if(doc.id){
         try {
            firebase.db.collection('parametro').doc(String(doc.id)).update(p);
         } catch (error) {
            console.log(error);
         }}
         return {
            id: doc.id,
            ...doc.data()
         }
      })
      guardarParametros(param);
   }


   function snapshotAnimal(snapshot) {
      const ani = snapshot.docs.map(doc => {
         let p;
         if(porcentaje == 0){
            p = {
               fracion: firebase.nowTimeStamp(),
               porcentaje: 0
            }
         }else{
         p = {
            fracion: firebase.nowTimeStamp(),

            porcentaje: Number(porcentaje)
         }
      }
      if(doc.id){
         try {
            firebase.db.collection('animal').doc(String(doc.id)).update(p);
         } catch (error) {
            console.log(error);
         }}
         return {
            id: doc.id,
            ...doc.data()
         }
      })
      guardarAnimal(ani);
   }


   return (

      <>


         <Contenedor>
            <Row>
               <Col lg={true}>
                  <h5>{categoria}</h5>
               </Col>
               <Col></Col>
               <Col></Col>
               <Col></Col>
               <Col></Col>
               <Col></Col>

               <Col lg={true}>
                  <Link
                     href="/parametros/[id]" as={'/parametros/0'}
                  >
                     <Button
                        variant="light"
                     //onClick={handleShow}
                     >
                        <RiAddBoxLine size={20} />
                  &nbsp;
                  Nuevo
                  </Button>
                  </Link>
               </Col>


            </Row>
            {(parametros.length == 0) ?

               <Mensaje>
                  <Alert variant="warning" >No hay parámetros nutricionales configurados para {categoria}</Alert>
               </Mensaje>
               :
               <StickyTable height={185}>
               <Table responsive>
                  <thead>
                     <tr>
                        <th>Rodeo/Orden</th>
                        <th>Cond</th>
                        <th>Min.</th>
                        <th>Max</th>
                        <th>UM</th>
                        <th>Racion(kg)</th>
                        <th>Accion</th>
                     </tr>
                  </thead>
                  <tbody>
                     {parametros.map(p => (

                        <Parametro
                           key={p.id}
                           parametro={p}
                           parametros={parametros}
                           animal={animal}
                           guardarParametros={guardarParametros}
                           porcentaje={porcentaje}
                        />
                     )
                     )}
                  </tbody>
               </Table>
               </StickyTable>
            }


         </Contenedor>
      </>
   )
}

export default DetalleParametro;