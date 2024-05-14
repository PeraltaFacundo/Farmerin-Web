import React, { useEffect, useState, useContext } from 'react';
import Layout from '../components/layout/layout';
import { FirebaseContext } from '../firebase2';

const Monitor = () => {
    const { firebase, tamboSel } = useContext(FirebaseContext);
    const [tamboLink, setTamboLink] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const obtenerEnlaceMonitor = async () => {
            try {
                if (tamboSel) {
                    const docSnapshot = await firebase.db.collection('tambo').doc(tamboSel.id).get();
                    if (docSnapshot.exists) {
                        const linkValue = docSnapshot.data().monitor;
                        setTamboLink(linkValue);
                    } else {
                        console.log("El documento no existe");
                    }
                }
            } catch (error) {
                console.error("Error al obtener el enlace del monitor:", error);
            } finally {
                setLoading(false);
            }
        };

        obtenerEnlaceMonitor();
    }, [tamboSel, firebase]);

    return (
        <Layout titulo="Monitor">
            <div>
                {loading ? (
                    <p>Cargando...</p>
                ) : tamboLink ? (
                    <iframe src={tamboLink} title="Monitor" style={{ width: '100%', height: '1000px', border: '1px solid #fff', borderRadius: '10px' }} />
                ) : (
                    <p>EL CONTENIDO DEL MONITOR NO ESTÁ DISPONIBLE EN ESTE MOMENTO.</p>
                )}
            </div>
        </Layout>
    );
};

export default Monitor;
