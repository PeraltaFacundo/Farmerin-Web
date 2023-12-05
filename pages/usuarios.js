import React, { useState, useEffect, useContext } from 'react'
import Link from 'next/link';
import { FirebaseContext } from '../firebase2';
import { Botonera, Mensaje, ContenedorSpinner, Contenedor } from '../components/ui/Elementos';
import Layout from '../components/layout/layout';
import DetalleUsuario from '../components/layout/detalleUsuario';
import SelectTambo from '../components/layout/selectTambo';
import StickyTable from "react-sticky-table-thead"

import { Button, Row, Col, Alert, Spinner, Table } from 'react-bootstrap';
import { RiAddBoxLine } from 'react-icons/ri';

const Usuarios = () => {

  const [elim, guardarElim] = useState(false);
  const [usuariosTambo, setUsuariosTambo] = useState([]);
  const [procesando, guardarProcesando] = useState(false);
  const { firebase, tamboSel } = useContext(FirebaseContext);


  useEffect(() => {

    guardarElim(false);
    //obtiene los usuarios del tambo
    if (tamboSel) {
      buscarUsuariosTambo();
    }

  }, [tamboSel, elim])


  function buscarUsuariosTambo() {

    guardarProcesando(true);
    /*tamboSel.usuarios.forEach(u1 => {
     // firebase.getUsuario(u1);
    });*/
    firebase.verUsuarios();
    const usu = tamboSel.usuarios.map(u => {
      return {
        id: u
      }
    })
    setUsuariosTambo(usu);
    guardarProcesando(false);

  };



  return (

    <Layout
      titulo="Usuarios"
    >
      <Botonera>
        <Row>
          <Col lg={true}>
            <h5>Usuarios</h5>
          </Col>

          <Col md="auto">

            <Link href="/tambos/[id]" as={`/tambos/0`}>
              <Button
                variant="success"
              >
                <RiAddBoxLine size={28} />
                &nbsp;
                Nuevo Usuario

              </Button>
            </Link>

          </Col>
        </Row>
      </Botonera>

      {procesando ? <ContenedorSpinner> <Spinner animation="border" variant="info" /></ContenedorSpinner> :
        //si hay tambo
        (tamboSel) ?

          usuariosTambo.length == 0 ?
            <Mensaje>
              <Alert variant="warning" >No se encontraron usuarios</Alert>
            </Mensaje>
            :
            <Contenedor>
              <StickyTable height={370}>
                <Table responsive>
                  <thead>
                    <tr>
                      <th >Nombre  </th>
                      <th >Mail </th>
                      <th >Perfil </th>

                    </tr>
                  </thead>
                  <tbody>
                    {usuariosTambo.map(u => (
                      <DetalleUsuario
                        key={u.id}
                        usu={u}
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

export default Usuarios