import React, { useState, useEffect, useContext } from 'react';
import { Row, Form, Col, Modal, Button } from 'react-bootstrap';
import { FirebaseContext } from '../../firebase2';
import {useRouter} from 'next/router';

const SelectTambo = () => {

    const [tambos, guardarTambos] = useState([]);
    const [show, setShow] = useState(false);
    const { firebase, usuario, guardarTamboSel } = useContext(FirebaseContext);
    const router=useRouter();
    let idtambo;

    useEffect(() => {
        obtenerTambos();
    }, [])

    const handleClose = () => {

        if (idtambo && idtambo!=0){
            const filtro = tambos.filter(tambo => {
                return (
                  tambo.id==idtambo
                )
              });
            setShow(false);
            guardarTamboSel(filtro[0]);
        }

    };

    //obtiene los tambos al cargar el component
    async function obtenerTambos() {
        try{
            firebase.db.collection('tambo').where('usuarios', 'array-contains',usuario.uid).orderBy('nombre', 'desc').onSnapshot(snapshotTambo);
        }catch (error){
            router.push('/login');
        }
    }

    function snapshotTambo(snapshot) {
        const tambos = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            }
        })
        guardarTambos(tambos);
        //si no hay tambos asociados al usuario lo envío al index
        if (tambos.length ==0){
            router.push('/');
        }else{
            //si hay sólo un tambo, lo selecciono
            if (tambos.length ==1){
                guardarTamboSel(tambos[0]);
            }else{
                //muestro el select de tambos
                setShow(true);
            }
        }
    }

    const changeTambo = e => {
        e.preventDefault();
        idtambo = e.target.value;

    }

    return (

        <Modal show={show} onHide={handleClose}
            size="lg"
            centered
        >

            <Modal.Body>
                <Form.Group>
                    <Form.Control
                        as="select"
                        id="tambo"
                        name="tambo"
                        value={idtambo}
                        placeholder="seleccione tambo"
                        onChange={changeTambo}
                        onBlur={changeTambo}
                    >
                        <option value="0" >Seleccione tambo...</option>
                        {tambos.map(t => (
                            <option key={t.id} value={t.id}>{t.nombre}</option>
                        )
                        )}
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Button
                        variant="info" block
                        onClick={handleClose}
                    >
                        Seleccionar
               </Button>
                </Form.Group>
            </Modal.Body>

        </Modal>



    );
}

export default SelectTambo;