import '../styles/globals.css'
import 'react-pro-sidebar/dist/css/styles.css';
import '../styles/index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import firebase, {FirebaseContext} from '../firebase2';
import useAutenticacion from '../hook/useAutenticacion';
import useTambo from '../hook/useTambo';
import Head from 'next/head';
import useExcel from '../hook/useExcel';
import usePorcentaje from '../hook/usePorcentaje';
import { Provider } from "react-redux";
import  store  from '../redux/store';


function MyApp(props) {

  const usuario=useAutenticacion();
  const { Component, pageProps }=props;
  const {tamboSel,guardarTamboSel,tambos,guardarTambos}=useTambo();
  const {porc, setPorc}=usePorcentaje();
  const {archivoExcel,guardarArchivoExcel}=useExcel();
  
  
  
    
  return (
    <>
    <Head>
        <title>Farmerin Division SA</title>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
          integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
          crossOrigin="anonymous"
        />
      </Head>
      <Provider store={store}>
    <FirebaseContext.Provider
    value={{
        firebase,
        usuario,
        tamboSel,
        guardarTamboSel,
        tambos, 
        guardarTambos,
        archivoExcel,
        guardarArchivoExcel,
        porc,
        setPorc

    }}
    >
     <Component {...pageProps} />
    
    </FirebaseContext.Provider>
    </Provider>
   </>
  )
}

export default MyApp
