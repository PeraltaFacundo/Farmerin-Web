import React, { useEffect, useContext, useState } from 'react';
import { FirebaseContext } from '../../firebase2';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/layout';
//hook de validacion de formularios
import useValidacion from '../../hook/useValidacion';
//importo las reglas de validacion para crear cuenta
import validarCrearListado from '../../validacion/validarCrearListado';
//formato del formulario
import { Form, Button, Alert, Spinner, Row, Col,ButtonGroup } from 'react-bootstrap';
import Link from 'next/link';
import { Contenedor, Mensaje, ContenedorSpinner } from '../../components/ui/Elementos';

const STATE_INICIAL = {
    tipo: '',
    descripcion: ''
}

const Listado = () => {

    const [exito, guardarExito] = useState(false);
    const [descExito, guardarDescExito] = useState('');
    const [error, guardarError] = useState(false);
    const [descError, guardarDescError] = useState('');
    const [procesando, guardarProcesando] = useState(false);

    //uso este state para guardar los valores de los campos en el submit
    const [listado, guardarListado] = useState({});
    let titulo = "Editar Opcion";

    //reouter para obtener el id
    const router = useRouter();
    const { query: { id } } = router;

    //context con las CRUD de firebase
    const { usuario, firebase,tamboSel } = useContext(FirebaseContext);

    const { valores, errores, handleSubmit, handleChange, handleBlur, guardarValores } = useValidacion(STATE_INICIAL, validarCrearListado, editListado);
    const { tipo, descripcion } = valores;

    useEffect(() => {
        if (id) {
            //Si es alta
            if (id === "0") {
                titulo = "Nueva Opcion";
                guardarError(false);
            } else {
                const obtenerListado = async () => {
                    const listadoQuery = await firebase.db.collection('listado').doc(id);
                    const listado = await listadoQuery.get();
                    if (listado.exists) {
                        guardarValores(listado.data());
                    } else {
                        guardarDescError("La opción no existe");
                        guardarError(true);
                    }
                }
                obtenerListado();
            }
        }

    }, [id, listado]);


    async function editListado() {
        //Si es alta
        guardarProcesando(true);
        if (id == "0") {
            if (!usuario) {
                return router.push('/login');
            }

            //creo el objeto tambo
            const listado = {
                idtambo: tamboSel.id,
                tipo,
                descripcion
            }

            //insertar en base de datos
            try {
                await firebase.db.collection('listado').add(listado);
                guardarExito(true);
                guardarDescExito("Opción creada con éxito!");
            } catch (error) {
                guardarDescError(error.message);
                guardarError(true);
            }


        } else {

            //EDITA en base de datos
            try {
                await firebase.db.collection('listado').doc(id).update(valores);
                guardarExito(true);
                guardarDescExito("Opción editada con éxito!");
            } catch (error) {
                guardarDescError(error.message);
                guardarError(true);
            }
            //Guardo los valores del formulario para recargar 
            guardarListado(valores);

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
                        <Form.Label><h5>Opción</h5></Form.Label>
                        <Row>
                            <Col lg={true}>
                                <Form.Group>
                                    <Form.Label>Tipo</Form.Label>
                                    <Form.Control
                                        as="select"
                                        id="tipo"
                                        name="tipo"
                                        value={tipo}
                                        placeholder="seleccione tipo"
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="0" >Seleccione tipo...</option>
                                        <option value="servicio" >Tipo Servicio</option>
                                        <option value="tratamiento" >Tratamiento</option>
                                        <option value="enfermedad" >Enfermedad</option>
                                        <option value="baja" >Motivo de Baja</option>

                                    </Form.Control>

                                </Form.Group>
                            </Col>
                            <Col lg={true}>
                                <Form.Group>
                                    <Form.Label>Descripción</Form.Label>
                                    <Form.Control
                                        type="string"
                                        id="descripcion"
                                        placeholder="descripcion"
                                        name="descripcion"
                                        value={descripcion}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required

                                    />
                                    {errores.descripcion && <Alert variant="danger" width="100%"  >{errores.descripcion}</Alert>}
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
                                href="/listados"
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

export default Listado;