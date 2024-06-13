import React, { useState, useContext, useEffect } from 'react'
import { FirebaseContext } from '../firebase2';
import { Botonera, Mensaje, ContenedorSpinner } from '../components/ui/Elementos';
import Layout from '../components/layout/layout';
import { Button, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { format } from 'date-fns'
//import addDays from 'date-fns/add-days'
import readXlsxFile from 'read-excel-file'
import Detalle from '../components/layout/detalle';
import { v4 as uuidv4 } from 'uuid';
import SelectTambo from '../components/layout/selectTambo';


const Actualizacion = () => {

  const { firebase, tamboSel } = useContext(FirebaseContext);
  const [file, guardarFile] = useState(null);
  const [errores, guardarErrores] = useState([]);
  const [actualizados, guardarActualizados] = useState([]);
  const [procesando, guardarProcesando] = useState(false);
  //const patron = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;




  const handleSubmit = e => {
    e.preventDefault();
    if (file) cargarExcel();

  }

  async function cargarExcel() {
    guardarProcesando(true);
    let fila = 0;
    guardarErrores([]);
    guardarActualizados([]);

    await readXlsxFile(file).then((rows) => {
      rows.forEach(r => {
        fila++;
        if (fila != 1) {

          const a = {
            erp: r[0],
            lactancia: r[1],
            categoria: r[2],
            estpro: r[3],
            fparto: r[4],
            estrep: r[5],
            fservicio: r[6],
           // racion: r[7],
            fila: fila
          }


          updateAnimal(a);

        }

      });

    })
    guardarFile(null);
    guardarProcesando(false);
  }

  async function updateAnimal(a) {
    let id;
    let errores = false;
    let e = '';
    let erp = '';
    let categoria;
    let estpro;
    let fparto = '';
    let estrep;
    let fservicio = '';
    let nservicio
   // let racion;
   


    //valida que el eRP exista para el tambo
    if (a.erp && a.erp.length != 0) {

  
      erp=a.erp.toString();
           
      let existeeRP = false;
      try {
        await firebase.db.collection('animal').where('idtambo', '==', tamboSel.id).where('erp', 'in', [erp,a.erp]).get().then(snapshot => {
          if (!snapshot.empty) {
            snapshot.forEach(doc => {
              id=doc.id;
              existeeRP = true;
            })
          }
        });
      } catch (error) {
        e = "Fila N°: " + a.fila + " / Error al consultar eRP: " + erp;
        guardarErrores(errores => [...errores, e]);
        errores = true;
      }

      if (!existeeRP) {

        e = "Fila N°: " + a.fila + " / eRP: " + a.erp + " - No existe el eRP en el tambo";
        guardarErrores(errores => [...errores, e]);
        errores = true;
      }
    } else {
      e = "Fila N°: " + a.fila + " / Se debe ingresar un eRP";
      guardarErrores(errores => [...errores, e]);
      errores = true;
    }

    //valida que la lactancia contenga valores
    if (a.lactancia != 0) {
      if (!a.lactancia || isNaN(a.lactancia)) {
        e = "Fila N°: " + a.fila + " / eRP: " + a.erp + " - Debe ingresar el numero de lactancias ";
        guardarErrores(errores => [...errores, e]);
        errores = true;
      }
    }

    //Controla el valor de la categoria
    if (a.categoria) {
      categoria = a.categoria.trim().toLowerCase();
      if (categoria == 'vaca') {
        categoria = 'Vaca';
      } else if (categoria == 'vaquillona') {
        categoria = 'Vaquillona';
      } else {
        e = "Fila N°: " + a.fila + " / eRP: " + a.erp + " - Categoria Incorrecta ";
        guardarErrores(errores => [...errores, e]);
        errores = true;
      }
    } else {
      e = "Fila N°: " + a.fila + " / eRP: " + a.erp + " - Debe ingresar categoria ";
      guardarErrores(errores => [...errores, e]);
      errores = true;
    }

    //Controla el estado productivo
    if (a.estpro) {
      estpro = a.estpro.trim().toLowerCase();
      if (estpro == 'seca') {
        estpro = 'seca';
      } else if (estpro == 'en ordeñe') {
        estpro = 'En Ordeñe';
      } else {
        e = "Fila N°: " + a.fila + " / eRP: " + a.erp + " - Estado productivo incorrecto ";
        guardarErrores(errores => [...errores, e]);
        errores = true;
      }
    } else {
      e = "Fila N°: " + a.fila + " / eRP: " + a.erp + " - Debe ingresar el estado productivo ";
      guardarErrores(errores => [...errores, e]);
      errores = true;
    }

    //valida que la fecha de parto sea numerica (en excel son los dias transcurridos desde el 01/01/1900)
    if (isNaN(a.fparto) && (a.fparto)) {
      e = "Fila N°: " + a.fila + " / eRP: " + a.erp + " - Formato incorrecto de fecha de parto";
      guardarErrores(errores => [...errores, e]);
      errores = true;
    } else {
      if (a.fparto) {
        try {
          fparto = new Date("1899-12-31");
          fparto.setDate(fparto.getDate() + a.fparto);
          fparto = format(fparto, 'yyyy-MM-dd');
        } catch (error) {
          e = "Fila N°: " + a.fila + " / eRP: " + a.erp + " - Formato incorrecto de fecha de parto ";
          guardarErrores(errores => [...errores, e]);
          errores = true;
        }
      }
    }

    //valida que si los kg de racion sean numericos y mayor a cero
   /* 
    if (isNaN(a.racion)) {
      e = "Fila N°: " + a.fila + " / RP: " + a.rp + " - Los Kg. de racion debe ser un valor numérico";
      guardarErrores(errores => [...errores, e]);
      errores = true;
    } else {
      if ((a.racion < 1) || (a.racion > 50)) {
        e = "Fila N°: " + a.fila + " / RP: " + a.rp + " - Los Kg. de racio deben ser mayor a 0 y menor a 50";
        guardarErrores(errores => [...errores, e]);
        errores = true;
      }
    }
    */

    //Controla el valor del estado reproductivo
    if (a.estrep) {
      estrep = a.estrep.trim().toLowerCase();
      if ((estrep != 'vacia') && (estrep != 'vacía') && (estrep != 'preñada')) {
        e = "Fila N°: " + a.fila + " / eRP: " + a.erp + " - Estado reproductivo incorrecto ";
        guardarErrores(errores => [...errores, e]);
        errores = true;
      } else {
        if (estrep == 'vacía') estrep = 'vacia';
      }
    } else {
      e = "Fila N°: " + a.fila + " / eRP: " + a.erp + " - Debe ingresar el estado reproductivo ";
      guardarErrores(errores => [...errores, e]);
      errores = true;
    }

    //valida que la fecha de servicio sea numerica (en excel son los dias transcurridos desde el 01/01/1900)
    if (isNaN(a.fservicio) && (a.fservicio)) {
      e = "Fila N°: " + a.fila + " / eRP: " + a.erp + " - Formato incorrecto de fecha de servicio";
      guardarErrores(errores => [...errores, e]);
      errores = true;
    } else {
      if (a.fservicio) {
        try {
          fservicio = new Date("1899-12-31");
          fservicio.setDate(fservicio.getDate() + a.fservicio);
          fservicio = format(fservicio, 'yyyy-MM-dd');
        } catch (error) {
          e = "Fila N°: " + a.fila + " / eRP: " + a.erp + " - Formato incorrecto de fecha de servicio ";
          guardarErrores(errores => [...errores, e]);
          errores = true;
        }
      }
    }


  
    //valida que si tiene una lactancia tenga fecha de parto
    if ((estpro == 'En Ordeñe') && (!fparto)) {
      e = "Fila N°: " + a.fila + " / eRP: " + a.erp + " - Debe ingresar la fecha del ultimo parto";
      guardarErrores(errores => [...errores, e]);
      errores = true;
    }
    //valida  si está preñada tenga fecha de servicio
    if (estrep == 'preñada') {
      nservicio = 1;
      if (!fservicio) {
        e = "Fila N°: " + a.fila + " / eRP: " + a.erp + " - Debe ingresar la fecha del ultimo servicio";
        guardarErrores(errores => [...errores, e]);
        errores = true;
      }
    } else {
      nservicio = 0;
    }


    //si no hay errores, procede a la actualizacion del animal
    if (!errores) {
  
      //creo el objeto animal
      try {
        const animal = {
         
          lactancia: a.lactancia,
          estpro: estpro,
          estrep: estrep,
          fparto: fparto,
          fservicio: fservicio,
          categoria: categoria,
          erp:erp,
         // racion:racion
        }

        //insertar en base de datos

        await firebase.db.collection('animal').doc(id).update(animal);
        let act = "Fila N°: " + a.fila + " / eRP: " + a.erp + " - Lact.: " + a.lactancia + " - Cat.: " + categoria + "- Est. Prod.:" + estpro + "- Est. Rep.:" + estrep;
        guardarActualizados(actualizados => [...actualizados, act]);
      } catch (error) {
        e = "Fila N°: " + a.fila + " / eRP: " + a.erp + " -Error al actualizar el animal" + error;
        guardarErrores(errores => [...errores, e]);
        errores = true;
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
      titulo="Actualizacion Masiva"
    >
      {procesando ? <ContenedorSpinner> <Spinner animation="border" variant="info" /></ContenedorSpinner> :
        <Botonera>

          <Form
            onSubmit={handleSubmit}
          >
            <Row>

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
                  Actualizar Animales
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

export default Actualizacion