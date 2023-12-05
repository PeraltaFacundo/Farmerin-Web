import app from 'firebase/app';
import firebaseConfig from './config';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

//import { initializeApp } from 'firebase-admin/app';


class Firebase {
    constructor() {
        if (!app.apps.length) {
            app.initializeApp(firebaseConfig)
        }
        this.auth = app.auth();
        this.db = app.firestore();
    }


    //registra usuario
    async registrar(nombre, email, password) {

        const nuevoUsuario = await this.auth.createUserWithEmailAndPassword(email, password);

        return await nuevoUsuario.user.updateProfile(
            {
                displayName: nombre,
            }
        );
    }
    /*registra usuario
    async getUsuario(id) {
        await this.auth.  .IdTokenResult(id).then((userRecord) => {
                // See the UserRecord reference doc for the contents of userRecord.
                console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
            })
            .catch((error) => {
                console.log('Error fetching user data:', error);
            });
 
    }*/
    //devuelve todos los usuarios



    async verUsuarios(){
        
      
    }

    //inicia sesion
    async login(email, password) {
        return await this.auth.signInWithEmailAndPassword(email, password);
    }

    //cierra sesion
    async logout() {
        await this.auth.signOut();
    }

    //fecha
    fechaTimeStamp(f) {
        //creo el objeto fecha a partir del string
        const fecha = new Date(f);
        //le agrego la diferencia del UTC -3 
        fecha.setTime(fecha.getTime() + 10800000);
        return app.firestore.Timestamp.fromDate(fecha);
    }

    nowTimeStamp() {
        //return app.firestore.FieldValue.serverTimestamp()
        //const fecha = new Date(Date.now());
        return app.firestore.Timestamp.now();
    }

    ayerTimeStamp() {
        //creo el objeto fecha de ayer
        const fecha = new Date();
        fecha.setDate(fecha.getDate() - 1);
        return app.firestore.Timestamp.fromDate(fecha);
    }

    timeStampToDate(f) {

        const t = new app.firestore.Timestamp(f.seconds, f.nanoseconds);
        return t.toDate();

    }

    subirArchivo(file) {
        let storageRef = app.storage().ref();
        let archivoRef = storageRef.child(file.name);
        archivoRef.put(file).then(function (snapshot) {
            console.log('Archivo Subido!');
        });
    }
    getArchivo(ubicacion) {

        /*
        let storage = app.storage();
        let pathReference = storage.ref(ubicacion);
        return pathReference;
        */

        // Points to the root reference
        let storageRef = app.storage().ref();

        return storageRef.child(ubicacion).getDownloadURL();

    }

}

const firebase = new Firebase();
export default firebase;