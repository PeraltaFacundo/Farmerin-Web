import React, { useState, useContext, useEffect, fetch } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FirebaseContext } from '../../firebase2';
import { ContenedorSpinner, Contenedor } from '../ui/Elementos';
import MapContainer from './MapContainer';
import { RiEdit2Line, RiAddBoxLine, RiDeleteBin2Line, RiReplyLine } from 'react-icons/ri';
import { Alert, Button, Modal, OverlayTrigger, Tooltip, Row, Col, Form, Spinner, Table } from 'react-bootstrap';
import { format } from 'date-fns';
import DetalleHorario from './detalleHorario';
import AuthFetch from 'auth-fetch'



const DetalleTambos = ({ tambo }) => {
   const fetch = require('node-fetch');
   const { id, nombre, ubicacion, bajadas, turnos, tolvas, link } = tambo;
   //context con las CRUD de firebase
   const { usuario, firebase, guardarTamboSel } = useContext(FirebaseContext);
   const router = useRouter();

   const [error, guardarError] = useState(false);
   const [descError, guardarDescError] = useState('');
   const [animales, guardarAnimales] = useState([]);
   const [fecha, guardarFecha] = useState(null);
   const [horarios, guardarHorarios] = useState(null);
   const [estadoApi, guardarEstadoApi] = useState(null);

   const [show, setShow] = useState(false);
   const [showData, setShowData] = useState(false);
   const handleClose = () => { setShow(false), guardarError(false) };
   const handleShow = () => { setShow(true), guardarError(false) };
   const handleShowData = () => { setShowData(true) };
   const handleCloseData = () => { setShowData(false) };

   useEffect(() => {
      let f = format(Date.now(), 'yyyy-MM-dd');
      guardarFecha(f);
      guardarEstadoApi('');
   }, [])


   const selecTambo = () => {
      guardarTamboSel(tambo);
      return router.push('/animales');
   };

   const handleChange = e => {

      guardarFecha(e.target.value);

   }

   async function buscarHorarios() {
      guardarEstadoApi('buscando');
      const url = link + '/horarios/' + fecha;
      const login='farmerin';
      const password='Farmerin*2021';
      try {
         
         const api = await fetch(url, {
            headers: {
               'Authorization': 'Basic ' + btoa(`${login}:${password}`),
               'Content-Type': 'application/json',
               'Access-Control-Allow-Origin': '*'
             }
         });
         const hs = await api.json();
         guardarHorarios(hs);
         guardarEstadoApi('resultados');
         

      } catch (error) {
         guardarEstadoApi('error');
         console.log(error);
      }
   }

   async function eliminarTambo() {

      try {
         await firebase.db.collection('animal').where('idtambo', '==', id).get().then(snapshotAnimal);
         if (animales.length == 0) {
            await firebase.db.collection('tambo').doc(id).delete();
         } else {
            guardarDescError("No se puede eliminar el tambo, tiene animales asociados");
            guardarError(true);
         }

      } catch (error) {
         guardarDescError(error.message);
         guardarError(true);

      }

   }

   function snapshotAnimal(snapshot) {
      const animales = snapshot.docs.map(doc => {
         return {
            id: doc.id,
            ...doc.data()
         }
      })
      guardarAnimales(animales);
   }

   return (
      <>
         <tr>
            <td >

               <Button
                  variant="link"
                  onClick={selecTambo}
               >
                  <h6>{nombre}</h6>
               </Button>


            </td>
            <td >
               <h6>{ubicacion}</h6>
            </td>
            <td>
               <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip >Informacion</Tooltip>}
               >
                  <Button
                     variant="link"
                     onClick={handleShowData}
                  >
                     <RiAddBoxLine size={24} />
                  </Button>
               </OverlayTrigger>


               <Link
                  href="/tambos/[id]" as={`/tambos/${id}`}
               >

                  <Button
                     variant="link"
                  > <OverlayTrigger
                     placement="bottom"
                     overlay={<Tooltip >Editar</Tooltip>}
                  >
                        <RiEdit2Line size={24} />
                     </OverlayTrigger>

                  </Button>

               </Link>
               <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip >Borrar</Tooltip>}
               >
                  <Button
                     variant="link"
                     onClick={handleShow}
                  >
                     <RiDeleteBin2Line size={24} />
                  </Button>
               </OverlayTrigger>

            </td>

         </tr>
         <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
               <Modal.Title>
                  <p>Atención!</p>

               </Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <p>¿Desea eliminar el tambo {nombre} ?</p>
               <Alert variant="danger" show={error} >
                  <Alert.Heading>Oops! Se ha producido un error!</Alert.Heading>
                  <p>{descError}</p>
               </Alert>
            </Modal.Body>
            <Modal.Footer>

               <Button
                  variant="success"
                  onClick={eliminarTambo}

               >Aceptar</Button>
               <Button
                  variant="danger"
                  onClick={handleClose}

               >
                  Cancelar </Button>
            </Modal.Footer>
         </Modal>
         <Modal show={showData} onHide={handleCloseData}>
            <Modal.Header closeButton>
               <Modal.Title>
                  <p>Tambo {nombre}</p>
               </Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <Row>
                  <Col>
                     <h5> Ubicación: {ubicacion}</h5>
                  </Col>
               </Row>
               <Row>
                  <Col>
                     <h5> Turnos: {turnos}</h5>
                  </Col>
                  <Col>
                     <h5> Bajadas: {bajadas}</h5>
                  </Col>
                  <Col>
                     <h5> Kgs. Tolvas:{tolvas}</h5>
                  </Col>
               </Row>
               <Row>
                  <br></br>
               </Row>
               <Row>
                  <Col>
                     <Form.Control
                        type="date"
                        id="fecha"
                        name="fecha"
                        value={fecha}
                        onChange={handleChange}
                        required

                     />
                  </Col>
                  <Col>
                     <Button
                        variant="success"
                        onClick={buscarHorarios}

                     >Ver Horarios</Button>
                  </Col>
                  <Col></Col>
               </Row>
               <Row>
                  <br></br>
               </Row>
               {estadoApi == 'buscando' ?
                  <ContenedorSpinner> <Spinner animation="border" variant="info" /></ContenedorSpinner>
                  :
                  estadoApi == 'error' ?
                     <Alert variant="danger" >No se puede acceder al tambo</Alert>
                     :
                     estadoApi == 'resultados' && horarios.length == 0 ?
                        <Alert variant="success" >No hay resultados para la fecha seleccionada</Alert>
                        :
                        estadoApi == 'resultados' &&
                        <Table responsive>
                           <thead>
                              <tr>
                                 <th >Turno   </th>
                                 <th >Inicio </th>
                                 <th >Fin </th>

                              </tr>
                           </thead>
                           <tbody>
                              {horarios.map(h => (
                                 <DetalleHorario
                                    key={h.id}
                                    horario={h}

                                 />
                              )
                              )}
                           </tbody>
                        </Table>
               }

            </Modal.Body>
            <Modal.Footer>
               <Button
                  variant="info"
                  onClick={handleCloseData}
               >
                  Cerrar
               </Button>
            </Modal.Footer>
         </Modal>
      </>

   );
}

export default DetalleTambos;