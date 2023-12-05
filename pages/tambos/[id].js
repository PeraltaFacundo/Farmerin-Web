import React, { useEffect, useContext, useState } from 'react';
import { FirebaseContext } from '../../firebase2';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/layout/layout';
//hook de validacion de formularios
import useValidacion from '../../hook/useValidacion';
//importo las reglas de validacion para crear cuenta
import validarCrearTambo from '../../validacion/validarCrearTambo';
//formato del formulario
import { Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { Contenedor, Mensaje, ContenedorSpinner } from '../../components/ui/Elementos';
import { format } from 'date-fns'

const STATE_INICIAL = {
    idusuario: '',
    nombre: '',
    ubicacion: '',
    bajadas: 1,
    turnos: 1,
    tolvas: 10,
    freclimp: 15,
    link: '',
    host: ''

}

const Tambo = () => {

    const [exito, guardarExito] = useState(false);
    const [descExito, guardarDescExito] = useState('');
    const [error, guardarError] = useState(false);
    const [descError, guardarDescError] = useState('');
    const [procesando, guardarProcesando] = useState(false);

    //uso este state para guardar los valores de los campos en el submit
    const [tambo, guardarTambo] = useState({});
    let titulo = "Editar Tambo";

    //reouter para obtener el id
    const router = useRouter();
    const { query: { id } } = router;

    //context con las CRUD de firebase
    const { usuario, firebase } = useContext(FirebaseContext);

    const { valores, errores, handleSubmit, handleChange, handleBlur, guardarValores } = useValidacion(STATE_INICIAL, validarCrearTambo, editTambo);
    const { idusuario, nombre, ubicacion, bajadas, turnos, tolvas, freclimp, link, host } = valores;

    //valida que el usuario esté logueado
    useEffect(() => {
        const redirectLogin = async () => {
            await router.push('/login');
        };
        if (!usuario) {
            redirectLogin();
        }
    }, [])

    useEffect(() => {
        if (id) {
            //Si es alta
            if (id === "0") {
                titulo = "Nuevo Tambo";
                guardarError(false);
            } else {
                const obtenerTambo = async () => {
                    const tamboQuery = await firebase.db.collection('tambo').doc(id);
                    const tambo = await tamboQuery.get();
                    if (tambo.exists) {
                        guardarValores(tambo.data());
                    } else {
                        guardarDescError("El tambo no existe");
                        guardarError(true);
                    }
                }
                obtenerTambo();
            }
        }

    }, [id, tambo]);


    async function editTambo() {

        guardarError(false);
        guardarProcesando(true);
        //Si es alta
        if (id == "0") {
            if (!usuario) {
                return router.push('/login');
            }


            //creo el objeto tambo
            const tambo = {
                nombre,
                ubicacion,
                bajadas,
                turnos,
                tolvas,
                freclimp,
                ultlimp: firebase.fechaTimeStamp(format(Date.now(), 'yyyy-MM-dd')),
                usuarios: [usuario.uid],
                link,
                host
            }

            //insertar en base de datos
            try {
                await firebase.db.collection('tambo').add(tambo);
                guardarExito(true);
                guardarDescExito("Tambo creado con éxito!");
            } catch (error) {
                guardarDescError(error.message);
                guardarError(true);
            }


        } else {

            //creo el objeto tambo
            const t = {
                nombre,
                ubicacion,
                bajadas,
                turnos,
                tolvas,
                freclimp,
                link,
                host

            }

            //EDITA en base de datos 
            try {
                //await firebase.db.collection('tambo').doc(id).set(t, { merge: true });
                await firebase.db.collection('tambo').doc(id).update(t);
                guardarExito(true);
                guardarDescExito("Tambo editado con éxito!");
            } catch (error) {
                guardarDescError(error.message);
                guardarError(true);
            }
            //Guardo los valores del formulario para recargar 
            guardarTambo(valores);

        }
        guardarProcesando(false);
    }

    return (
        <Layout
            titulo={titulo}

        > {procesando ? <ContenedorSpinner> <Spinner animation="border" variant="info" /></ContenedorSpinner> :
            <>
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
                        <Form.Label><h5>Datos del Tambo</h5></Form.Label>
                        <Row>
                            <Col lg={true}>
                                <Form.Group>
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="string"
                                        id="nombre"
                                        placeholder="Nombre"
                                        name="nombre"
                                        value={nombre}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required

                                    />
                                    {errores.nombre && <Alert variant="danger" width="100%"  >{errores.nombre}</Alert>}
                                </Form.Group>
                            </Col>
                            <Col lg={true}>
                                <Form.Group>
                                    <Form.Label>Ubicación</Form.Label>
                                    <Form.Control
                                        type="string"
                                        id="ubicacion"
                                        placeholder="Ubicación"
                                        name="ubicacion"
                                        value={ubicacion}
                                        onChange={handleChange}
                                        onBlur={handleBlur}

                                    />

                                </Form.Group>
                            </Col>
                            <Col lg={true}>
                                <Form.Group>
                                    <Form.Label>Turnos diarios</Form.Label>

                                    <Form.Control
                                        type="number"
                                        min="1"
                                        max="4"
                                        id="turnos"
                                        name="turnos"
                                        value={turnos}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required

                                    />
                                    {errores.turnos && <Alert variant="danger" width="100%"  >{errores.turnos}</Alert>}
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>

                            <Col lg={true}>
                                <Form.Group>
                                    <Form.Label>Cantidad de bajadas</Form.Label>
                                    <Form.Control
                                        type="number"
                                        id="bajadas"
                                        name="bajadas"
                                        min="1"
                                        max="100"
                                        value={bajadas}
                                        onChange={handleChange}
                                        onBlur={handleBlur}


                                    />
                                    {errores.bajadas && <Alert variant="danger" width="100%"  >{errores.bajadas}</Alert>}
                                </Form.Group>
                            </Col>
                            <Col lg={true}>
                                <Form.Group>
                                    <Form.Label>Capacidad de tolvas(kg)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        id="tolvas"
                                        name="tolvas"
                                        min="10"
                                        max="200"
                                        value={tolvas}
                                        onChange={handleChange}
                                        onBlur={handleBlur}

                                    />
                                    {errores.tolvas && <Alert variant="danger" width="100%"  >{errores.tolvas}</Alert>}
                                </Form.Group>
                            </Col>
                            <Col lg={true}>
                                <Form.Group>
                                    <Form.Label>Limpieza tolvas (días)</Form.Label>

                                    <Form.Control
                                        type="number"
                                        min="5"
                                        max="30"
                                        id="freclimp"
                                        name="freclimp"
                                        value={freclimp}
                                        onChange={handleChange}
                                        onBlur={handleBlur}

                                    />
                                    {errores.freclimp && <Alert variant="danger" width="100%"  >{errores.freclimp}</Alert>}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={true}>
                                <Form.Group>
                                    <Form.Label>Link</Form.Label>
                                    <Form.Control
                                        type="string"
                                        id="link"
                                        placeholder="Link"
                                        name="link"
                                        value={link}
                                        onChange={handleChange}
                                        onBlur={handleBlur}

                                    />

                                </Form.Group>
                            </Col>
                            <Col lg={true}>
                                <Form.Group>
                                    <Form.Label>Host</Form.Label>
                                    <Form.Control
                                        type="string"
                                        id="host"
                                        placeholder="Host"
                                        name="host"
                                        value={host}
                                        onChange={handleChange}
                                        onBlur={handleBlur}

                                    />

                                </Form.Group>
                            </Col>
                            <Col lg={true}></Col>
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
                                &nbsp;
                            </Col>
                            <Col lg={true}>
                                <Link
                                    href="/"
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

export default Tambo;