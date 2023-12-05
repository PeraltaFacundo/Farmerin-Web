import React, { useEffect, useContext, useState } from 'react';
import { FirebaseContext } from '../../firebase2';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/layout/layout';

//hook de validacion de formularios
import useValidacion from '../../hook/useValidacion';
//importo las reglas de validacion para crear cuenta
import validarCrearAnimal from '../../validacion/validarCrearAnimal';
//formato del formulario
import { Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { Contenedor, Mensaje, ContenedorSpinner, Botonera } from '../../components/ui/Elementos';
import { format } from 'date-fns'
import firebaseCampo from '../../firebase2'

//State inicial para el hook de validacion (inicializo vacío)
const STATE_INICIAL = {
  ingreso: format(Date.now(), 'yyyy-MM-dd'),
  idtambo: '0',
  rp: '',
  erp: '',
  lactancia: 0,
  observaciones: '',
  estpro: 'seca',
  estrep: 'vacia',
  fparto: '',
  fservicio: '',
  categoria: 'Vaquillona',
  racion: 8,
  fracion: format(Date.now(), 'yyyy-MM-dd'),
  nservicio: 1,
  porcentaje: 1,
  uc: 0,
  fuc: format(Date.now(), 'yyyy-MM-dd'),
  ca: 0,
  anorm: '',
  fbaja: '',
  mbaja: '',
  rodeo:0,
  sugerido:0

}

const Animal = () => {

  const [tambos, guardarTambos] = useState([]);
  const [exito, guardarExito] = useState(false);
  const [descExito, guardarDescExito] = useState('');
  const [error, guardarError] = useState(false);
  const [descError, guardarDescError] = useState('');
  const [procesando, guardarProcesando] = useState(false);
  const [tit, guardarTit] = useState("Nuevo Animal");
  const [campoProtegido, guardarcampoProtegido]=useState(false);
  const hoy=format(Date.now(), 'yyyy-MM-dd');

  //uso este state para guardar los valores de los campos en el submit
  const [animal, guardarAnimal] = useState({});

  let existeERP = false;
  let existeRP = false;

  //reouter para obtener el id
  const router = useRouter();
  const { query: { id } } = router;

  //context con las CRUD de firebase
  const { usuario, firebase, tamboSel } = useContext(FirebaseContext);

  const { valores, errores, handleSubmit, handleChange, handleBlur, guardarValores } = useValidacion(STATE_INICIAL, validarCrearAnimal, editAnimal);

  const { idtambo, rp, erp, lactancia, ingreso, observaciones, estpro, estrep, fparto, fservicio, categoria, racion, fracion, nservicio, uc, fuc, ca, anorm, fbaja, mbaja,rodeo,sugerido, porcentaje } = valores;

  useEffect(() => {
   
    if (id != "0") {
      guardarTit("Editar Animal");
      guardarcampoProtegido(true);

      //obtiene los tambos al cargar el component
      const obtenerTambos = () => {
        firebase.db.collection('tambo').orderBy('nombre', 'desc').onSnapshot(snapshotTambo)
      }
      obtenerTambos();
    } else {

      guardarAnimal({
        ingreso: format(Date.now(), 'yyyy-MM-dd'),
        idtambo: tamboSel.id,
        rp: '',
        erp: '',
        lactancia: 0,
        observaciones: '',
        estpro: 'seca',
        estrep: 'vacia',
        fparto: '',
        fservicio: '',
        categoria: 'Vaquillona',
        racion: 8,
        porcentaje: 1,
        fracion: firebase.ayerTimeStamp(),
        nservicio: 1,
        uc: 0,
        fuc:firebase.nowTimeStamp(),
        ca: 0,
        anorm: '',
        fbaja: '',
        mbaja: '',
        rodeo:0,
        sugerido:0
      })
    }

  }, [])

  useEffect(() => {
    
    if (id) {
      //Si es alta
      if (id === "0") {
        guardarValores(animal);
      } else {

        const obtenerAnimal = async () => {
          const animalQuery = await firebase.db.collection('animal').doc(id);
          const animalQ = await animalQuery.get();
          if (animalQ.exists) {
            guardarValores(animalQ.data());
          } else {
            guardarDescError("El animal no existe");
            guardarError(true);
          }
        }
        obtenerAnimal();
      }
    }

  }, [id, animal]);


  function snapshotTambo(snapshot) {
    const tambos = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    })
    guardarTambos(tambos);
  };

  async function editAnimal() {

    guardarDescError();
    guardarDescExito();
    guardarError(false);
    guardarExito(false);
    guardarProcesando(true);

    //Si el usuario no está logueado
    if (!usuario) {
      return router.push('/login');

    }

    
    //valida que el RP no exista
    if (rp && rp.length != 0) {
      existeRP = false;
      try {
        await firebase.db.collection('animal').where('idtambo', '==', idtambo).where('rp', '==', rp).where('fbaja', '==', '').get().then(snapshot => {
          if (!snapshot.empty) {
            snapshot.forEach(doc => {
              if (doc.id != id) {
                existeRP = true;
              };
            });

          }
        });
      } catch (error) {
        guardarDescError(error.message);
        guardarError(true);
        guardarProcesando(false);
        guardarAnimal(valores);
        return;
      }

      if (existeRP == true) {

        guardarDescError("El RP ya está asociado a otro animal!");
        guardarError(true);
        guardarProcesando(false);
        guardarAnimal(valores);
        return;
      }
    }


    //valida que el eRP no exista
    if (erp && erp.length != 0) {
      existeERP = false;
      try {
        await firebase.db.collection('animal').where('idtambo', '==', idtambo).where('erp', '==', erp).where('fbaja', '==', '').get().then(snapshot => {
          if (!snapshot.empty) {
            snapshot.forEach(doc => {
              if (doc.id != id) {
                existeERP = true;
              };
            });

          }
        });
      } catch (error) {
        guardarDescError(error.message);
        guardarError(true);
        guardarProcesando(false);
        guardarAnimal(valores);
        return;
      }

      if (existeERP == true) {
        guardarDescError("El eRP ya está asociado a otro animal!");
        guardarError(true);
        guardarProcesando(false);
        guardarAnimal(valores);
        return;
      }
    }

    //Si es alta
    if (id == "0") {
   
      //creo el objeto animal
      const animal = {
        idtambo,
        ingreso,
        rp,
        erp,
        lactancia,
        observaciones,
        estpro,
        estrep,
        fparto,
        fservicio,
        categoria,
        racion,
        porcentaje,
        fracion,
        nservicio,
        uc,
        fuc,
        ca,
        anorm,
        fbaja,
        mbaja,
        rodeo,
        sugerido
      }

      //insertar en base de datos
      try {
        await firebase.db.collection('animal').add(animal);
        guardarDescExito("Animal dado de alta con éxito!");
        guardarExito(true);
        router.push('/animales');
      } catch (error) {
        guardarDescError(error.message);
        guardarError(true);
      }


    } else {

      //update en base de datos
      try {
        await firebase.db.collection('animal').doc(id).update(valores);
        guardarExito(true);
        guardarDescExito("Animal editado con éxito!");
        router.push('/animales');
      } catch (error) {
        guardarDescError(error.message);
        guardarError(true);
      }
      guardarAnimal(valores);

    }


    //Guardo los valores del formulario para recargar 
    guardarProcesando(false);
  }


  return (
    <Layout
      titulo="Animales"
    > {procesando ? <ContenedorSpinner> <Spinner animation="border" variant="info" /></ContenedorSpinner> :
      <>
        <Botonera>

          <h5>Tambo {tamboSel && tamboSel.nombre}</h5>
          <h6>{tit}</h6>

        </Botonera>
        <Mensaje>
          <Alert variant="success" show={exito} >{descExito}</Alert>
          <Alert variant="danger" show={error} >
            <Alert.Heading>Oops! Se ha producido un error!</Alert.Heading>
            <p>{descError}</p>
          </Alert>

        </Mensaje>

        <Contenedor>
          <Form
            onSubmit={handleSubmit}
          >
            <Form.Label><h5>Datos del Animal</h5></Form.Label>
            <Row>

              <Col lg={true}>
                <Form.Group>
                  <Form.Label>Tambo</Form.Label>
                  {(id != "0") ?
                    <>
                      <Form.Control
                        as="select"
                        id="idtambo"
                        name="idtambo"
                        value={idtambo}
                        placeholder="seleccione tambo"
                        onChange={handleChange}
                        required
                      >
                        <option value="0" >Seleccione tambo...</option>
                        {tambos.map(t => (

                          <option key={t.id} value={t.id}>{t.nombre}</option>
                        )
                        )}
                      </Form.Control>
                      
                    </>
                    :
                    <Form.Control
                      type="string"
                      value={tamboSel.nombre}
                      readOnly

                    />

                  }
                {errores.idtambo && <Alert variant="danger" width="100%"  >{errores.idtambo}</Alert>}
                </Form.Group>
              </Col>
              <Col lg={true}>
                <Form.Group>
                  <Form.Label>Ingreso</Form.Label>
                  <Form.Control
                    type="date"
                    id="ingreso"
                    name="ingreso"
                    max={hoy}
                    value={ingreso}
                    onChange={handleChange}
                   // required

                  />
                  {errores.ingreso && <Alert variant="danger" width="100%"  >{errores.ingreso}</Alert>}
                </Form.Group>
              </Col>
              <Col lg={true}>
                <Form.Group>
                  <Form.Label>RP</Form.Label>
                  <Form.Control
                    type="string"
                    id="rp"
                    placeholder="RP"
                    name="rp"
                    value={rp}
                    onChange={handleChange}
                    required

                  />
                  {errores.rp && <Alert variant="danger" width="100%"  >{errores.rp}</Alert>}
                </Form.Group>
              </Col>
              <Col lg={true}>
                <Form.Group>
                  <Form.Label>RP electrónico (eRP)</Form.Label>
                  <Form.Control
                    type="string"
                    id="erp"
                    placeholder="eRP"
                    name="erp"
                    value={erp}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errores.erp && <Alert variant="danger" width="100%"  >{errores.erp}</Alert>}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col lg={true}>
                <Form.Group>
                  <Form.Label>Lactancias</Form.Label>

                  <Form.Control
                    type="number"
                    min="0"
                    max="20"
                    id="lactancia"
                    name="lactancia"
                    value={lactancia}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required

                  />
                  {errores.lactancia && <Alert variant="danger" width="100%"  >{errores.lactancia}</Alert>}
                </Form.Group>
              </Col>

              <Col lg={true}>
                <Form.Group>
                  <Form.Label>Categoria</Form.Label>
                  <Form.Control
                    type="string"
                    id="categoria"
                    name="categoria"
                    value={categoria}
                    onChange={handleChange}
                    disabled

                  />

                </Form.Group>
              </Col>
              <Col lg={true}>
                <Form.Group>
                  <Form.Label>Estado Reproductivo</Form.Label>

                  <Form.Control
                    as="select"
                    id="estrep"
                    name="estrep"
                    value={estrep}
                    onChange={handleChange}
                    required
                  >
                    <option value="vacia">Vacía</option>
                    <option value="preñada">Preñada</option>
                  </Form.Control>
                  {errores.estrep && <Alert variant="danger" width="100%"  >{errores.estrep}</Alert>}
                </Form.Group>
              </Col>
              <Col lg={true}>
                <Form.Group>
                  <Form.Label>Ultimo Servicio</Form.Label>
                  <Form.Control
                    type="date"
                    id="fservicio"
                    name="fservicio"
                    value={fservicio}
                    onChange={handleChange}
                    max={hoy}
                  />
                  {errores.fservicio && <Alert variant="danger" width="100%"  >{errores.fservicio}</Alert>}
                </Form.Group>
              </Col>
            </Row>
            <Row>


              <Col lg={true}>
                <Form.Group>
                  <Form.Label>Estado Productivo</Form.Label>

                  <Form.Control
                    as="select"
                    id="estpro"
                    name="estpro"
                    value={estpro}
                    onChange={handleChange}
                    required
                  >
                    <option value="seca">Seca</option>
                    <option value="En Ordeñe">En Ordeñe</option>
                  </Form.Control>
                  {errores.estpro && <Alert variant="danger" width="100%"  >{errores.estpro}</Alert>}
                </Form.Group>
              </Col>
              <Col lg={true}>
                <Form.Group>
                  <Form.Label>Ultimo Parto</Form.Label>
                  <Form.Control
                    type="date"
                    id="fparto"
                    name="fparto"
                    value={fparto}
                    onChange={handleChange}
                    max={hoy}
                  />
                  {errores.fparto && <Alert variant="danger" width="100%"  >{errores.fparto}</Alert>}
                </Form.Group>
              </Col>
              <Col lg={true}>
                <Form.Group>
                  <Form.Label>Ultimo Control(Lts)</Form.Label>
                  
                  <Form.Control
                    type="number"
                    step="any"
                    min="0"
                    max="60"
                    id="uc"
                    name="uc"
                    value={uc}
                    onChange={handleChange}
                    required
                    readOnly={campoProtegido}

                  />
                  {errores.uc && <Alert variant="danger" width="100%"  >{errores.uc}</Alert>}
                </Form.Group>
              </Col>
              <Col lg={true}>
                <Form.Group>
                  <Form.Label>Racion(Kgs)</Form.Label>

                  <Form.Control
                    type="number"
                    min="0"
                    max="20"
                    id="racion"
                    name="racion"
                    value={racion}
                    onChange={handleChange}
                    required
                    readOnly={campoProtegido}

                  />
                  {errores.racion && <Alert variant="danger" width="100%"  >{errores.racion}</Alert>}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col lg={true}>
                <Form.Group>
                  <Form.Label>Observaciones</Form.Label>
                  <Form.Control
                    type="text"
                    id="observaciones"
                    name="observaciones"
                    value={observaciones}
                    onChange={handleChange}

                  />

                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col lg={true}>
                <Button
                  variant="success"
                  type="submit"
                  block
                >
                  Guardar
                </Button>
              </Col>
              &nbsp;
              <Col lg={true}>
                <Link
                  href="/animales"
                >
                  <Button
                    variant="info"
                    block
                  >
                    Volver
                  </Button>
                </Link>
              </Col>

            </Row>
          </Form>
        </Contenedor>
      </>
      }
    </Layout>
  );
}

export default Animal;