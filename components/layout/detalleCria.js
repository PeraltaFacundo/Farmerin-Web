import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../../firebase2'
import { RiCameraFill, RiCloseCircleFill } from 'react-icons/ri';
import { Button, Modal, Image } from 'react-bootstrap';

const DetalleCria = ({ cria }) => {

   const { firebase, tamboSel } = useContext(FirebaseContext);
   const { rp, sexo, peso, trat, foto, observaciones } = cria;
   const [show, setShow] = useState(false);
   const [imagen, setImagen] = useState('');

   useEffect(() => {

      let ubicacionFoto = tamboSel.id + '/crias/' + foto;
      obtenerFoto(ubicacionFoto);


   }, []);

   async function obtenerFoto(ubicacionFoto) {
      try {
         let im = await firebase.getArchivo(ubicacionFoto);
         setImagen(im);
      } catch (error) {
         console.log('No hay foto');
      }

   }
   return (
      <>
         <Modal
            show={show}
            onHide={() => setShow(false)}
            centered
         >
            <Modal.Header closeButton>

               <Modal.Title>Foto de la Cria</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <Image src={imagen} fluid />


            </Modal.Body>

         </Modal>
         <tr>
            <td >

               Sexo: {sexo} -R.P.: {rp} -Peso: {peso} -Trat:{trat}-Obs:{observaciones}
            </td >
            <td >

               {foto &&

                  <Button
                     variant="link"
                     onClick={() => setShow(true)}
                  >
                     <RiCameraFill size={22} />
                  </Button>

               }
            </td>
         </tr>
      </>
   )
}

export default DetalleCria;