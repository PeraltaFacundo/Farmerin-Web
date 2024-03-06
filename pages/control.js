import React, { useState, useEffect, useContext } from 'react'
import { FirebaseContext } from '../firebase2';
import { Botonera, Mensaje, ContenedorSpinner, Contenedor } from '../components/ui/Elementos';
import Layout from '../components/layout/layout';
import DetalleControl from '../components/layout/detalleControl';
import SelectTambo from '../components/layout/selectTambo';
import StickyTable from "react-sticky-table-thead";
import differenceInDays from 'date-fns/differenceInDays';
import { Alert, Table } from 'react-bootstrap';
import { FaSort } from 'react-icons/fa';

// Control

const Control = () => {
    //states de ordenamiento
    const [animales, guardarAnimales] = useState([]);
    const [promAct, guardarPromAct] = useState(0);
    const [promSug, guardarPromSug] = useState(0);
    const [promLac, guardarPromLac] = useState(0);
    const [orderRp, guardarOrderRp] = useState('asc');
    const [orderEr, guardarOrderEr] = useState('asc');
    const [orderEp, guardarOrderEp] = useState('asc');
    const [orderGr, guardarOrderGr] = useState('asc');
    const [orderRo, guardarOrderRo] = useState('asc');
    const [orderLact, guardarOrderLact] = useState('asc');
    const [orderUC, guardarOrderUC] = useState('asc');
    const [orderCA, guardarOrderCA] = useState('asc');
    const [orderAn, guardarOrderAn] = useState('asc');
    const [orderDl, guardarOrderDl] = useState('asc');
    const [orderDP, guardarOrderDP] = useState('asc');
    const [orderRac, guardarOrderRac] = useState('asc');

    const { firebase, tamboSel } = useContext(FirebaseContext);
    let prom = 0;
    let promS = 0;
    let promL = 0;
    let diasLact = 0;
    let diasPre = 0;
    useEffect(() => {

        if (tamboSel) {

            const obtenerAnim = () => {
                try {
                    firebase.db.collection('animal').where('idtambo', '==', tamboSel.id).where('estpro', '==', 'En Ordeñe').where('fbaja', '==', '').orderBy('rp').get().then(snapshotAnimal)
                } catch (error) {
                    console.log(error)
                }
            }
            //busca los animales en ordeñe
            obtenerAnim();

        }
    }, [tamboSel])


    useEffect(() => {
        promedioActual();

    }, [animales])

    //const calcular promedio de racion
    const promedioActual = () => {
        animales.every(a => {
            promL = promL + parseInt(a.diasLact);
            prom = prom + parseInt(a.racion);
            promS = promS + parseInt(a.sugerido);
            return true;
        });

        if (animales.length != 0) {
            prom = prom / animales.length;
            prom = prom.toFixed(2);
            promS = promS / animales.length;
            promS = promS.toFixed(2);
            promL = promL / animales.length;
            promL = promL.toFixed(2);
            guardarPromAct(prom);
            guardarPromSug(promS);
            guardarPromLac(promL);
        }

    }



    function snapshotAnimal(snapshot) {
        const an = snapshot.docs.map(doc => {
            try {
                diasLact = differenceInDays(Date.now(), new Date(doc.data().fparto));
            } catch {
                diasLact = 0;
            }

            try {
                //Calcula los dias de preñez
                if (doc.data().estrep == "vacia") {
                    diasPre = 0;
                } else {
                    diasPre = differenceInDays(Date.now(), new Date(doc.data().fservicio));
                }
            } catch {
                diasPre = 0;
            };
            return {
                id: doc.id,
                diasLact: diasLact,
                diasPre: diasPre,
                actu: false,
                ...doc.data()
            }

        })

        //aca, antes de guardar animales, recorro el array an y le agrego el sugerido 
        //y la diferencia entre el actual y el sugerido. Despues ordeno en forma descendente 
        //por diferencia y despues guardo animales. En detalle de control, elimino el calculo de sugerido.
        function compare(a, b) {

            let difa = Math.abs(parseInt(a.racion) - parseInt(a.sugerido));
            let difb = Math.abs(parseInt(b.racion) - parseInt(b.sugerido));

            if (difa < difb) {
                return 1;
            }
            if (difa > difb) {
                return -1;
            }
            return 0;
        }  

        an.sort(compare);
        guardarAnimales(an);
    }

    const handleClickRP = e => {
        e.preventDefault();
        if (orderRp == 'asc') {
            const a = animales.sort((a, b) => (a.rp < b.rp) ? 1 : -1);
            guardarOrderRp('desc');
            guardarAnimales(a);
        } else {
            const b = animales.sort((a, b) => (a.rp > b.rp) ? 1 : -1);
            guardarOrderRp('asc');
            guardarAnimales(b);
        }



    }


    const handleClickER = e => {
        e.preventDefault();
        if (orderEr == 'asc') {
            const a = animales.sort((a, b) => (a.estrep < b.estrep) ? 1 : -1);
            guardarOrderEr('desc');
            guardarAnimales(a);
        } else {
            const b = animales.sort((a, b) => (a.estrep > b.estrep) ? 1 : -1);
            guardarOrderEr('asc');
            guardarAnimales(b);
        }



    }

    const handleClickEP = e => {
        e.preventDefault();
        if (orderEp == 'asc') {
            const a = animales.sort((a, b) => (a.estpro < b.estpro) ? 1 : -1);
            guardarOrderEp('desc');
            guardarAnimales(a);
        } else {
            const b = animales.sort((a, b) => (a.estpro > b.estpro) ? 1 : -1);
            guardarOrderEp('asc');
            guardarAnimales(b);
        }



    }

    const handleClickGr = e => {
        e.preventDefault();
        if (orderGr == 'asc') {
            const a = animales.sort((a, b) => (a.categoria < b.categoria) ? 1 : -1);
            guardarOrderGr('desc');
            guardarAnimales(a);
        } else {
            const b = animales.sort((a, b) => (a.categoria > b.categoria) ? 1 : -1);
            guardarOrderGr('asc');
            guardarAnimales(b);
        }



    }

    const handleClickRo = e => {
        e.preventDefault();
        if (orderRo == 'asc') {
            const a = animales.sort((a, b) => (a.rodeo < b.rodeo) ? 1 : -1);
            guardarOrderRo('desc');
            guardarAnimales(a);
        } else {
            const b = animales.sort((a, b) => (a.rodeo > b.rodeo) ? 1 : -1);
            guardarOrderRo('asc');
            guardarAnimales(b);
        }



    }

    const handleClickLact = e => {
        e.preventDefault();
        if (orderLact == 'asc') {
            const a = animales.sort((a, b) => (parseInt(a.lactancia) < parseInt(b.lactancia)) ? 1 : -1);
            guardarOrderLact('desc');
            guardarAnimales(a);
        } else {
            const b = animales.sort((a, b) => (parseInt(a.lactancia) > parseInt(b.lactancia)) ? 1 : -1);
            guardarOrderLact('asc');
            guardarAnimales(b);
        }
    }

    const handleClickUC = e => {
        e.preventDefault();
        if (orderUC == 'asc') {
            const a = animales.sort((a, b) => (parseFloat(a.uc) < parseFloat(b.uc)) ? 1 : -1);
            guardarOrderUC('desc');
            guardarAnimales(a);
        } else {
            const b = animales.sort((a, b) => (parseFloat(a.uc) > parseFloat(b.uc)) ? 1 : -1);
            guardarOrderUC('asc');
            guardarAnimales(b);
        }

    }

    const handleClickCA = e => {
        e.preventDefault();
        if (orderCA == 'asc') {
            const a = animales.sort((a, b) => (parseFloat(a.ca) < parseFloat(b.ca)) ? 1 : -1);
            guardarOrderCA('desc');
            guardarAnimales(a);
        } else {
            const b = animales.sort((a, b) => (parseFloat(a.ca) > parseFloat(b.ca)) ? 1 : -1);
            guardarOrderCA('asc');
            guardarAnimales(b);
        }

    }

    const handleClickAn = e => {
        e.preventDefault();
        if (orderAn == 'asc') {
            const a = animales.sort((a, b) => (a.anorm < b.anorm) ? 1 : -1);
            guardarOrderAn('desc');
            guardarAnimales(a);
        } else {
            const b = animales.sort((a, b) => (a.anorm > b.anorm) ? 1 : -1);
            guardarOrderAn('asc');
            guardarAnimales(b);
        }

    }

    const handleClickDl = e => {
        e.preventDefault();
        if (orderDl == 'asc') {
            const a = animales.sort((a, b) => (parseInt(a.diasLact) < parseInt(b.diasLact)) ? 1 : -1);
            guardarOrderDl('desc');
            guardarAnimales(a);
        } else {
            const b = animales.sort((a, b) => (parseInt(a.diasLact) > parseInt(b.diasLact)) ? 1 : -1);
            guardarOrderDl('asc');
            guardarAnimales(b);
        }
    }

    const handleClickDP = e => {
        e.preventDefault();
        if (orderDP == 'asc') {
            const a = animales.sort((a, b) => (parseInt(a.diasLact) < parseInt(b.diasLact)) ? 1 : -1);
            guardarOrderDP('desc');
            guardarAnimales(a);
        } else {
            const b = animales.sort((a, b) => (parseInt(a.diasLact) > parseInt(b.diasLact)) ? 1 : -1);
            guardarOrderDP('asc');
            guardarAnimales(b);
        }
    }

    const handleClickRac = e => {
        e.preventDefault();
        if (orderRac == 'asc') {
            const a = animales.sort((a, b) => (parseInt(a.racion) < parseInt(b.racion)) ? 1 : -1);
            guardarOrderRac('desc');
            guardarAnimales(a);
        } else {
            const b = animales.sort((a, b) => (parseInt(a.racion) > parseInt(b.racion)) ? 1 : -1);
            guardarOrderRac('asc');
            guardarAnimales(b);
        }
    }

    return (

        <Layout
            titulo="Nutricion"
        >

            <Botonera>
                <h6>Control de alimentación: {animales.length} animales - Promedio actual: {promAct} Kgs.- Promedio Sugerido: {promSug} Kgs.- Promedio Dias Lact.: {promLac} Dias.</h6>
            </Botonera >

            {tamboSel ?

                animales.length == 0 ?
                    <Mensaje>
                        <Alert variant="warning" >No se encontraron resultados</Alert>
                    </Mensaje>
                    :
                    <Contenedor>
                        <StickyTable height={450}>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th onClick={handleClickRP}>RP  <FaSort size={15} /></th>
                                        <th onClick={handleClickLact}>Lact.<FaSort size={15} /></th>
                                        <th onClick={handleClickGr}>Categ <FaSort size={15} /></th>
                                        <th onClick={handleClickRo}>Rodeo <FaSort size={15} /></th>
                                        <th onClick={handleClickUC}>Le.UC <FaSort size={15} /> </th>
                                        <th>F.UC </th>
                                        <th onClick={handleClickCA}>Le.CA <FaSort size={15} /></th>
                                        <th onClick={handleClickAn}>Anorm. <FaSort size={15} /></th>
                                        <th onClick={handleClickDl}>Días Lact. <FaSort size={15} /></th>
                                        <th onClick={handleClickER}>Est. Rep. <FaSort size={15} /></th>
                                        <th onClick={handleClickDP}>Días Preñ. <FaSort size={15} /></th>
                                        <th onClick={handleClickRac}>Ración. <FaSort size={15} /></th>
                                        <th>F.Racion </th>
                                        <th></th>
                                        <th>Ración Sugerida</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {animales.map(a => (
                                        <DetalleControl
                                            key={a.id}
                                            animal={a}
                                            animales={animales}
                                            guardarAnimales={guardarAnimales}

                                        />
                                    )
                                    )}
                                </tbody>
                            </Table>
                        </StickyTable>
                    </Contenedor>
                :
                <SelectTambo />

            }
        </Layout >

    )
}

export default Control