import React, { useState, useEffect, useContext } from 'react'
import { FirebaseContext } from '../firebase2';
import { Botonera, Mensaje, ContenedorSpinner, Contenedor } from '../components/ui/Elementos';
import Layout from '../components/layout/layout';
import DetalleRecepciones from '../components/layout/detalleRecepciones';
import SelectTambo from '../components/layout/selectTambo';
import StickyTable from "react-sticky-table-thead"

import { Button, Form, Row, Col, Alert, Spinner, Table, ButtonGroup } from 'react-bootstrap';
import { RiSearchLine } from 'react-icons/ri';
import { format, subDays } from 'date-fns'


const Recepciones = () => {

  const [recepciones, guardarRecepciones] = useState([]);
  
  const [valores, guardarValores] = useState({
    fini: format(Date.now(), 'yyyy-MM-dd'),
    ffin: format(Date.now(), 'yyyy-MM-dd'),
    inicio: '',
    fin: '',
    visto: 'todos',
    tipo: 'todos',
    tipoFecha: 'ud'
  });

  const [procesando, guardarProcesando] = useState(false);
  const { fini, ffin, inicio, fin, visto, tipo, tipoFecha } = valores;
  const { firebase, tamboSel } = useContext(FirebaseContext);


  const handleSubmit = e => {

    guardarRecepciones([]);
    guardarProcesando(true);
    e.preventDefault();
    let inicio, fin;
    let inicioAux;
    let finAux = format(Date.now(), 'yyyy-MM-dd');
    finAux=finAux+ 'T21:59:00';
    let ff=valores.ffin+ 'T21:59:00';

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
      visto: visto,
      tipo: tipo,
      tipoFecha: tipoFecha
    });

 
    if (tamboSel) {
      try {

        let recepcionRef = firebase.db.collection('tambo').doc(tamboSel.id).collection('recepcion').where('fecha', '>=', inicio).where('fecha', '<=', fin);
        let query = recepcionRef.where('fecha', '>=', inicio).where('fecha', '<=', fin);
        //agrega el filtro de visto.
        if (visto != 'todos') {
          let v = false
          if (visto == 'true') v=true;
            query = query.where('visto', '==', v);
        }
        //agrega filtro de tipo de evento
        if (tipo != 'todos') {

          query = query.where('tipo', '==', tipo);
        }
        query.get().then(snapshotRecepcion);


      } catch (error) {
        console.log(error.message);
      }
    }

  }

  const handleChange = e => {
    guardarValores({
      ...valores,
      [e.target.name]: e.target.value
    })
  }

  function snapshotRecepcion(snapshot) {

    const recep = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    })
    guardarRecepciones(recep);
    guardarProcesando(false);

  }

  return (

    <Layout
      titulo="Recepciones"
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
                <Form.Label>Tipo</Form.Label>
                <Form.Control
                  as="select"
                  id="tipo"
                  name="tipo"
                  value={tipo}
                  onChange={handleChange}
                  required
                >
                  <option value="todos" >Todos</option>
                  <option value="Racion" >Racion</option>
                  <option value="Art. Limpieza" >Art. Limpieza</option>
                  <option value="Art. Veterinaria" >Art. Veterinaria</option>
                  <option value="Semen" >Semen</option>

                </Form.Control>
              </Form.Group>
            </Col>
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

          recepciones.length == 0 ?
            <Mensaje>
              <Alert variant="warning" >No se encontraron resultados</Alert>
            </Mensaje>
            :

            <Contenedor>
              <StickyTable height={300}>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Tipo</th>
                      <th>Remito</th>
                      <th>Observacion</th>
                      <th>Foto</th>
                      <th>Usuario</th>
                      <th>Visto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recepciones.map(r => (
                      <DetalleRecepciones
                        key={r.id}
                        recepcion={r}

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

export default Recepciones