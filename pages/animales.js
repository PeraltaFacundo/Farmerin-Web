import React, { useState, useEffect, useContext } from 'react'
import Link from 'next/link';
import { FirebaseContext } from '../firebase2';
import { Botonera, Mensaje, ContenedorSpinner, Contenedor } from '../components/ui/Elementos';
import Layout from '../components/layout/layout';
import DetalleAnimal from '../components/layout/detalleAnimal';
import SelectTambo from '../components/layout/selectTambo';
import StickyTable from "react-sticky-table-thead"

import { Button, Form, Row, Col, Alert, Spinner, Table } from 'react-bootstrap';
import { RiAddBoxLine, RiSearchLine } from 'react-icons/ri';
import { FaSort } from 'react-icons/fa';

const Animales = () => {

  const [elim, guardarElim] = useState(false);
  const [error, guardarError] = useState();
  const [animales, guardarAnimales] = useState([]);
  const [animalesBase, guardarAnimalesBase] = useState([]);
  const [valores, guardarValores] = useState({
    rp: ''
  });

  const [procesando, guardarProcesando] = useState(false);
  const { rp } = valores;
  const { firebase, tamboSel,  porc, setPorc } = useContext(FirebaseContext);
  const [orderRp, guardarOrderRp] = useState('asc');
  const [orderEr, guardarOrderEr] = useState('asc');
  const [orderEp, guardarOrderEp] = useState('asc');
  const [valor, setValor] = useState(0);


  
    

  

  useEffect(() => {

    guardarElim(false);
    //obtiene los animales del tambo
    if (tamboSel) {
      buscarAnimales();
      aplicarFiltro();
    }

  }, [tamboSel, elim])
  /*
  $(document).ready(function () {
      $('#animalesTable').DataTable();
      $('.dataTables_length').addClass('bs-select');
  });*/

  function buscarAnimales() {

    guardarProcesando(true);
    if (tamboSel) {
      try {
        firebase.db.collection('animal').where('idtambo', '==', tamboSel.id).where('fbaja', '==', '').orderBy('rp').get().then(snapshotAnimal);
      } catch (error) {
        guardarError(error);
        console.log(error);
      }
    }
    guardarProcesando(false);

  };
  function snapshotAnimal(snapshot) {
    const animales = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    })

    guardarAnimalesBase(animales);
  }

  const aplicarFiltro = () => {

    if (rp != "") {
      const cond = rp.toLowerCase();
      const filtro = animalesBase.filter(animal => {
        return (
          (animal.rp) && (animal.erp) ?
            animal.rp.toString().toLowerCase().includes(cond) ||
            animal.erp.toString().toLowerCase().includes(cond)
            :
            (animal.rp) ?
              animal.rp.toString().toLowerCase().includes(cond)
              :
              (animal.erp) &&
              animal.erp.toString().toLowerCase().includes(cond)

        )
      });
      guardarAnimales(filtro);
    } else {
      guardarAnimales(animalesBase);
    }
  }

  const handleSubmit = e => {
    e.preventDefault();
    aplicarFiltro();
  }

  const handleChange = e => {
    guardarValores({
      ...valores,
      [e.target.name]: e.target.value
    })
  }

  const handleClickRP = e => {
    e.preventDefault();
    if (orderRp == 'asc') {
      const a = animalesBase.sort((a, b) => (a.rp < b.rp) ? 1 : -1);
      guardarOrderRp('desc');
      guardarAnimalesBase(a);
    } else {
      const b = animalesBase.sort((a, b) => (a.rp > b.rp) ? 1 : -1);
      guardarOrderRp('asc');
      guardarAnimalesBase(b);
    }

    aplicarFiltro();

  }

  const handleClickER = e => {
    e.preventDefault();
    if (orderEr == 'asc') {
      const a = animalesBase.sort((a, b) => (a.estrep < b.estrep) ? 1 : -1);
      guardarOrderEr('desc');
      guardarAnimalesBase(a);
    } else {
      const b = animalesBase.sort((a, b) => (a.estrep > b.estrep) ? 1 : -1);
      guardarOrderEr('asc');
      guardarAnimalesBase(b);
    }

    aplicarFiltro();

  }

  const handleClickEP = e => {
    e.preventDefault();
    if (orderEp == 'asc') {
      const a = animalesBase.sort((a, b) => (a.estpro < b.estpro) ? 1 : -1);
      guardarOrderEp('desc');
      guardarAnimalesBase(a);
    } else {
      const b = animalesBase.sort((a, b) => (a.estpro > b.estpro) ? 1 : -1);
      guardarOrderEp('asc');
      guardarAnimalesBase(b);
    }

    aplicarFiltro();

  }

  return (

    <Layout
      titulo="Animales"
    >
     
      <Botonera>
        <Row>
          <Col lg={true}>
            <h6>Listado de animales: {animales.length}</h6>
          </Col>


        </Row>
        <Row>&nbsp;</Row>
        <Row>
          <Col lg={true}>
            <Form
              onSubmit={handleSubmit}
            >
              <Row>

                <Col lg={true}>
                  <Form.Group>
                    <Form.Control
                      type="string"
                      id="rp"
                      placeholder="RP / eRP"
                      name="rp"
                      value={rp}
                      onChange={handleChange}


                    />
                  </Form.Group>
                </Col>
                <Col lg={true}>
                  <Form.Group>
                    <Button
                      variant="info" block
                      type="submit"
                    >
                      <RiSearchLine size={22} />
                &nbsp;
                Buscar

                </Button>
                  </Form.Group>
                </Col>
                <Col md="auto">

                  <Link
                    href="/animales/[id]" as={'/animales/0'}
                  >
                    <Button
                      variant="success" block
                    >
                      <RiAddBoxLine size={24} />
                      &nbsp;
                      Alta Animal

                    </Button>
                  </Link>

                </Col>
              </Row>
            </Form>

          </Col>

        </Row>
      </Botonera >

      {procesando ? <ContenedorSpinner> <Spinner animation="border" variant="info" /></ContenedorSpinner> :
        //si hay tambo
        (tamboSel) ?

          animales.length == 0 ?
            <Mensaje>
              <Alert variant="warning" >No se encontraron resultados</Alert>
            </Mensaje>
            :
            <Contenedor>
              <StickyTable height={370}>
                <Table responsive>
                  <thead>
                    <tr>
                      <th onClick={handleClickRP}>RP  <FaSort size={15} /></th>
                      <th onClick={handleClickEP}>Est. Prod. <FaSort size={15} /></th>
                      <th onClick={handleClickER}>Est. Rep. <FaSort size={15} /></th>
                      <th>eRP</th>
                      <th>Accion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {animales.map(a => (
                      <DetalleAnimal
                        key={a.id}
                        animal={a}
                        guardarElim={guardarElim}
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

export default Animales