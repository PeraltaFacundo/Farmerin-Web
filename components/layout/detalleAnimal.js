import React, { useState, useContext } from 'react';
import Link from 'next/link';
import { FirebaseContext } from '../../firebase2';
import FichaAnimal from './fichaAnimal';
import { RiEdit2Line, RiAddBoxLine, RiDeleteBin2Line } from 'react-icons/ri';
import { Modal, Button, Alert, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { format } from 'date-fns'

const DetalleAnimal = ({ animal, guardarElim }) => {

   const { firebase } = useContext(FirebaseContext);

   const { id, idtambo, rp, erp, lactancia, ingreso, observaciones, estpro, estrep, fparto, fservicio, categoria, fbaja, mbaja } = animal;
   const [show, setShow] = useState(false);
   const [showElim, setShowElim] = useState(false);
   const [error, guardarError] = useState(false);
   const [descError, guardarDescError] = useState('');
   const [motivos, guardarMotivos] = useState([]);


   const handleShow = () => { setShow(true) };

   const handleCloseElim = () => { setShowElim(false) };

   const handleShowElim = () => {
      guardarError(false);
      buscarMotivo();
      setShowElim(true)
   };

   let motivo = "0";

   async function eliminarAnimal() {
      guardarError(false);
      if (motivo != "0") {
         try {

            const a = {
               fbaja: format(Date.now(), 'yyyy-MM-dd'),
               mbaja: motivo
            }

            await firebase.db.collection('animal').doc(id).update(a);
            guardarElim(true);
            handleCloseElim();
         } catch (error) {
            guardarDescError(error.message);
            guardarError(true);

         }
      } else {
         guardarDescError('Debe seleccionar un motivo de baja');
         guardarError(true);
      }

   }

   const buscarMotivo = () => {

      if (motivos.length == 0) {
         firebase.db.collection('listado').where('tipo', '==', 'baja').where('idtambo', '==', idtambo).get().then(snapshotMotivo)
      }

   };

   function snapshotMotivo(snapshot) {
      const moti = snapshot.docs.map(doc => {
         return {
            id: doc.id,
            ...doc.data()
         }
      })
      guardarMotivos(moti);
   }

   const changeMotivo = e => {
      e.preventDefault();
      motivo = e.target.value;

   }

   return (
      <>
         <tr>
            <td >
               {rp}
            </td>

            <td >
               {estpro}
            </td>
            <td >
               {estrep}
            </td>
            <td >
               {erp}
            </td>
            <td>
               <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip >Ficha</Tooltip>}
               >
                  <Button
                     variant="link"
                     onClick={handleShow}
                  >
                     <RiAddBoxLine size={22} />
                  </Button>
               </OverlayTrigger>
               <Link
                  href="/animales/[id]" as={`/animales/${id}`}
               >

                  <Button
                     variant="link"
                  >
                     <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip >Editar</Tooltip>}
                     >
                        <RiEdit2Line size={22} />
                     </OverlayTrigger>
                  </Button>

               </Link>

               <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip >Eliminar</Tooltip>}
               >

                  <Button
                     variant="link"
                     onClick={handleShowElim}
                  >
                     <RiDeleteBin2Line size={22} />
                  </Button>
               </OverlayTrigger>

            </td>
         </tr>


         <Modal show={showElim} onHide={handleCloseElim}>
            <Modal.Header closeButton>
               <Modal.Title>
                  <p>Atención!</p>

               </Modal.Title>
            </Modal.Header>
            <Modal.Body>

               <p>¿Desea dar de baja el animal {rp} ?</p>

               <Form.Control
                  as="select"
                  id="motivo"
                  name="motivo"

                  placeholder="Seleccione motivo"
                  onChange={changeMotivo}

               >
                  <option value="0" >Seleccione motivo...</option>
                  {(motivos.length != 0) &&
                     motivos.map(m => (
                        <option key={m.id} value={m.descripcion}>{m.descripcion}</option>
                     ))
                  }
               </Form.Control>
               <Alert variant="danger" show={error} >
                  <p>{descError}</p>
               </Alert>
            </Modal.Body>
            <Modal.Footer>

               <Button
                  variant="success"
                  onClick={eliminarAnimal}

               >Aceptar</Button>
               <Button
                  variant="danger"
                  onClick={handleCloseElim}

               >
                  Cancelar </Button>
            </Modal.Footer>
         </Modal>
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

export default DetalleAnimal;