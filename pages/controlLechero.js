import React, { useState, useContext, useEffect } from 'react'
import { FirebaseContext } from '../firebase2';
import { Botonera, Mensaje, ContenedorSpinner } from '../components/ui/Elementos';
import Layout from '../components/layout/layout';
import { Button, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { format } from 'date-fns'
import readXlsxFile from 'read-excel-file'
import Detalle from '../components/layout/detalle';
import { v4 as uuidv4 } from 'uuid';
import SelectTambo from '../components/layout/selectTambo';


const ControlLechero = () => {

  const { firebase, tamboSel } = useContext(FirebaseContext);
  const [fecha, guardarFecha] = useState(null);
  const [file, guardarFile] = useState(null);
  const [errores, guardarErrores] = useState([]);
  const [actualizados, guardarActualizados] = useState([]);
  const [procesando, guardarProcesando] = useState(false);
  const [animales, guardarAnimales] = useState([]);


  useEffect(() => {
    const f = format(Date.now(), 'yyyy-MM-dd');
    guardarFecha(f);

  }, [])


  const handleChange = e => {
    guardarFecha(e.target.value);

  }

  const handleSubmit = e => {
    e.preventDefault();
    if (file) {

      //console.log(file.name.indexOf('.'));
      cargarControl();

    }

  }

  async function cargarControl() {
    guardarProcesando(true);
    let fila = 0;
    guardarErrores([]);
    guardarActualizados([]);
    guardarAnimales([]);

    await readXlsxFile(file).then((rows) => {
      rows.forEach(r => {
        fila++;
        if (fila != 1) {

          const a = {
            erp: r[0],
            lts: r[1],
            anorm: "",
            fila: fila
          }
          cargarAnimal(a);

        }

      });

    })
    guardarFile(null);
    //console.log(animales);
    // animales.forEach(a => {

    // });
    guardarProcesando(false);
  }

  async function cargarAnimal(a) {
    let litros;
    let e='';
    let erp;
    try {
        litros=a.lts.toString();
        if (litros.includes(",")){
           litros = litros.replace(',', '.');
        }
     } catch (error) {
      e = "Fila N°: " + a.fila + " / eRP: " + a.erp + " - Error de formato en Lts.";
      guardarErrores(errores => [...errores, e]);
    }
    try {
      erp = a.erp.toString();
    } catch (error) {
      e = "Fila N°: " + a.fila +" - Error en eRP.";
      guardarErrores(errores => [...errores, e]);
    }

    let valores;
    if (isNaN(litros) || (!litros)) {
      e = "Fila N°: " + a.fila + " / eRP: " + a.erp + " - Los litros deben ser un valor numérico";
      guardarErrores(errores => [...errores, e]);
    } else {
      if (e=='') {
        
        await firebase.db.collection('animal').where('idtambo', '==', tamboSel.id).where('erp', 'in', [erp,a.erp]).get().then(snapshot => {
          if (!snapshot.empty) {
            snapshot.forEach(doc => {
              valores = {
                uc: parseFloat(litros),
                fuc: firebase.fechaTimeStamp(fecha),
                ca: doc.data().uc,
                anorm: a.anorm,
              }
              try {
                let detalle = litros + " lts."
                if (a.anorm) {
                  detalle = detalle + " - Anorm: " + a.anorm
                }
                firebase.db.collection('animal').doc(doc.id).update(valores);
                firebase.db.collection('animal').doc(doc.id).collection('eventos').add({
                  fecha: valores.fuc,
                  tipo: 'Control Lechero',
                  detalle: detalle
                })
                let act = "Fila N°: " + a.fila + " / eRP: " + a.erp + " - Lts: " + litros;
                guardarActualizados(actualizados => [...actualizados, act]);
              } catch (error) {

                e = "Fila N°: " + a.fila + " / eRP: " + a.erp + " - Error al actualizar los datos ";
                guardarErrores(errores => [...errores, e]);
              }
            });


          } else {
            e = "Fila N°: " + a.fila + " / eRP: " + a.erp + " - El eRP no existe";
            guardarErrores(errores => [...errores, e]);
          }

        });
      }
    }

  }


  const onFileChange = e => {
    const f = e.target.files[0];
    guardarErrores([]);
    guardarActualizados([]);
    guardarFile(f);

  }

  return (

    <Layout
      titulo="Control Lechero"
    >
      {procesando ? <ContenedorSpinner> <Spinner animation="border" variant="info" /></ContenedorSpinner> :
        <Botonera>

          <Form
            onSubmit={handleSubmit}
          >
            <Row>
              <Col>
                <Form.Control
                  type="date"
                  id="fecha"
                  name="fecha"
                  value={fecha}
                  onChange={handleChange}
                  required

                />
              </Col>
              <Col>
                <Form.File
                  id="archivoExcel"
                  onChange={onFileChange}
                  required

                />
              </Col>
              <Col>
                <Button
                  variant="info"
                  type="submit"
                  block
                >
                  Cargar Control
                </Button>
              </Col>
            </Row>
          </Form>
        </Botonera>
      }
      {tamboSel ?
        <Mensaje>

          {errores.length != 0 &&

            <Alert variant="danger"  >
              <Alert.Heading>Se produjeron los siguientes errores:</Alert.Heading>
              {errores.map(a => (
                <Detalle
                  key={uuidv4()}
                  info={a}

                />

              ))}
            </Alert>
          }
          {actualizados.length != 0 &&

            <Alert variant="success"  >
              <Alert.Heading>Se actualizaron los siguientes animales:</Alert.Heading>

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

export default ControlLechero