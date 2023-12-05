import React, { useState, useEffect, useContext } from 'react'
import Link from 'next/link';
import { FirebaseContext } from '../firebase2';
import { Botonera, Contenedor } from '../components/ui/Elementos';
import Layout from '../components/layout/layout';
import DetalleListado from '../components/layout/detalleListado';
import StickyTable from "react-sticky-table-thead"
import SelectTambo from '../components/layout/selectTambo';
import { Button, Form, Row, Col, Table } from 'react-bootstrap';
import { RiAddBoxLine } from 'react-icons/ri';

const Listados = () => {

  const [listados, guardarListados] = useState([]);
  const [tipo, guardarTipo] = useState('todos');
  const { firebase, tamboSel } = useContext(FirebaseContext);


  useEffect(() => {
    if (tamboSel) {
      const obtenerListados = () => {
        firebase.db.collection('listado').where('idtambo', '==', tamboSel.id).onSnapshot(manejarSnapshot)
      }
      obtenerListados();
    }

  }, [tipo, tamboSel]);

  function manejarSnapshot(snapshot) {
    const listados = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    })


    if (tipo != "todos") {

      const filtro = listados.filter(l => {
        return (
          l.tipo.includes(tipo)
        )
      });
      guardarListados(filtro);
    } else {
      guardarListados(listados);
    }


  }

  const handleChange = e => {
    guardarTipo(e.target.value);

  }

  return (

    <Layout
      titulo="Listados"
    >
      <Botonera>
        <h5>Tipos</h5>
        <Row>
          <Col lg={true}>


            <Form.Control
              as="select"
              id="tipo"
              name="tipo"
              value={tipo}
              placeholder="Seleccione tipo"
              onChange={handleChange}
              required
            >
              <option value="todos" >Todos...</option>
              <option value="servicio" >Servicio</option>
              <option value="tratamiento" >Tratamiento</option>
              <option value="enfermedad" >Enfermedad</option>
              <option value="baja" >Motivo de Baja</option>

            </Form.Control>
          </Col>

          <Col md="auto">

            <Link href="/listados/[id]" as={`/listados/0`}>
              <Button
                variant="success"
              >
                <RiAddBoxLine size={28} />
                &nbsp;
                Nueva Opción

              </Button>
            </Link>

          </Col>
        </Row>
      </Botonera>
      <Contenedor>
        {tamboSel ?
          <StickyTable height={380}>
            <Table responsive>
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Descripción</th>
                  <th>Accion</th>
                </tr>
              </thead>
              <tbody>

                {listados.map(l => (
                  <DetalleListado
                    key={l.id}
                    listado={l}
                  />
                )
                )}

              </tbody>
            </Table>
          </StickyTable>
          :
          <SelectTambo />
        }
      </Contenedor>

    </Layout>

  )
}

export default Listados