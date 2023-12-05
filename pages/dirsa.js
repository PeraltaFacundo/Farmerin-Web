import React, { useState, useContext, useEffect } from 'react'
import { FirebaseContext } from '../firebase2';
import { Botonera, Mensaje, ContenedorSpinner } from '../components/ui/Elementos';
import Layout from '../components/layout/layout';
import { Button, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';
import Papa from "papaparse";
import { format } from 'date-fns'
import Detalle from '../components/layout/detalle';
import SelectTambo from '../components/layout/selectTambo';
import { v4 as uuidv4 } from 'uuid';


function Dirsa() {
  useEffect(() => {
    const f = format(Date.now(), 'yyyy-MM-dd');
    guardarFecha(f);

  }, [])
  const { usuario, tamboSel, firebase } = useContext(FirebaseContext);
  const [procesando, guardarProcesando] = useState(false);
  const [exito, setExito] = useState(false)
  const [exitoLeche, setExitoleche] = useState(false)
  const [errores, guardarErrores] = useState([]);
  const [actualizados, guardarActualizados] = useState([]);
  // State to store parsed data
  const [parsedData, setParsedData] = useState([]);
  const [fecha, guardarFecha] = useState(null);

  //State to store table Column name
  const [tableRows, setTableRows] = useState([]);
  const [file, guardarFile] = useState(null)
  const [file2, guardarFile2] = useState(null)

  //State to store the values
  const [values, setValues] = useState([]);


  const onFileChange = e => {
    const f = e.target.files[0];
    guardarFile(f);
    guardarFile2(null);
    console.log(file)
  }
  const onFileChange2 = e => {
    const f = e.target.files[0];
    guardarFile2(f);
    guardarFile(null);
    console.log(file2)
  }



  const changeHandler = (e) => {
    e.preventDefault();
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    if (file != null) {
      guardarFile2(null)
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          const rowsArray = [];
          const valuesArray = [];
          let a = {}
          // Iterating data to get column name and their values
          results.data.map((d) => {
            rowsArray.push(Object.keys(d));
            valuesArray.push(Object.values(d));
            if (d["CODIGO DE EVENTO (*)"] == "SE") {

              a = {
                fecha: d["FECHA DE EVENTO (xx/xx/xxxx)"],
                tipo: 'Servicio',
                detalle: d["OBSERV."],
                usuario: usuario.displayName
              }
              const an = {
                fservicio: d["FECHA DE EVENTO (xx/xx/xxxx)"],
                nservicio: 0,
                celo: false,
                estrep: "vacia"
              }
              let rp = d["RP"]
              try {
                firebase.db.collection('animal').where('idtambo', '==', tamboSel.id).where('rp', '==', rp).get().then(snapshot => {
                  if (!snapshot.empty) {
                    snapshot.forEach(doc => {
                      an.nservicio = doc.data().nservicio + 1
                      try {
                        firebase.db.collection('animal').doc(doc.id).update(an)
                        firebase.db.collection('animal').doc(doc.id).collection('eventos').add(a)
                        setExito(true)
                        setExitoleche(false)
                      } catch (error) { console.log(error) }

                    })
                  }
                  else {
                    console.log(rp + "no existe pelotudo")
                  }
                });
              } catch (error) { console.log(error) }


            } else if (d["CODIGO DE EVENTO (*)"] == "PA") {

              let fbaja = '';
              let mbaja = '';
              let cria;
              let base;



              if (d["SEXO CRIA"] == 'H' || d["SEXO CRIA"] == 'HM') {
                base = 'animal';
                if (d["SEXO CRIA"] == 'HM') {
                  fbaja = d["FECHA DE EVENTO (xx/xx/xxxx)"];
                  mbaja = 'Muerto al nacer'
                }
                {
                  cria = {
                    ingreso: d["FECHA DE EVENTO (xx/xx/xxxx)"],
                    idtambo: tamboSel.id,
                    rp: d["RP CRIA"],
                    erp: '',
                    lactancia: 0,
                    observaciones: d["OBSERV."],
                    estpro: 'cria',
                    estrep: 'vacia',
                    fparto: '',
                    fservicio: '',
                    categoria: 'Vaquillona',
                    racion: 0,
                    fracion: '',
                    nservicio: 0,
                    uc: 0,
                    fuc: '',
                    ca: 0,
                    anorm: '',
                    fbaja: fbaja,
                    mbaja: mbaja,
                    rodeo: 0,
                    sugerido: 0
                  }
                }
              } else {
                base = 'macho'
                if (d["SEXO CRIA"] == 'MM') {
                  fbaja = d["FECHA DE EVENTO (xx/xx/xxxx)"];
                  mbaja = 'Muerto al nacer'
                }
                cria = {
                  ingreso: d["FECHA DE EVENTO (xx/xx/xxxx)"],
                  idtambo: tamboSel.id,
                  cat: 'ternero',
                  rp: d["RP CRIA"],
                  fbaja: fbaja,
                  mbaja: mbaja,
                  observaciones: d["OBSERV."],
                }
              }





              a = {
                fecha: d["FECHA DE EVENTO (xx/xx/xxxx)"],
                tipo: 'Parto',
                detalle: d["OBSERV."],
                usuario: usuario.displayName,
                crias: [{
                  id: 1,
                  rp: d["RP CRIA"],
                  sexo: d["SEXO CRIA"],
                  peso: "",
                  trat: "",
                  foto: "",
                  observaciones: "",
                }]
              }

              const an = {
                fparto: d["FECHA DE EVENTO (xx/xx/xxxx)"],
                nservicio: 0,
                categoria: "",
                lactancia: "",
                estrep: "vacia",
                estpro: "En Ordeñe",
              }
              let rp = d["RP"]
              try {
                firebase.db.collection('animal').where('idtambo', '==', tamboSel.id).where('rp', '==', rp).get().then(snapshot => {
                  if (!snapshot.empty) {
                    snapshot.forEach(doc => {
                      let cat;
                      let lact = parseInt(doc.data().lactancia) + 1;
                      if (lact > 1) {
                        cat = 'Vaca'
                      } else {
                        cat = 'Vaquillona';
                      }
                      an.categoria = cat
                      an.lactancia = lact
                      an.nservicio = doc.data().nservicio + 1
                      try {
                        firebase.db.collection('animal').doc(doc.id).update(an)
                        firebase.db.collection('animal').doc(doc.id).collection('eventos').add(a)
                        firebase.db.collection(base).add(cria);
                        setExito(true)
                        setExitoleche(false)
                      } catch (error) { console.log(error) }
                    })
                  }
                  else {
                    console.log("no existe pelotudo")
                  }
                });
              } catch (error) { console.log(error) }
            }
            else if (d["CODIGO DE EVENTO (*)"] == "3") {
              a = {
                fecha: d["FECHA DE EVENTO (xx/xx/xxxx)"],
                tipo: 'Secado',
                detalle: "Secado",
                usuario: usuario.displayName
              }
              const an = {
                estpro: "seca"
              }
              let rp = d["RP"]
              try {
                firebase.db.collection('animal').where('idtambo', '==', tamboSel.id).where('rp', '==', rp).get().then(snapshot => {
                  if (!snapshot.empty) {
                    snapshot.forEach(doc => {
                      try {
                        firebase.db.collection('animal').doc(doc.id).update(an)
                        firebase.db.collection('animal').doc(doc.id).collection('eventos').add(a)
                        setExito(true)
                        setExitoleche(false)
                      } catch (error) { console.log(error) }

                    })
                  }
                  else {
                    console.log(rp + "no existe pelotudo")
                  }
                });
              } catch (error) { console.log(error) }

            }
            else if (d["CODIGO DE EVENTO (*)"] == "P1") {
              a = {
                fecha: d["FECHA DE EVENTO (xx/xx/xxxx)"],
                tipo: 'Tacto',
                detalle: 'Confirmacion Preñez',
                usuario: usuario.displayName
              }
              const an = {
                estrep: 'preñada'
              }
              let rp = d["RP"]
              try {
                firebase.db.collection('animal').where('idtambo', '==', tamboSel.id).where('rp', '==', rp).get().then(snapshot => {
                  if (!snapshot.empty) {
                    snapshot.forEach(doc => {
                      try {
                        firebase.db.collection('animal').doc(doc.id).update(an)
                        firebase.db.collection('animal').doc(doc.id).collection('eventos').add(a)
                        setExito(true)
                        setExitoleche(false)
                      } catch (error) { console.log(error) }

                    })
                  }
                  else {
                    console.log(rp + "no existe pelotudo")
                  }
                });
              } catch (error) { console.log(error) }

            }
            else if (d["CODIGO DE EVENTO (*)"] == "3") {
              a = {
                fecha: d["FECHA DE EVENTO (xx/xx/xxxx)"],
                tipo: 'Baja',
                detalle: "Motivo: Transferencia",
                usuario: usuario.displayName
              }
              const an = {
                fbaja: d["FECHA DE EVENTO (xx/xx/xxxx)"],
                mbaja: "Transferencia"
              }
              let rp = d["RP"]
              try {
                firebase.db.collection('animal').where('idtambo', '==', tamboSel.id).where('rp', '==', rp).get().then(snapshot => {
                  if (!snapshot.empty) {
                    snapshot.forEach(doc => {
                      try {
                        firebase.db.collection('animal').doc(doc.id).update(an)
                        firebase.db.collection('animal').doc(doc.id).collection('eventos').add(a)
                        setExito(true)
                        setExitoleche(false)
                      } catch (error) { console.log(error) }

                    })
                  }
                  else {
                    console.log(rp + "no existe pelotudo")
                  }
                });
              } catch (error) { console.log(error) }

            }
            else if (d["CODIGO DE EVENTO (*)"] == "12") {
              a = {
                fecha: d["FECHA DE EVENTO (xx/xx/xxxx)"],
                tipo: 'Baja',
                detalle: "Motivo: Muerte",
                usuario: usuario.displayName
              }
              const an = {
                fbaja: d["FECHA DE EVENTO (xx/xx/xxxx)"],
                mbaja: "Muerte"
              }
              let rp = d["RP"]
              try {
                firebase.db.collection('animal').where('idtambo', '==', tamboSel.id).where('rp', '==', rp).get().then(snapshot => {
                  if (!snapshot.empty) {
                    snapshot.forEach(doc => {
                      try {
                        firebase.db.collection('animal').doc(doc.id).update(an)
                        firebase.db.collection('animal').doc(doc.id).collection('eventos').add(a)
                        setExito(true)
                        setExitoleche(false)
                      } catch (error) { console.log(error) }

                    })
                  }
                  else {
                    console.log(rp + "no existe pelotudo")
                  }
                });
              } catch (error) { console.log(error) }

            }
            else if (d["CODIGO DE EVENTO (*)"] == "AB") {
              a = {
                fecha: d["FECHA DE EVENTO (xx/xx/xxxx)"],
                tipo: 'Aborto',
                detalle: d["OBSERV."],
                usuario: usuario.displayName
              }
              const an = {
                estrep: 'vacia',
                fparto: d["FECHA DE EVENTO (xx/xx/xxxx)"],
                nservicio: 0
              }
              let rp = d["RP"]
              try {
                firebase.db.collection('animal').where('idtambo', '==', tamboSel.id).where('rp', '==', rp).get().then(snapshot => {
                  if (!snapshot.empty) {
                    snapshot.forEach(doc => {
                      try {
                        firebase.db.collection('animal').doc(doc.id).update(an)
                        firebase.db.collection('animal').doc(doc.id).collection('eventos').add(a)
                        setExito(true)
                        setExitoleche(false)
                      } catch (error) { console.log(error) }

                    })
                  }
                  else {
                    console.log(rp + "no existe pelotudo")
                  }
                });
              } catch (error) { console.log(error) }

            }
            else if (d["CODIGO DE EVENTO (*)"] == "10") {
              a = {
                fecha: d["FECHA DE EVENTO (xx/xx/xxxx)"],
                tipo: 'Baja',
                detalle: "Motivo: Venta",
                usuario: usuario.displayName
              }
              const an = {
                fbaja: d["FECHA DE EVENTO (xx/xx/xxxx)"],
                mbaja: "Venta"
              }
              let rp = d["RP"]
              try {
                firebase.db.collection('animal').where('idtambo', '==', tamboSel.id).where('rp', '==', rp).get().then(snapshot => {
                  if (!snapshot.empty) {
                    snapshot.forEach(doc => {
                      try {
                        firebase.db.collection('animal').doc(doc.id).update(an)
                        firebase.db.collection('animal').doc(doc.id).collection('eventos').add(a)
                        setExito(true)
                        setExitoleche(false)
                      } catch (error) { console.log(error) }

                    })
                  }
                  else {
                    console.log(rp + "no existe pelotudo")
                  }
                });
              } catch (error) { console.log(error) }

            }
          });

          // Parsed Data Response in array format
          setParsedData(results.data);

          // Filtered Column Names
          setTableRows(rowsArray[0]);

          // Filtered Values
          setValues(valuesArray);
        },
      });
    }
    else if (file2 != null) {
      guardarFile(null)
      Papa.parse(file2, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          const rowsArray = [];
          const valuesArray = [];
          let fila = 0;
          guardarErrores([]);
          guardarActualizados([]);
          // Iterating data to get column name and their values
          results.data.map((d) => {
            fila++;
            rowsArray.push(Object.keys(d));
            valuesArray.push(Object.values(d));
            const a = {
              erp: d[" Chip1"],
              lts: d[" Le.UC "].replaceAll(' ', ''),
              anorm: "",
              fila: fila
            }
            if (a.erp != "" && a.lts.includes(",") && a.erp != undefined) {
              cargarAnimal(a)
            }
          })
        },
      });
    }
  };



  async function cargarAnimal(a) {
    let litros;
    let e = '';
    let erp;
    try {
      litros = a.lts.toString();
      if (litros.includes(",")) {
        litros = litros.replace(',', '.');
      }
    } catch (error) {
      e = "Fila N°: " + a.fila + " / eRP: " + a.erp + " - Error de formato en Lts.";
      guardarErrores(errores => [...errores, e]);
    }
    try {
      erp = a.erp.toString();
    } catch (error) {
      e = "Fila N°: " + a.fila + " - Error en eRP.";
      guardarErrores(errores => [...errores, e]);
    }

    let valores;
    if (isNaN(litros) || (!litros)) {
      e = "Fila N°: " + a.fila + " / eRP: " + a.erp + " - Los litros deben ser un valor numérico";
      guardarErrores(errores => [...errores, e]);
    } else {
      if (e == '') {

        await firebase.db.collection('animal').where('idtambo', '==', tamboSel.id).where('erp', 'in', [erp, a.erp]).get().then(snapshot => {
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
                setExitoleche(true)
                setExito(false)
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

  return (
    <Layout
      titulo="Dirsa"
    >
      <Botonera style={{ marginTop: 0, marginBottom: 0 }}>

        <Form
          onSubmit={changeHandler}
        >
          <Row style={{ alignItems: "center" }}>
            <Col style={{ width: "50%", marginTop: 25 }}>
              <input
                id="filePicker"
                type="file"
                name="file"
                onChange={onFileChange}
                accept=".csv"
                style={{ visibility: "hidden" }}
              />
              <label htmlFor="filePicker" style={{ background: "brown", padding: "5px 10px", cursor: "pointer", color: "white", fontWeight: "bold", borderRadius: "10px", width: "100%", height: "50px", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                Cargar Eventos</label>
              <Button
                style={{ fontWeight: "bold", borderRadius: "10px", width: "100%", height: "50px", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}
                variant="info"
                type="submit"
                block
              >Actualizar</Button>

              <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <p style={{ color: "grey", fontWeight: "bold", fontSize: "16px", marginTop: 10 }}>{file != null ? file.name : "No hay archivos de eventos cargados"}</p>
              </div>
            </Col>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <img src="/dirsa.png" width={300} />
            </div>
            <Col style={{ width: "50%", marginTop: 25 }}>
              <input
                id="filePicker2"
                type="file"
                name="file"
                onChange={onFileChange2}
                accept=".csv"
                style={{ visibility: "hidden" }}
              />
              <label htmlFor="filePicker2" style={{ background: "orange", padding: "5px 10px", cursor: "pointer", color: "white", fontWeight: "bold", borderRadius: "10px", width: "100%", height: "50px", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                Cargar Control Lechero</label>

              <Button
                style={{ fontWeight: "bold", borderRadius: "10px", width: "100%", height: "50px", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}
                variant="success"
                type="submit"
                block
              >Actualizar</Button>

              <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <p style={{ color: "grey", fontWeight: "bold", fontSize: "16px", marginTop: 10 }}>{file2 != null ? file2.name : "No hay archivos de control.L cargados"}</p>
              </div>
            </Col>
          </Row>
        </Form>
      </Botonera>
      {exito ?
        <div style={{ backgroundColor: "green", height: 65, marginTop: 20, color: "white", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <h2 style={{ fontWeight: "bold", margin: 0 }}>LA CARGA DE EVENTOS SE HA COMPLETADO CON EXITO</h2>
        </div> : null}
      {exitoLeche ?
        <div style={{ backgroundColor: "green", height: 65, marginTop: 20, color: "white", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <h2 style={{ fontWeight: "bold", margin: 0 }}>LA CARGA DE CONTROL LECHERO SE HA COMPLETADO CON EXITO</h2>
        </div> : null}
      {tamboSel ?
        <Mensaje>
          {actualizados.length != 0 &&

            <Alert variant="success"  >
              <Alert.Heading style={{textAlign:"center", marginBottom:15}}>Se actualizaron los siguientes animales:</Alert.Heading>

              {actualizados.map(a => (

                <Detalle
                  key={uuidv4()}
                  info={a}

                />

              ))}

            </Alert>
          }
          {errores.length != 0 &&

            <Alert variant="danger"  >
              <Alert.Heading style={{textAlign:"center", marginBottom:15}}>Se produjeron los siguientes errores:</Alert.Heading>
              {errores.map(a => (
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
  );
}

export default Dirsa