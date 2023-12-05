import React, { useState, useEffect, useContext } from 'react'
import { FirebaseContext } from '../firebase2';
import { Botonera, Mensaje, ContenedorSpinner, Contenedor } from '../components/ui/Elementos';
import Layout from '../components/layout/layout';
import SelectTambo from '../components/layout/selectTambo';
import StickyTable from "react-sticky-table-thead";
import DetalleEvento from '../components/layout/detalleEvento';
import { Button, Form, Row, Col, Alert, Spinner, Table, ButtonGroup, Modal } from 'react-bootstrap';
import { RiSearchLine } from 'react-icons/ri';
import { format, subDays, addDays } from 'date-fns'
import ReactExport from "react-export-excel";
import { FaSort } from 'react-icons/fa';

const ParteDiario = () => {

  const [valores, guardarValores] = useState({
    fini: format(Date.now(), 'yyyy-MM-dd'),
    ffin: format(Date.now(), 'yyyy-MM-dd'),
    visto: 'todos',
    tipo: 'todos',
    tipoFecha: 'ud'
  });

  const [eventos, guardarEventos] = useState([]);
  const [procesando, guardarProcesando] = useState(false);
  const { fini, ffin, inicio, fin, visto, tipo, tipoFecha } = valores;
  const { firebase, tamboSel, usuario } = useContext(FirebaseContext);
  const [orderRp, guardarOrderRp] = useState('asc');
  const [orderFecha, guardarOrderFecha] = useState('asc');
  const [orderEvento, guardarOrderEvento] = useState('asc');
  const [animales, guardarAnimales] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [mensajeAlert, setMensajeAlert] = useState('');

  const ExcelFile = ReactExport.ExcelFile;
  const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
  const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

  useEffect(() => {

    if (tamboSel) {
      buscarAnimales()
    }
  }, [tamboSel])
  useEffect(() => {

    if (tamboSel) {
      buscarAnimales()
    }
  }, [])

  function buscarAnimales() {
    try {

      firebase.db.collection('animal').where('idtambo', '==', tamboSel.id).get().then(snapshotAnimal);
    } catch (error) {
      setMensajeAlert(error.message);
      setShowAlert(true);

    }

  }
  function snapshotAnimal(snapshot) {
    const an = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    })

    guardarAnimales(an);
  }

  function timeout(delay) {
    return new Promise(res => setTimeout(res, delay));
  }




  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log('entra');
    guardarProcesando(true);

    guardarEventos([]);
    //if (procesando) console.log('true');  


    let iniciob, finb;
    let inicioAux;
    let finAux = format(Date.now(), 'yyyy-MM-dd');
    finAux = finAux + 'T21:59:00';
    let ff = valores.ffin + 'T21:59:00';

    if (tipoFecha == "ef") {
      iniciob = firebase.fechaTimeStamp(valores.fini);
      finb = firebase.fechaTimeStamp(ff);
    }

    if (tipoFecha == "ud") {
      inicioAux = subDays(Date.now(), 1);
      inicioAux = format(inicioAux, 'yyyy-MM-dd');
      iniciob = firebase.fechaTimeStamp(inicioAux);
      finb = firebase.fechaTimeStamp(finAux);
    }

    if (tipoFecha == "us") {
      inicioAux = subDays(Date.now(), 7);
      inicioAux = format(inicioAux, 'yyyy-MM-dd');
      iniciob = firebase.fechaTimeStamp(inicioAux);
      finb = firebase.fechaTimeStamp(finAux);
    }

    if (tipoFecha == "u2s") {
      inicioAux = subDays(Date.now(), 14);
      inicioAux = format(inicioAux, 'yyyy-MM-dd');
      iniciob = firebase.fechaTimeStamp(inicioAux);
      finb = firebase.fechaTimeStamp(finAux);
    }

    animales.forEach(a => {

      buscarEventos(a, iniciob, finb)

    });

    await timeout(3000); //for 1 sec delay
    guardarProcesando(false);


  }

  const handleChange = e => {
    e.preventDefault();
    guardarValores({
      ...valores,
      [e.target.name]: e.target.value
    });

  }


  function buscarEventos(an, iniciob, finb) {
    try {

      let query = firebase.db.collection('animal').doc(an.id).collection('eventos').where('fecha', '>=', iniciob).where('fecha', '<=', finb);
      //agrega el filtro de los que están vistos visto.
      if (visto != 'todos') {
        if (visto == 'true') query = query.where('vistoUsuario', 'array-contains', usuario.uid);
      }
      //agrega filtro de tipo de evento
      if (tipo != 'todos') {
        query = query.where('tipo', '==', tipo);
      }

      function snapshotEventos(snapshot) {
        const even = snapshot.docs.map(doc => {

          if ((tipo == 'todos' && doc.data().tipo != 'Control Lechero') || tipo != 'todos') {
            let fevento;
            try {
              fevento = format(firebase.timeStampToDate(doc.data().fecha), 'dd/MM/yyyy');
            } catch (error) {
              fevento = 'error';
            }

            let erp;
            try {
              erp = an.erp.toString();
            } catch (error) {
              erp = '';
            }


            const e = {
              id: doc.id,
              animal: an,
              rp: an.rp,
              erp: erp,
              fevento: fevento,
              ...doc.data()
            }
            //filtro eventos pendientes
            if (visto == 'false') {
              if (e.vistoUsuario) {

                if (e.vistoUsuario.indexOf(usuario.uid) == -1) {
                  guardarEventos(eventos => [...eventos, e]);
                }

              } else {
                guardarEventos(eventos => [...eventos, e]);
              }
            } else {
              guardarEventos(eventos => [...eventos, e]);
            }
          }
        })


      }

      query.get().then(snapshotEventos);



    } catch (error) {

      setMensajeAlert(error.message);
      setShowAlert(true);

    }

  }

  const handleClickRP = e => {
    e.preventDefault();
    if (orderRp == 'asc') {
      const a = eventos.sort((a, b) => (a.rp < b.rp) ? 1 : -1);
      guardarOrderRp('desc');
      guardarEventos(a);
    } else {
      const b = eventos.sort((a, b) => (a.rp > b.rp) ? 1 : -1);
      guardarOrderRp('asc');
      guardarEventos(b);
    }
  }

  const handleClickFecha = e => {
    e.preventDefault();
    if (orderFecha == 'asc') {
      const a = eventos.sort((a, b) => (a.fecha < b.fecha) ? 1 : -1);
      guardarOrderFecha('desc');
      guardarEventos(a);
    } else {
      const b = eventos.sort((a, b) => (a.fecha > b.fecha) ? 1 : -1);
      guardarOrderFecha('asc');
      guardarEventos(b);
    }
  }
  const handleClickEvento = e => {
    e.preventDefault();
    if (orderEvento == 'asc') {
      const a = eventos.sort((a, b) => (a.tipo < b.tipo) ? 1 : -1);
      guardarOrderEvento('desc');
      guardarEventos(a);
    } else {
      const b = eventos.sort((a, b) => (a.tipo > b.tipo) ? 1 : -1);
      guardarOrderEvento('asc');
      guardarEventos(b);
    }
  }


  return (

    <Layout style={{ paddingTop: 0 }}
      titulo="Parte Diario"
    >
      <Modal show={showAlert} onHide={() => setShowAlert(false)} size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Error!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">
            <p>
              {mensajeAlert}
            </p>
          </Alert>
        </Modal.Body>
      </Modal>
      <Botonera style={{ marginTop: 0 }}>
        <Form
          onSubmit={handleSubmit}
        >
          <Row style={{ alignItems: "center" }}>
            <Col lg={true}>

              <Form.Label>Desde</Form.Label>
              <br></br>
              <ButtonGroup>
                <Button
                  variant="info"
                  name="tipoFecha"
                  value="ud"
                  onClick={handleChange}

                >1 día</Button>
                <Button
                  variant="info"
                  name="tipoFecha"
                  value="us"
                  onClick={handleChange}
                >1 semana</Button>
                <Button
                  variant="info"
                  name="tipoFecha"
                  value="u2s"
                  onClick={handleChange}
                >2 semanas</Button>
                <Button
                  variant="info"
                  name="tipoFecha"
                  value="ef"
                  onClick={handleChange}
                >Por fecha</Button>
              </ButtonGroup>
            </Col>

            {(valores.tipoFecha == 'ef') ?
              <>
                <Col lg={true}>
                  <Form.Group>
                    <Form.Label>Inicio</Form.Label>
                    <Form.Control
                      type="date"
                      id="fini"
                      name="fini"
                      value={fini}
                      onChange={handleChange}
                      required

                    />
                  </Form.Group>
                </Col>
                <Col lg={true}>
                  <Form.Group>
                    <Form.Label>Fin</Form.Label>
                    <Form.Control
                      type="date"
                      id="ffin"
                      name="ffin"
                      value={ffin}
                      onChange={handleChange}
                      required

                    />
                  </Form.Group>
                </Col>

              </>
              :
              <>
                <Col lg={true}></Col>
                <Col lg={true}></Col>
              </>

            }
            <Col lg={true}>
              <ExcelFile
                element={<Button variant="success" type="submit" block > Excel</Button>}
                filename="Parte Diario"
              >

                <ExcelSheet data={eventos} name="Eventos">
                  <ExcelColumn label="Fecha" value="fevento" />
                  <ExcelColumn label="RP" value="rp" />
                  <ExcelColumn label="Evento" value="tipo" />
                  <ExcelColumn label="Detalle" value="detalle" />
                  <ExcelColumn label="eRP" value="erp" />
                  <ExcelColumn label="Usuario" value="usuario" />
                </ExcelSheet>

              </ExcelFile>
            </Col>
          </Row>
          <Row>
            <Col lg={true}>
              <Form.Group>
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  id="visto"
                  name="visto"
                  value={visto}
                  onChange={handleChange}
                  required
                >
                  <option value="todos" >Todos</option>
                  <option value="false">Pendientes</option>
                  <option value="true" >Vistos</option>

                </Form.Control>
              </Form.Group>
            </Col>
            <Col lg={true}>
              <Form.Group>
                <Form.Label>Evento</Form.Label>
                <Form.Control
                  as="select"
                  id="tipo"
                  name="tipo"
                  value={tipo}
                  onChange={handleChange}
                  required
                >
                  <option value="todos" >Todos</option>
                  <option value="Aborto" >Aborto</option>
                  <option value="Aborto inicia lactancia" >Aborto Inicia Lactancia</option>
                  <option value="Alta" >Alta</option>
                  <option value="Alta Vaquillona" >Alta Vaquillona</option>
                  <option value="Baja" >Baja</option>
                  <option value="Celo" >Celo</option>
                  <option value="Cambio eRP" >Cambio eRP</option>
                  <option value="Control Lechero" >Control Lechero</option>
                  <option value="Parto" >Parto</option>
                  <option value="Rechazo" >Rechazo</option>
                  <option value="Secado" >Secado</option>
                  <option value="Servicio">Servicio</option>
                  <option value="Tacto" >Tacto</option>
                  <option value="Tratamiento" >Tratamiento</option>

                </Form.Control>
              </Form.Group>
            </Col>
            <Col lg={true}>
              <Form.Group>
                <br></br>
                {procesando ? <ContenedorSpinner> <Spinner animation="border" variant="info" /></ContenedorSpinner> :

                  <Button
                    variant="info" block
                    type="submit"
                  >
                    <RiSearchLine size={22} />
                    Buscar
                  </Button>
                }
              </Form.Group>
            </Col>

          </Row>


        </Form>
      </Botonera >

      {procesando ? <ContenedorSpinner> <Spinner animation="border" variant="info" /></ContenedorSpinner> :
        //si hay tambo

        tamboSel ?

          eventos.length == 0 ?
            <Mensaje>
              <Alert variant="warning" >No se encontraron resultados</Alert>
            </Mensaje>
            :

            <Contenedor>

              <StickyTable height={380}>
                <Table responsive>
                  <thead>
                    <tr>
                      <th onClick={handleClickFecha}>Fecha  <FaSort size={15} /></th>
                      <th onClick={handleClickRP}>RP  <FaSort size={15} /></th>
                      <th onClick={handleClickEvento}>Evento  <FaSort size={15} /></th>
                      <th>Detalle</th>
                      <th>eRP</th>
                      <th>Usuario</th>
                      <th>Visto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventos.map(e => (
                      <DetalleEvento
                        key={e.id}
                        evento={e}
                        eventos={eventos}
                        guardarEventos={guardarEventos}

                      />
                    )
                    )}
                  </tbody>
                </Table>
              </StickyTable>
            </Contenedor>
          :
          <SelectTambo />

      }
    </Layout >

  )
}

export default ParteDiario