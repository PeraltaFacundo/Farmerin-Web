import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../../firebase2';
import { format } from 'date-fns';
import { RiCheckDoubleLine, RiCheckLine, RiCameraFill } from 'react-icons/ri';
import { Button, Modal, Image, OverlayTrigger, Tooltip } from 'react-bootstrap';

const DetalleRecepciones = ({ recepcion }) => {

  const [eventos, guardarEventos] = useState([]);
  const { id, fecha, fechaRemito, foto, obs, tipo, visto, usuario } = recepcion;

  const { firebase, tamboSel } = useContext(FirebaseContext);
  const [vistoTemp, setVistoTemp] = useState();
  const [frecep, setFrecep] = useState('');
  const [frem, setFrem] = useState('');
  const [show, setShow] = useState(false);
  const [imagen, setImagen] = useState('');

  useEffect(() => {
    //seteo el item visto por si no lo tiene
    setVistoTemp(visto);
    //formateo fecha de recepcion
    try {
      const f = format(firebase.timeStampToDate(fecha), 'dd/MM/yyyy');
      setFrecep(f);

    } catch (error) {
      setFrecep('');
    }

    //formateo fecha de remito
    try {
      const fr = format(firebase.timeStampToDate(fechaRemito), 'dd/MM/yyyy');
      setFrem(fr);

    } catch (error) {
      setFrem('');
    }

    //busca foto
    let ubicacionFoto = tamboSel.id + '/recepciones/' + foto;
    obtenerFoto(ubicacionFoto);

  }, []);

  async function obtenerFoto(ubicacionFoto) {
    let im = await firebase.getArchivo(ubicacionFoto);
    setImagen(im);

  }

  async function cambiarVisto() {

    try {
      //visto = true;
      const e = { visto: true };
      await firebase.db.collection('tambo').doc(tamboSel.id).collection('recepcion').doc(id).update(e);
      setVistoTemp(true);
    } catch (error) {
      console.log(error.message);


    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        centered
      >
        <Modal.Header closeButton>

          <Modal.Title>Foto del remito</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Image src={imagen} fluid />


        </Modal.Body>

      </Modal>
      <tr>
        <td >
          {frecep}
        </td>
        <td >
          {tipo}
        </td>

        <td >
          {frem}
        </td>

        <td >
          {obs}
        </td>

        <td >
          {imagen &&
            <Button
              variant="link"
              onClick={() => setShow(true)}
            >
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip >Foto</Tooltip>}
              >
                <RiCameraFill size={24} />
              </OverlayTrigger>
            </Button>
          }
        </td>
        <td >
          {usuario}
        </td>
        <td >
          {vistoTemp ?
            <RiCheckDoubleLine size={24} />
            :
            <Button
              variant="link"
              onClick={cambiarVisto}
            >

              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip >Marcar</Tooltip>}
              >
                <RiCheckLine size={24} />
              </OverlayTrigger>
            </Button>

          }
        </td>
      </tr>
    </>
  );
}

export default DetalleRecepciones;