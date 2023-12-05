import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AiOutlineBars } from 'react-icons/ai';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { FiLogOut } from "react-icons/fi";
import { Button } from 'react-bootstrap';
import Switch from 'react-switch';
import { FirebaseContext } from '../../firebase2';
import { Badge, Modal, Alert } from 'react-bootstrap';
import DetalleAlerta from './detalleAlerta';
import { ContenedorAlertas } from '../ui/Elementos';
import { useDispatch, useSelector } from "react-redux";
import { updateValor } from '../../redux/valorSlice';


const Navegacion = ({ collapsed, toggled, handleToggleSidebar, handleCollapsedChange, titulo }) => {
    const { usuario, firebase, guardarTamboSel, tambos,tamboSel, porc, setPorc  } = useContext(FirebaseContext);
    const router = useRouter();
    const [show, setShow] = useState(false);
    const [alertas, guardarAlertas] = useState([]);
    const [alertasSinLeer, guardarAlertasSinLeer] = useState([]);
    const [error, guardarError] = useState(false);
    let variante = "warning";
   
    
    const dispatch = useDispatch();
    const valor = useSelector((state) => state.valor)

    const handdleChangeValor = (e) => {

       dispatch(updateValor(e.target.value));

    }
      
        useEffect(() => {
          // Actualizar el valor cuando "porc" cambie
          dispatch(updateValor(porc));
        }, [porc, dispatch]);
      
        useEffect(() => {
          // Actualizar "porc" cuando cambie "tamboSel"
          if (tamboSel) {
            dispatch(updateValor(tamboSel.porcentaje));
          }
        }, [tamboSel, dispatch]);
        

    useEffect(() => {
        tambos && obtenerAlertas();
    }, [tambos]);

    async function vista(a){
        const valores={
            idtambo:a.idtambo,
            fecha:a.fecha,
            mensaje:a.mensaje,
            visto:true
        }
         //update en base de datos
        try {
            await firebase.db.collection('alerta').doc(a.id).update(valores);
      
        } catch (error) {
            console.log(error);
        }

    }

    const handleClose = () => setShow(false);
    const handleShow = () => {
        alertasSinLeer.forEach(a => {
            vista(a);
        })

        setShow(true);
        guardarAlertasSinLeer([]);

    };

    function cerrarSesion() {
        guardarTamboSel(null);
        firebase.logout();
        return router.push('/login');
    }
    async function obtenerAlertas(idtambo) {

        const tambosArray = tambos.map(t => {
            return t.id;
        });

        try {
            await firebase.db.collection('alerta').where('idtambo', 'in', tambosArray).orderBy('fecha', 'desc').get().then(snapshotAlerta);

        } catch (error) {
            console.log(error);
            guardarError(true);

        }

    }

    function snapshotAlerta(snapshot) {
        const alertasTambos = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            }
        })
        guardarAlertas(alertasTambos);
        const alertasSinVer = alertasTambos.filter(a => {
            if (a.visto) return false;
            return a;
        });
        guardarAlertasSinLeer(alertasSinVer);
        if (alertasSinVer.length > 0) variante = "danger";

    }

    


    return (
        <header>
            

            <div className="elem-header">
                <div className="block ">
                    <Switch
                        height={16}
                        width={30}
                        checkedIcon={false}
                        uncheckedIcon={false}
                        onChange={handleCollapsedChange}
                        checked={collapsed}
                        onColor="#219de9"
                        offColor="#bbbbbb"
                    />
                </div>

                <div className='hambur' onClick={() => handleToggleSidebar(true)}>
                    <AiOutlineBars size={40} />
                </div>
                <div className='responsive'>

                <h5>{titulo} {tamboSel && ' - '+tamboSel.nombre} </h5>

            </div>

            <div className="elem-header-der">
                {usuario &&
                    <>
                        <Button 
                            variant="link"
                            onClick={handleShow}
                        >
                            <IoIosNotificationsOutline size={32} />
                            {alertasSinLeer &&

                                <Badge
                                    variant={variante}
                                >

                                    {alertasSinLeer.length}
                                </Badge>
                            }
                        </Button>
                    &nbsp;
                    &nbsp;
                    &nbsp;
                    
                    <Button  
                            variant="outline-info"
                            onClick={cerrarSesion}
                        >
                            <FiLogOut size={24} />
                        &nbsp;
                        {usuario.displayName}
                    </Button>
                    </>
                }
                </div>


            </div>
            <Modal size="lg" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <p>Alertas</p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {alertas && (alertas.length > 0) ?
                        <ContenedorAlertas>
                        {alertas.map(a => (
                            <DetalleAlerta
                                key={a.id}
                                alerta={a}
                                alertas={alertas}
                                guardarAlertas={guardarAlertas}
                            />
                        )
                        )}
                        </ContenedorAlertas>

                        :
                        <Alert variant="warning" >No se registran alertas</Alert>
                     
                    }

                </Modal.Body>

            </Modal>
            <div>
            {valor !== 0 && valor < 0 ? (
                  <div className="elem-porc-reduccion" style={{ marginTop: 2, marginBottom: 2}}>
                  <h2 className='elem-reduc-letras'> SE APLICO UN AUMENTO EN LA RACION</h2>
                 
                  </div>
                ) : null}
                {valor !== 0 && valor > 0 ? (
                 <div className="elem-porc-aumento"style={{marginTop: 2, marginBottom: 2}}>
                 <h2 className='elem-aumen-letras'> SE APLICO UNA DISMINUCION EN LA RACION </h2>
                

                </div>
                ) : null}
            </div>
            
        </header>

    );
}

export default Navegacion;