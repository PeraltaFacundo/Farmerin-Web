import React, { useState, useContext, useEffect } from 'react'
import { FirebaseContext } from '../firebase2';
import { Botonera, Mensaje, ContenedorSpinner } from '../components/ui/Elementos';
import Layout from '../components/layout/layout';
import { Button, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';
import Detalle from '../components/layout/detalle';
import { v4 as uuidv4 } from 'uuid';
import SelectTambo from '../components/layout/selectTambo';


const TestFuncion = () => {

    const { firebase, tamboSel } = useContext(FirebaseContext);
    const [actualizados, guardarActualizados] = useState([]);
    const [procesando, guardarProcesando] = useState(false);
    const [rp, setRp] = useState();

    const handleSubmit = e => {
        e.preventDefault();
        guardarActualizados([]);
        controlarTambo();
    }

    const onRpChange = e => {

        setRp(e.target.value);

    }

    function controlarAnimal(a, parametros) {

        //Calcula los kgs de ración de acuerdo a la condición del animal
        let diasPre;
        let diasLact;
        let elapsedTime;
        let sugerido = 0;
        let litrosUC;

        const nowDate = new Date();
        const partoDate = new Date(a.fparto);

        //Calcula los dias de preñez
        if (a.estrep === "vacia") {
            diasPre = 0;
        } else {
            const servicioDate = new Date(a.fservicio);
            elapsedTime = (nowDate.getTime() - servicioDate.getTime());
            diasPre = Math.floor(elapsedTime / 1000 / 60 / 60 / 24);
        }

        elapsedTime = (nowDate.getTime() - partoDate.getTime());
        //calcula los dias de lactancia
        diasLact = Math.floor(elapsedTime / 1000 / 60 / 60 / 24);

        //redondea litros UC. Si no hay, pone un minimo
        litrosUC=Math.round(parseFloat(a.uc));
        if (isNaN(litrosUC)) litrosUC=5;
        

        guardarActualizados(actualizados => [...actualizados,'Categoria: '+a.categoria+' Dias de lactancia: '+diasLact+' UC:'+litrosUC]);
        async function cambioAlimentacion(p, tipo) {
            let racion;
            let fracion;
            let rodeo;
            let cambia = false;
            let sugerido;
            const myTimestamp = firebase.nowTimeStamp();

            //si la ración es mayor o es lactancia la cambio, sino mantengo 
            if ((parseInt(p.racion) > parseInt(a.racion)) || tipo === 'lactancia') {
                racion = p.racion;
                fracion = myTimestamp;
                cambia = true;
                      
                guardarActualizados(actualizados => [...actualizados, 'Cambia ración '+p.racion+'-'+a.racion]);
        

            } else {
                //mantengo la misma racion
                racion = a.racion;
                fracion = a.fracion;
                guardarActualizados(actualizados => [...actualizados, 'Mantiene racion '+a.racion+'-'+p.racion]);
            }

            //si el rodeo es distinto, lo cambia
            if (p.rodeo !== a.rodeo) {
                cambia = true;
                rodeo = p.rodeo;
                guardarActualizados(actualizados => [...actualizados, 'Cambia rodeo '+a.rodeo+'-'+p.rodeo]);
            } else {
                rodeo = a.rodeo;
                guardarActualizados(actualizados => [...actualizados, 'Mantiene rodeo '+a.rodeo+'-'+p.rodeo]);
            }

            //si los kg sugeridos son distintos a los actuales, los cambio
            if (parseInt(p.racion) !== parseInt(a.sugerido)) {
                cambia = true;
                sugerido = p.racion;
                guardarActualizados(actualizados => [...actualizados, 'Cambia sugeridos '+a.sugerido+'-'+p.racion]);
            } else {
                sugerido = a.sugerido;
                guardarActualizados(actualizados => [...actualizados, 'Mantiene sugeridos '+a.sugerido+'-'+p.racion]);
            }

            //si hay cambios, hago update del animal
            if (cambia === true) {
                
                
                guardarActualizados(actualizados => [...actualizados, 'Actualiza alimentacion animal']);

          

            }

            return null;
        }



        //Calcula la racion sugerida
        guardarActualizados(actualizados => [...actualizados, 'Analiza parametros']);
        parametros.every(p => {

            let encuentra = false;
            
            if (p.categoria === a.categoria) {
                const datosPar='Rodeo: '+p.rodeo+' Categoria: '+p.categoria+' Condicion: '+p.condicion+' Unidad: '+p.um+' Min: '+parseInt(p.min)+' Max: '+parseInt(p.max)+' Racion: '+parseInt(p.racion);
                guardarActualizados(actualizados => [...actualizados, 'Parametro en analisis: '+datosPar]);
                //si es por lactancia controla los dias
                if (p.um === "Dias Lactancia") {

                    //controla condicion

                    if (p.condicion === "entre") {

                        if (diasLact >= parseInt(p.min) && diasLact <= parseInt(p.max)) {
                            //llamo a la funcion que cambia por días de lactancia
                            guardarActualizados(actualizados => [...actualizados, 'Cambia por Dias Lactancia entre: '+diasLact]);
                            cambioAlimentacion(p, 'lactancia');
                            //cambio este flag para terminar el loop
                            encuentra = true;
                        }
                    } else if (p.condicion === "menor") {


                        if (diasLact <= parseInt(p.min)) {
                            guardarActualizados(actualizados => [...actualizados, 'Cambia por Dias Lactancia menor: '+diasLact]);
                            //llamo a la funcion que cambia por días de lactancia
                            cambioAlimentacion(p, 'lactancia');
                            //cambio este flag para terminar el loop
                            encuentra = true;
                        }

                    }
                } else {
                    //Si es por litros producidos 
                    //controla condicion
                    if (p.condicion === "entre") {

                        if (litrosUC >= parseInt(p.min) && litrosUC <= parseInt(p.max)) {
                            const datosEntre='UC: '+litrosUC+' Min:'+parseInt(p.min)+' Max:'+parseInt(p.max);
                            guardarActualizados(actualizados => [...actualizados, 'Llega a Entre litros: '+datosEntre]);
                            if ((a.fracion < a.fuc) || (a.rodeo < 3)) {
                                guardarActualizados(actualizados => [...actualizados, 'Cambia por Entre litros']);
                                cambioAlimentacion(p, 'produccion');
                            }
                            encuentra = true;
                        }

                    } else if (p.condicion === "menor") {

                        if (litrosUC <= parseInt(p.min)) {
                            const datosMin='UC: '+litrosUC+' Min:'+parseInt(p.min);
                            guardarActualizados(actualizados => [...actualizados, 'Llega a Menos litros: '+datosMin]);
                            if ((a.fracion < a.fuc) || (a.rodeo < 3)) {
                                guardarActualizados(actualizados => [...actualizados, 'Cambia por Menos litros']);
                                cambioAlimentacion(p, 'produccion');
                            }
                            encuentra = true;
                        }

                    } else {

                        if (litrosUC >= parseInt(p.max)) {
                            const datosMas='UC: '+litrosUC+' Max:'+parseInt(p.max);
                            guardarActualizados(actualizados => [...actualizados, 'Llega a Mas litros: '+datosMas]);
                            if ((a.fracion < a.fuc) || (a.rodeo < 3)) {
                                guardarActualizados(actualizados => [...actualizados, 'Cambia por Mas litros']);
                                cambioAlimentacion(p, 'produccion');
                            }
                            encuentra = true;
                        }

                    }

                }
            }
            //si encuentra condicion dejo de recorrer el array
            if (encuentra === true) {
                return false;
            } else {
                return true;
            }


        });

        //return null;


    }

    async function controlarTambo() {
        guardarProcesando(true);
        guardarActualizados(actualizados => [...actualizados, 'Comienza Proceso']);

        const parametros = await getParametros(tamboSel.id);

        const snapshotAnimal = await firebase.db.collection('animal').where('idtambo', '==', tamboSel.id).where('estpro', '==', 'En Ordeñe').where('rp', '==', rp).where('fbaja', '==', '').get();
        snapshotAnimal.forEach(doc => {
            const a = {
                id: doc.id,
                idtambo: doc.data().idtambo,
                rp: doc.data().rp,
                racion: doc.data().racion,
                fracion: doc.data().fracion,
                fservicio: doc.data().fservicio,
                fparto: doc.data().fparto,
                estrep: doc.data().estrep,
                categoria: doc.data().categoria,
                uc: doc.data().uc,
                fuc: doc.data().fuc,
                rodeo: doc.data().rodeo,
                sugerido: doc.data().sugerido
            }
            guardarActualizados(actualizados => [...actualizados, 'Animal encontrado, RP: ' + a.rp]);
            controlarAnimal(a, parametros);
        });
        guardarProcesando(false);

    }

    async function getParametros(idtambo, parametros = []) {
        try {

            const snapshotParam = await firebase.db.collection('parametro').where('idtambo', '==', idtambo).orderBy('orden').get();
            snapshotParam.forEach(doc => {
                parametros.push({
                    id: doc.id,
                    rodeo: doc.data().orden,
                    condicion: doc.data().condicion,
                    max: doc.data().max,
                    min: doc.data().min,
                    racion: doc.data().racion,
                    um: doc.data().um,
                    categoria: doc.data().categoria

                }
                );
                
            });
            guardarActualizados(actualizados => [...actualizados, 'Parametros encontrados']);
        } catch (error) {
            const e = 'Error al obtener los parametros: ' + error;
            guardarActualizados(actualizados => [...actualizados, e]);


        }
        return parametros;

    }



    return (

        <Layout
            titulo="Test Funcion Racion"
        >
            {procesando ? <ContenedorSpinner> <Spinner animation="border" variant="info" /></ContenedorSpinner> :
                <Botonera>

                    <Form
                        onSubmit={handleSubmit}
                    >
                        <Row>
                            <Col>

                                <Form.Group>

                                    <Form.Control
                                        type="string"
                                        id="rp"
                                        placeholder="RP / eRP"
                                        name="rp"
                                        value={rp}
                                        onChange={onRpChange}


                                    />
                                </Form.Group>
                            </Col>

                            <Col>
                                <Button
                                    variant="info"
                                    type="submit"
                                    block
                                >
                                    Testear
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Botonera>
            }
            {tamboSel ?
                <Mensaje>

                    {actualizados.length != 0 &&

                        <Alert variant="success"  >
                            <Alert.Heading>Resultado del test:</Alert.Heading>

                            {actualizados.map(a => (

                                <Detalle
                                    key={uuidv4()}
                                    info={a}

                                />

                            ))}

                        </Alert>
                    }

                </Mensaje>
                :
                <SelectTambo />
            }
        </Layout>

    )
}

export default TestFuncion