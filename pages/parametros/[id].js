import React, { useEffect, useContext, useState } from 'react';
import { FirebaseContext } from '../../firebase2';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/layout/layout';

//hook de validacion de formularios
import useValidacion from '../../hook/useValidacion';
//importo las reglas de validacion para crear cuenta
import validarCrearParam from '../../validacion/validarCrearParam';
//formato del formulario
import { Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { Contenedor, Mensaje, ContenedorSpinner, Botonera } from '../../components/ui/Elementos';


//State inicial para el hook de validacion (inicializo vacío)
const STATE_INICIAL = {
  orden: 0,
  categoria: "Vaca",
  condicion: "entre",
  min: 0,
  max: 0,
  um: "Dias Lactancia",
  racion: 8
}

const ParametroEdit = () => {

  const [exito, guardarExito] = useState(false);
  const [descExito, guardarDescExito] = useState('');
  const [error, guardarError] = useState(false);
  const [descError, guardarDescError] = useState('');
  const [procesando, guardarProcesando] = useState(false);
  const [tit, guardarTit] = useState("Nuevo Parametro");
  const [show, setShow] = useState(false);
  const [parametros,guardarParametros]=useState([]);

  //uso este state para guardar los valores de los campos en el submit
  const [parametro, guardarParametro] = useState({});

  const handleClose = () => { setShow(false), guardarError(false) };
  const handleShow = () => { setShow(true), guardarError(false) };

  //context con las CRUD de firebase
  const { usuario, firebase, tamboSel } = useContext(FirebaseContext);

  const { valores, errores, handleSubmit, handleChange, handleBlur, guardarValores } = useValidacion(STATE_INICIAL, validarCrearParam, editParametro);

  const { condicion, min, max, um, racion,categoria,orden } = valores;

  //reouter para obtener el id
  const router = useRouter();
  const { query: { id } } = router;
  

  useEffect(() => {
    
    if (id) {
      //Si es alta
      if (id === "0") {
        obtenerParametros();
        guardarError(false);
      } else {
        guardarTit("Editar Parametro")
        const obtenerParam = async () => {
          const paramQuery = await firebase.db.collection('parametro').doc(id);
          const param = await paramQuery.get();
          if (param.exists) {
            guardarValores(param.data());
          } else {
            guardarDescError("El parámetro no existe");
            guardarError(true);
          }
        }
        obtenerParam();
      }
    }

  }, [id, parametro]);

   //busco los parametros para saber el orden del nuevo
   async function obtenerParametros() {
    try {      
       await firebase.db.collection('parametro').where('idtambo', '==', tamboSel.id).orderBy('orden').get().then(snapshotParametros)
    } catch (error) {
       guardarDescError(error.message);
       guardarError(true);
    }


 };


 function snapshotParametros(snapshot) {
    const param = snapshot.docs.map(doc => {
       return {
          id: doc.id,
          ...doc.data()
       }
    })
    guardarParametros(param);
 }



  async function editParametro() {
      
      //Si es alta
      guardarProcesando(true);
      if (id == "0") {
          if (!usuario) {
              return router.push('/login');
          }

          //filtro los parametros de la categoria
          const filtro = parametros.filter(p => {
            return (
              p.categoria.includes(categoria)
            )
          });
                

         let cantParam=filtro.length+1;
          //creo el objeto parametro
          const param = {
             idtambo: tamboSel.id,
             categoria,
             orden:cantParam,
             condicion,
             min,
             max,
             um,
             racion
          }
  
          try {
        
             await firebase.db.collection('parametro').add(param);
           
          } catch (error) {
             guardarDescError(error.message);
             guardarError(true);
             console.log(error);
        
          }
        

      } 
      
      else {
  
          //EDITA en base de datos
          try {
              await firebase.db.collection('parametro').doc(id).update(valores);
              guardarExito(true);
              guardarDescExito("Opción editada con éxito!");
          } catch (error) {
              guardarDescError(error.message);
              guardarError(true);
          }
     
      }
      guardarProcesando(false);
      return router.push('/parametros');
      
  }


  /*
  async function crearParam() {
  
    let orden = parametros.length + 1;
    let categoria = "Vaca";
    if (tipo == "Vaquillonas") {
       categoria = "Vaquillona";
    }
  
    //creo el objeto parametro
    const param = {
       idtambo,
       categoria,
       orden,
       condicion,
       min,
       max,
       um,
       racion,
       nuevo
    }
    //agrego al state para no hacer otra consulta a la BdD
    try {
  
       await firebase.db.collection('parametro').add(param);
  
    } catch (error) {
       guardarDescError(error.message);
       guardarError(true);
  
    }
  
  
  }
  */

  return (
    <Layout
      titulo={tit}

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
                <Row>
                <Col lg={true}>
                  <Form.Group>
                    Categoria:
                  <Form.Control
                      as="select"
                      id="categoria"
                      name="categoria"
                      value={categoria}
                      onChange={handleChange}
                    >
                      <option value="Vaca" >Vaca</option>
                      <option value="Vaquillona" >Vaquillona</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col lg={true}>
                  <Form.Group>
                    Unidad de Medida:
                  <Form.Control
                      as="select"
                      id="um"
                      name="um"
                      value={um}
                      onChange={handleChange}
                    >
                      <option value="Dias Lactancia" >Días Lactancia</option>
                      <option value="Lts. Producidos" >Lts. Producidos</option>
                    </Form.Control>
                  </Form.Group>
                </Col>

                <Col lg={true}>
                  <Form.Group>
                    Condicion:
                  <Form.Control
                      as="select"
                      id="condicion"
                      name="condicion"
                      value={condicion}
                      onChange={handleChange}
                    >
                      <option value="entre" >Entre</option>
                      <option value="menor" >Menor a</option>
                      <option value="mayor" >Mayor a</option>

                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col lg={true}>
                  <Form.Group>
                    Mínimo:
                    <Form.Control

                      type="number"
                      id="min"
                      placeholder="Min."
                      name="min"
                      min="0"
                      value={min}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={(condicion == "mayor")}

                    />
                    {errores.min && <Alert variant="danger" width="100%"  >{errores.min}</Alert>}
                  </Form.Group>
                </Col>
                <Col lg={true}>
                  <Form.Group>
                    Máximo:
                    <Form.Control
                      type="number"
                      id="max"
                      min="0"
                      placeholder="Max."
                      name="max"
                      value={max}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={(condicion == "menor")}

                    />
                    {errores.max && <Alert variant="danger" width="100%"  >{errores.max}</Alert>}
                  </Form.Group>
                </Col>
                <Col lg={true}>
                  <Form.Group>
                    Kgs. Ración:
                    <Form.Control
                      type="number"
                      id="racion"
                      placeholder="Kgs."
                      name="racion"
                      min="1"
                      value={racion}
                      onChange={handleChange}
                      onBlur={handleBlur}

                    />
                    {errores.racion && <Alert variant="danger" width="100%"  >{errores.racion}</Alert>}
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
                  href="/parametros"
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

export default ParametroEdit;