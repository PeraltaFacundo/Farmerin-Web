import React, { useState, useEffect, useContext } from 'react'
import Link from 'next/link';
import { FirebaseContext } from '../firebase2';
import { Botonera, Contenedor,Mensaje } from '../components/ui/Elementos';
import Layout from '../components/layout/layout';
import DetallesTambo from '../components/layout/detalleTambo';


import { Button, Alert, Row, Col, Table } from 'react-bootstrap';
import { RiAddBoxLine } from 'react-icons/ri';
import { useRouter } from 'next/router';

const Home = () => {

  
  const [error, guardarError] = useState(false);
  const { firebase, usuario,tambos,guardarTambos } = useContext(FirebaseContext);
  const router = useRouter();
  

  useEffect(() => {

    const redirectLogin = async () => {
      await router.push('/login');
    };
    if (!usuario) {
      redirectLogin();
    } else {
      const obtenerTambos =async () => {
        await firebase.db.collection('tambo').where('usuarios', 'array-contains', usuario.uid).orderBy('nombre', 'desc').onSnapshot(manejarSnapshot)
      }
      obtenerTambos();
     
    }
   

  }, [])

  function manejarSnapshot(snapshot) {
    const tambos = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    });
    guardarTambos(tambos);
   
  }


  return (

    <Layout
      titulo="Tambos"
    >
      <Botonera>
        <Row>
          <Col lg={true}>
            <h5>Listado de Tambos</h5>
          </Col>

          <Col md="auto">

            <Link href="/tambos/[id]" as={`/tambos/0`}>
              <Button
                variant="success"
              >
                <RiAddBoxLine size={28} />
                &nbsp;
                Nuevo Tambo

              </Button>
            </Link>

          </Col>
        </Row>
      </Botonera>
      { tambos && (tambos.length > 0) ?
        <Contenedor>
          <Table responsive>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Ubicacion</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              {tambos.map(t => (
                <DetallesTambo
                  key={t.id}
                  tambo={t}
                />
              )
              )}
            </tbody>
          </Table>
        </Contenedor>
        :
        <Mensaje>
          <Alert variant="warning" >Se debe de alta un nuevo Tambo!</Alert>
        </Mensaje>
      }

    </Layout>

  )
}

export default Home