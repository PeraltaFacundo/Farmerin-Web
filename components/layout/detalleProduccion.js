import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../../firebase2';
import { format } from 'date-fns';

const DetalleProduccion = ({ prod }) => {

  
  const { id, fecha,prodM,prodT,produccion,desM,desT,descarte,guaM,guaT,guachera,fabrica  } = prod;
  const { firebase } = useContext(FirebaseContext);
 
  const [fecProd, setFecProd] = useState('');
  const [entregado,setEntregado]=useState(0);

  useEffect(() => {
  
    //formateo fecha de produccion
    try {
      const f = format(firebase.timeStampToDate(fecha), 'dd/MM/yyyy');
      setFecProd(f);

    } catch (error) {
      setFecProd('');
    }

    const e = produccion-descarte-guachera;
    setEntregado(e);


  }, []);

  return (
    <>
      <tr>
        <td >
          {fecProd}
        </td>
        <td >
          {prodM}
        </td>

        <td >
          {prodT}
        </td>

        <td >
          {produccion}
        </td>
        <td >
          {desM}
        </td>

        <td >
          {desT}
        </td>

        <td >
          {descarte}
        </td>
        <td >
          {guaM}
        </td>

        <td >
          {guaT}
        </td>

        <td >
          {guachera}
        </td>
        <td >
          {entregado}
        </td>
        <td >
          {fabrica}
        </td>
     
      </tr>
    </>
  );
}

export default DetalleProduccion;