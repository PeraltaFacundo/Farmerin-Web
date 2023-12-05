import React, { useState, useEffect, useContext } from 'react'
import { FirebaseContext } from '../firebase2';
import { Botonera, Mensaje, ContenedorSpinner, Contenedor } from '../components/ui/Elementos';
import Layout from '../components/layout/layout';
import DetalleProduccion from '../components/layout/detalleProduccion';
import SelectTambo from '../components/layout/selectTambo';
import StickyTable from "react-sticky-table-thead"

import { Button, Form, Row, Col, Alert, Spinner, Table, ButtonGroup } from 'react-bootstrap';
import { RiSearchLine } from 'react-icons/ri';
import { format, subDays } from 'date-fns'


const Produccion = () => {

  const [producciones, setProducciones] = useState([]);
  const [totales, setTotales] = useState({
    produccion: 0,
    descarte: 0,
    guachera: 0,
    entregado: 0
  });

  const [valores, guardarValores] = useState({
    fini: format(Date.now(), 'yyyy-MM-dd'),
    ffin: format(Date.now(), 'yyyy-MM-dd'),
    inicio: '',
    fin: '',
    tipoFecha: 'ud'
  });

  const [procesando, guardarProcesando] = useState(false);
  const { fini, ffin, inicio, fin, tipoFecha } = valores;
  const { firebase, tamboSel } = useContext(FirebaseContext);
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = e => {

    setProducciones([]);
    guardarProcesando(true);
    e.preventDefault();
    let inicio, fin;
    let inicioAux;
    let finAux = format(Date.now(), 'yyyy-MM-dd');
    finAux = finAux + 'T21:59:00';
    let ff = valores.ffin + 'T21:59:00';

    if (tipoFecha == "ef") {
      inicio = firebase.fechaTimeStamp(valores.fini);
      fin = firebase.fechaTimeStamp(ff);
    }

    if (tipoFecha == "ud") {
      inicioAux = subDays(Date.now(), 1);
      inicioAux = format(inicioAux, 'yyyy-MM-dd');
      inicio = firebase.fechaTimeStamp(inicioAux);
      fin = firebase.fechaTimeStamp(finAux);
    }

    if (tipoFecha == "us") {
      inicioAux = subDays(Date.now(), 7);
      inicioAux = format(inicioAux, 'yyyy-MM-dd');
      inicio = firebase.fechaTimeStamp(inicioAux);
      fin = firebase.fechaTimeStamp(finAux);
    }

    if (tipoFecha == "u2s") {
      inicioAux = subDays(Date.now(), 14);
      inicioAux = format(inicioAux, 'yyyy-MM-dd');
      inicio = firebase.fechaTimeStamp(inicioAux);
      fin = firebase.fechaTimeStamp(finAux);
    }


    guardarValores({
      fini: fini,
      ffin: ffin,
      inicio: inicio,
      fin: fin,
      tipoFecha: tipoFecha
    });


    if (tamboSel) {
      try {

        firebase.db.collection('tambo').doc(tamboSel.id).collection('produccion').where('fecha', '>=', inicio).where('fecha', '<=', fin).get().then(snapshotProduccion);


      } catch (error) {
        setShowAlert(true);
        <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
          <Alert.Heading>Atencion!</Alert.Heading>
          <p>
           {error.message}
          </p>
        </Alert>

      }
    }

  }

  const handleChange = e => {
    guardarValores({
      ...valores,
      [e.target.name]: e.target.value
    })
  }

  function snapshotProduccion(snapshot) {

    let totProd = 0;
    let totDesc = 0;
    let totGua = 0;
    let totEnt = 0;

    const prod = snapshot.docs.map(doc => {
      totProd = parseFloat(totProd) + parseFloat(doc.data().produccion);
      totDesc = parseFloat(totDesc) + parseFloat(doc.data().descarte);
      totGua = parseFloat(totGua) + parseFloat(doc.data().guachera);
      return {
        id: doc.id,
        ...doc.data()
      }
    })

    totEnt = parseFloat(totProd) - parseFloat(totDesc) - parseFloat(totGua);
    setTotales({
      produccion: totProd,
      descarte: totDesc,
      guachera: totGua,
      entregado: totEnt
    })
    setProducciones(prod);
    guardarProcesando(false);

  }

  return (

    <Layout
      titulo="Producción"
    >
      <Botonera>

        <Form
          onSubmit={handleSubmit}
        >

          <Row>
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
              <Form.Group>
                <br></br>
                <Button
                  variant="info" block
                  type="submit"
                >
                  <RiSearchLine size={22} />
                  Buscar
                </Button>
              </Form.Group>
            </Col>
          </Row>

        </Form>
      </Botonera >

      {procesando ? <ContenedorSpinner> <Spinner animation="border" variant="info" /></ContenedorSpinner> :
        //si hay tambo

        tamboSel ?

          producciones.length == 0 ?
            <Mensaje>
              <Alert variant="warning" >No se encontraron resultados</Alert>
            </Mensaje>
            :

            <Contenedor>
              <tr>
                <td>
                  <h6>Total Producido:</h6>
                </td>
                <td>
                  {totales.produccion}
                </td>
                <td>&nbsp;</td>
                <td>
                  <h6>Total Descarte:</h6>
                </td>
                <td>
                  {totales.descarte}
                </td>
                <td>&nbsp;</td>
                <td>
                  <h6>Total Guachera:</h6>
                </td>
                <td>
                  {totales.guachera}
                </td>
                <td>&nbsp;</td>
                <td>
                  <h6>Total Entregado:</h6>
                </td>
                <td>
                  {totales.entregado}
                </td>

              </tr>
              <StickyTable height={350}>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Prod. M</th>
                      <th>Prod. T</th>
                      <th>Produccion</th>
                      <th>Desc. M</th>
                      <th>Desc. T</th>
                      <th>Descarte</th>
                      <th>Guach. M</th>
                      <th>Guach. T</th>
                      <th>Guachera</th>
                      <th>Entregados</th>
                      <th>Fabrica</th>

                    </tr>
                  </thead>
                  <tbody>
                    {producciones.map(p => (
                      <DetalleProduccion
                        key={p.id}
                        prod={p}

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

export default Produccion