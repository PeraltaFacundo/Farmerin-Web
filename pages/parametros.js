import React, { useState, useEffect, useContext } from 'react'
import { FirebaseContext } from '../firebase2';
import Layout from '../components/layout/layout';
import DetalleParametro from '../components/layout/detalleParametro';
import SelectTambo from '../components/layout/selectTambo';
import { Button } from 'react-bootstrap';

const Parametros = () => {
  const [valor, setValor] = useState(0)
  const { firebase, setPorc, porc, tamboSel } = useContext(FirebaseContext);  


  useEffect(()=>{
    if(tamboSel){
    obtenerPorcentaje()

  }
  },[])
  
  const obtenerPorcentaje = async () => {
      try {
  
        firebase.db.collection('tambo').doc(tamboSel.id).get().then(snapshotParametros)
     }catch (error){
      console.log(error)
     }
  }
  
  function snapshotParametros(snapshot) {
   setValor(snapshot.data().porcentaje)
  }
  
  
  
  
  
  // Función 1 (suma)
  const suma = async () => {
    let nuevoPorcentaje = valor + 10;
  
    if (tamboSel) {
      if (valor === 100) {
        setValor(valor);
      } else {
        let p = {
          porcentaje: nuevoPorcentaje,
        };
        setPorc(nuevoPorcentaje);
        try {
          await firebase.db.collection('tambo').doc(tamboSel.id).update(p);
          //await firebase.db.collection('parametro').doc(tamboSel.id).update(p);
          await firebase.db.collection('animal').doc(tamboSel.id).update(p);
          console.log(tamboSel)
        } catch (error) {
          console.log(error);
        }
        setValor(nuevoPorcentaje);
      }
    }
  };
  
  // Función 2 (resta)
  const resta = async () => {
    let nuevoPorcentaje = valor - 10;
    if (tamboSel) {
      if (valor === -50) {
        setValor(valor);
      } else {
        let p = {
          porcentaje: nuevoPorcentaje,
        };
        setPorc(nuevoPorcentaje);
  
        try {
          await firebase.db.collection('tambo').doc(tamboSel.id).update(p);
          //await firebase.db.collection('parametro').doc(tamboSel.id).update(p);
          await firebase.db.collection('animal').doc(tamboSel.id).update(p);
          console.log(tamboSel)
        } catch (error) {
          console.log(error);
        }
        setValor(nuevoPorcentaje);
      }
    }
  };
  
  // Función 3 (restablecer)
  const restablecer = async () => {
    if (tamboSel) {
      setValor(0);
      let p = {
        porcentaje: 0
      };
  
      try {
        await firebase.db.collection('tambo').doc(tamboSel.id).update(p);
        //await firebase.db.collection('parametro').doc(tamboSel.id).update(p);
        await firebase.db.collection('animal').doc(tamboSel.id).update(p);
        console.log('se ejecuto')
      } catch (error) {
        console.log(error);
      }
    }
  };

let porcentaje;

if (valor == 10) {
  porcentaje = 1.1
}
else if (valor == 20) {
  porcentaje = 1.2
}
else if (valor == 30) {
  porcentaje = 1.3
}
else if (valor == 40) {
  porcentaje = 1.4
}
else if (valor == 50) {
  porcentaje = 1.5
}
else if (valor == 60) {
  porcentaje = 1.6
}
else if (valor == 70) {
  porcentaje = 1.7
}
else if (valor == 80) {
  porcentaje = 1.8
}
else if (valor == 90) {
  porcentaje = 1.9
}
else if (valor == 100) {
  porcentaje = 2
}
else if (valor == -10) {
  porcentaje = 0.9
}
else if (valor == -20) {
  porcentaje = 0.8
}
else if (valor == -30) {
  porcentaje = 0.7
}
else if (valor == -40) {
  porcentaje = 0.6
}
else if (valor == -50) {
  porcentaje = 0.5
}
else {
  porcentaje = 1
}




  return (

    <Layout
      titulo="Parámetros Nutricionales"
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h1 style={{ color: "#404040", fontWeight: "bold", fontSize: "34px", marginTop: 0 }}>ALIMENTACIÓN</h1>
        <div style={{display:"flex",flexDirection:"row",gap:"7px"}}>
        <p style={{ color: "grey", fontWeight: "bold", fontSize: "18px", marginTop: 0 }}>ESTADO ACTUAL: </p><p style={{color:"#404040", fontWeight: "bold", fontSize: "18px"}}>
          {valor == 0 ? "POR DEFECTO" : null}
          {valor < 0 ? "REDUCCION DEL "+valor+"%": null}
          {valor > 0 ? "AUMENTO DEL "+valor+"%": null}
        </p> 

        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: "10px" }}>
        <Button
          style={{ fontWeight: "bold", borderRadius: "10px", width: "40%", height: "50px", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}
          variant="danger"
          block
          onClick={resta}
        >Reducir 10%</Button>
        <Button
          style={{ margin: 0, fontWeight: "bold", borderRadius: "10px", width: "20%", height: "50px", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}
          variant="info"
          block
          onClick={restablecer}
        >Restablecer</Button>
        <Button
          style={{ margin: 0, fontWeight: "bold", borderRadius: "10px", width: "40%", height: "50px", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}
          variant="success"
          block
          onClick={suma}
        >Aumentar 10%</Button>
      </div>
      {tamboSel ?
        <>
          <DetalleParametro
            idTambo={tamboSel.id}
            categoria="Vaquillona"
            porcentaje={porcentaje}
          />
          <DetalleParametro
            idTambo={tamboSel.id}
            categoria="Vaca"
            porcentaje={porcentaje}
          />

        </>
        :
        <SelectTambo />

      }
    </Layout >

  )
}

export default Parametros