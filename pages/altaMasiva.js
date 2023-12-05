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


const AltaMasiva = () => {

  const { firebase, tamboSel } = useContext(FirebaseContext);
  const [file, guardarFile] = useState(null);
  const [errores, guardarErrores] = useState([]);
  const [actualizados, guardarActualizados] = useState([]);
  const [procesando, guardarProcesando] = useState(false);
  //const patron = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;




  const handleSubmit = e => {
    e.preventDefault();
    if (file) cargarControl();

  }

  async function cargarControl() {
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
            rp: r[1],
            ingreso: r[2],
            lactancia: r[3],
            categoria: r[4],
            estpro: r[5],
            fparto: r[6],
            racion: r[7],
            uc: r[8],
            anorm: r[9],
            estrep: r[10],
            fservicio: r[11],
            observaciones: r[12],
            fila: fila
          }


          cargarAnimal(a);

        }

      });

    })
    guardarFile(null);
    guardarProcesando(false);
  }

  async function cargarAnimal(a) {

    let errores = false;
    let e = '';
    let erp='';
    let rp = '';
    let ingreso;
    let categoria;
    let estpro;
    let fparto = '';
    let estrep;
    let fservicio = '';
    let nservicio;


    //valida que el RP no exista
    if (a.rp && a.rp.length != 0) {

      //si es un numero lo convierto a String
      if (isNaN(a.rp)) {
        rp = a.rp;
      } else {
        rp = a.rp.toString()
      }

      let existeRP = false;
      try {
        await firebase.db.collection('animal').where('idtambo', '==', tamboSel.id).where('rp', '==', rp).get().then(snapshot => {
          if (!snapshot.empty) {
            snapshot.forEach(doc => {

              existeRP = true;

            });

          }
        });
      } catch (error) {
        e = "Fila N°: " + a.fila + " / RP: " + a.rp + " - Error al consultar RP: " + rp;
        guardarErrores(errores => [...errores, e]);
        errores = true;
      }

      if (existeRP) {

        e = "Fila N°: " + a.fila + " / RP: " + a.rp + " - El RP ya existe en el tambo";
        guardarErrores(errores => [...errores, e]);
        errores = true;
      }
    } else {
      e = "Fila N°: " + a.fila + " / Se debe ingresar un RP";
      guardarErrores(errores => [...errores, e]);
      errores = true;
    }

    //valida que el eRP tenga 15 digitos y que no exista
    if (a.erp && a.erp.length != 0) {
      erp=a.erp.toString()
      if (isNaN(a.erp)) {
        e = "Fila N°: " + a.fila + " / RP: " + a.rp + " - El eRP debe ser numerico: " + a.erp;
        guardarErrores(errores => [...errores, e]);
        errores = true;
      } else {
        if (erp.length != 15) {
          e = "Fila N°: " + a.fila + " / RP: " + a.rp + " - El eRP debe tener 15 dígitos: " + a.erp ;
          guardarErrores(errores => [...errores, e]);
          errores = true;
        } else {

          let existeERP = false;
          try {
            
            await firebase.db.collection('animal').where('idtambo', '==', tamboSel.id).where('erp', '==', a.erp).get().then(snapshot => {
              if (!snapshot.empty) {
                snapshot.forEach(doc => {

                  existeERP = true;

                });

              }
            });
          } catch (error) {
            e = "Fila N°: " + a.fila + " / RP: " + a.rp + " - Error al consultar el eRP: " + a.erp;
            guardarErrores(errores => [...errores, e]);
            errores = true;
          }

          if (existeERP) {
            e = "Fila N°: " + a.fila + " / RP: " + a.rp + " - El eRP ya existe en el tambo: " + a.erp;
            guardarErrores(errores => [...errores, e]);
            errores = true;
          }
        }
      }
    }

    //valida que la fecha sea numerica (en excel son los dias transcurridos desde el 01/01/1900)
    if (isNaN(a.ingreso) || !a.ingreso) {
      e = "Fila N°: " + a.fila + " / RP: " + a.rp + " - Formato incorrecto de fecha de ingreso ";
      guardarErrores(errores => [...errores, e]);
      errores = true;
    } else {
      try {

        ingreso = new Date("1899-12-31");
        ingreso.setDate(ingreso.getDate() + a.ingreso);
        ingreso = format(ingreso, 'yyyy-MM-dd');
      } catch (error) {
        e = "Fila N°: " + a.fila + " / RP: " + a.rp + " - Formato incorrecto de fecha de ingreso";
        guardarErrores(errores => [...errores, e]);
        errores = true;
      }
    }


    //valida que la lactancia contenga valores
    if (a.lactancia!=0){
      if (!a.lactancia || isNaN(a.lactancia)) {
        e = "Fila N°: " + a.fila + " / RP: " + a.rp + " - Debe ingresar el numero de lactancias ";
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
        e = "Fila N°: " + a.fila + " / RP: " + a.rp + " - Categoria Incorrecta ";
        guardarErrores(errores => [...errores, e]);
        errores = true;
      }
    } else {
      e = "Fila N°: " + a.fila + " / RP: " + a.rp + " - Debe ingresar categoria ";
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
        e = "Fila N°: " + a.fila + " / RP: " + a.rp + " - Estado productivo incorrecto ";
        guardarErrores(errores => [...errores, e]);
        errores = true;
      }
    } else {
      e = "Fila N°: " + a.fila + " / RP: " + a.rp + " - Debe ingresar el estado productivo ";
      guardarErrores(errores => [...errores, e]);
      errores = true;
    }

    //valida que la fecha de parto sea numerica (en excel son los dias transcurridos desde el 01/01/1900)
    if (isNaN(a.fparto) && (a.fparto)) {
      e = "Fila N°: " + a.fila + " / RP: " + a.rp + " - Formato incorrecto de fecha de parto";
      guardarErrores(errores => [...errores, e]);
      errores = true;
    } else {
      if (a.fparto) {
        try {
          fparto = new Date("1899-12-31");
          fparto.setDate(fparto.getDate() + a.fparto);
          fparto = format(fparto, 'yyyy-MM-dd');
        } catch (error) {
          e = "Fila N°: " + a.fila + " / RP: " + a.rp + " - Formato incorrecto de fecha de parto ";
          guardarErrores(errores => [...errores, e]);
          errores = true;
        }
      }
    }
    //valida que si los kg de racion sean numericos y mayor a cero
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

    //Controla el valor del estado reproductivo
    if (a.estrep) {
      estrep = a.estrep.trim().toLowerCase();
      if ((estrep != 'vacia')&& (estrep != 'vacía') && (estrep != 'preñada')) {
        e = "Fila N°: " + a.fila + " / RP: " + a.rp + " - Estado reproductivo incorrecto ";
        guardarErrores(errores => [...errores, e]);
        errores = true;
      }else{
        if (estrep=='vacía') estrep='vacia';
      }
    } else {
      e = "Fila N°: " + a.fila + " / RP: " + a.rp + " - Debe ingresar el estado reproductivo ";
      guardarErrores(errores => [...errores, e]);
      errores = true;
    }

    //valida que la fecha de servicio sea numerica (en excel son los dias transcurridos desde el 01/01/1900)
    if (isNaN(a.fservicio) && (a.fservicio)) {
      e = "Fila N°: " + a.fila + " / RP: " + a.rp + " - Formato incorrecto de fecha de servicio";
      guardarErrores(errores => [...errores, e]);
      errores = true;
    } else {
      if (a.fservicio) {
        try {
          fservicio = new Date("1899-12-31");
          fservicio.setDate(fservicio.getDate() + a.fservicio);
          fservicio = format(fservicio, 'yyyy-MM-dd');
        } catch (error) {
          e = "Fila N°: " + a.fila + " / RP: " + a.rp + " - Formato incorrecto de fecha de servicio ";
          guardarErrores(errores => [...errores, e]);
          errores = true;
        }
      }
    }

    
    //valida que si el control lechero tiene valores, sea numerico
    if (isNaN(a.uc)) {
      e = "Fila N°: " + a.fila + " / RP: " + a.rp + " - Los litros deben ser un valor numérico";
      guardarErrores(errores => [...errores, e]);
      errores = true;
    }

    //valida que si tiene una lactancia tenga fecha de parto
    if ((estpro == 'En Ordeñe') && (!fparto)) {
      e = "Fila N°: " + a.fila + " / RP: " + a.rp + " - Debe ingresar la fecha del ultimo parto";
      guardarErrores(errores => [...errores, e]);
      errores = true;
    }
    //valida  si está preñada tenga fecha de servicio
    if (estrep == 'preñada') {
      nservicio = 1;
      if (!fservicio) {
        e = "Fila N°: " + a.fila + " / RP: " + a.rp + " - Debe ingresar la fecha del ultimo servicio";
        guardarErrores(errores => [...errores, e]);
        errores = true;
      }
    } else {
      nservicio = 0;
    }


    //si no hay errores, procede al alta del animal
    if (!errores) {
      /*
      let act = "Fila N°: " + a.fila + " Log: "+ingreso ;
      guardarActualizados(actualizados => [...actualizados, act]);
      */
      //creo el objeto animal
      try {
        const animal = {

          idtambo: tamboSel.id,
          ingreso: ingreso,
          rp: rp,
          erp: a.erp,
          lactancia: a.lactancia,
          observaciones: a.observaciones,
          estpro: estpro,
          estrep: estrep,
          fparto: fparto,
          fservicio: fservicio,
          categoria: categoria,
          racion: a.racion,
          fracion: firebase.ayerTimeStamp(),
          nservicio: nservicio,
          uc: a.uc,
          fuc: firebase.nowTimeStamp(),
          ca: 0,
          anorm: a.anorm,
          fbaja: '',
          mbaja: '',
          rodeo: 0,
          sugerido: 0
        }

        //insertar en base de datos

        await firebase.db.collection('animal').add(animal);
        let act = "Fila N°: " + a.fila + " / RP: " + a.rp + " - eRP: " + a.erp + " - Lact.: " + a.lactancia + " - Cat.: " + categoria + "- Est. Prod.:" + estpro;
        guardarActualizados(actualizados => [...actualizados, act]);
      } catch (error) {
        e = "Fila N°: " + a.fila + " / RP: " + a.rp + " -Error al dar de alta el animal"+error;
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
      titulo="Alta Masiva"
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
                  Cargar Animales
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
              <Alert.Heading>Se dieron de alta los siguientes animales:</Alert.Heading>

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

export default AltaMasiva