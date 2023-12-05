import React, { useState, useContext } from 'react';
import Link from 'next/link';
import { FirebaseContext } from '../../firebase2';
import { RiEdit2Line, RiAddBoxLine, RiDeleteBin2Line } from 'react-icons/ri';
import { Alert, Button, Modal, OverlayTrigger, Tooltip }  from 'react-bootstrap';

const DetalleListado = ({ listado }) => {

   const { id, tipo, descripcion } = listado;
   //context con las CRUD de firebase
   const { usuario, firebase } = useContext(FirebaseContext);

   const [error, guardarError] = useState(false);
   const [descError, guardarDescError] = useState('');

   const [show, setShow] = useState(false);
   const handleClose = () => { setShow(false), guardarError(false) };
   const handleShow = () => { setShow(true), guardarError(false) };


   async function eliminarListado() {

      try {

         await firebase.db.collection('listado').doc(id).delete();


      } catch (error) {
         guardarDescError(error.message);
         guardarError(true);

      }

   }


   return (
      <>
         <tr>
            <td >
               <h6>{tipo}</h6>
            </td>
            <td >
               <h6>{descripcion}</h6>
            </td>
            <td>


               <Link
                  href="/listados/[id]" as={`/listados/${id}`}
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

               <Button
                  variant="link"
                  onClick={handleShow}
               ><OverlayTrigger
               placement="bottom"
               overlay={<Tooltip >Eliminar</Tooltip>}
            >
                  <RiDeleteBin2Line size={24} />
                  </OverlayTrigger>
               </Button>
            </td>
         </tr>
         <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
               <Modal.Title>
                  <p>Atención!</p>

               </Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <p>¿Desea eliminar la opcion {descripcion} ?</p>
               <Alert variant="danger" show={error} >
                  <Alert.Heading>Oops! Se ha producido un error!</Alert.Heading>
                  <p>{descError}</p>
               </Alert>
            </Modal.Body>
            <Modal.Footer>

               <Button
                  variant="success"
                  onClick={eliminarListado}

               >Aceptar</Button>
               <Button
                  variant="danger"
                  onClick={handleClose}

               >
                  Cancelar </Button>
            </Modal.Footer>
         </Modal>

      </>

   );
}

export default DetalleListado;