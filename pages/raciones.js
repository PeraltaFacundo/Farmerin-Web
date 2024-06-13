import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';


// URLs de los tambos
const tambos = [
  'https://tambo-sanandres-device.dataplicity.io/node/raciones/',
];

// Nombres de los tambos
const nombresTambos = [
'Tambo Farmerin',
];

function Grafico() {
const [data, setData] = useState([]);
const [animalesAusentes, setAnimalesAusentes] = useState([]);

useEffect(() => {
  async function fetchData() {
    const allData = await Promise.all(tambos.map(async (url, index) => {
      try {
        const response = await axios.get(url);
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.data, 'text/html');
        const table = doc.querySelector('table');
        if (table) {
          const dfUrl = tableToDataFrame(table);
          return {
            name: nombresTambos[index] || `Tambo ${index + 1}`,
            data: dfUrl
          };
        } else {
          return {
            name: nombresTambos[index] || `Tambo ${index + 1}`,
            data: null
          };
        }
      } catch (error) {
        console.error('Error fetching data', error);
        return {
          name: nombresTambos[index] || `Tambo ${index + 1}`,
          data: null
        };
      }
    }));
    setData(allData);

    // Filtrar y recopilar animales ausentes
    const ausentes = allData.reduce((acc, tambo) => {
      if (tambo.data) {
        const ausentesEnTambo = tambo.data.filter(row => parseInt(row.DiasAusente) >= 2);
        return acc.concat(ausentesEnTambo);
      }
      return acc;
    }, []);
    setAnimalesAusentes(ausentes);
  }
  fetchData();
}, []);

return (
  <div className="containerGrafico">
    <div className="chartContainer">
      {data.map((tambo, index) => (
        <TamboChart key={index} tambo={tambo} />
      ))}
    </div>
    <div className="listContainer">
      <AnimalesAusentesList animales={animalesAusentes} />
    </div>
  </div>
);
}

function tableToDataFrame(table) {
const rows = table.querySelectorAll('tr');
const headers = Array.from(rows[0].querySelectorAll('th')).map(th => th.textContent.trim());
return Array.from(rows).slice(1).map(row => {
  const cells = row.querySelectorAll('td');
  const obj = {};
  cells.forEach((cell, i) => {
    obj[headers[i]] = cell.textContent.trim();
  });
  return obj;
});
}

function TamboChart({ tambo }) {
if (!tambo.data) {
  return (
    <div >
      <h2>{tambo.name} - Animales En Ordeñe</h2>
      <img src="../public/FARMERIN_NOTFOUND-transf.png" alt="Not Found" />
    </div>
  );
}

const contarPorNumero = (data, columna, numero) => {
  return data.filter(row => row[columna] === String(numero)).length;
};

const contarPorNumeroMayor = (data, columna, numero) => {
  return data.filter(row => parseInt(row[columna]) >= numero).length;
};

const cantidadDiasAusentem1 = contarPorNumero(tambo.data, 'DiasAusente', -1);
const cantidadDiasAusente0 = contarPorNumero(tambo.data, 'DiasAusente', 0);
const cantidadDiasAusente1 = contarPorNumero(tambo.data, 'DiasAusente', 1);
const cantidadDiasAusentemayor = contarPorNumeroMayor(tambo.data, 'DiasAusente', 2);

const valores = [cantidadDiasAusentem1, cantidadDiasAusente1, cantidadDiasAusentemayor, cantidadDiasAusente0];
const nombres = ['NUNCA PASO', 'NO SE LEYO', 'AUSENTE', 'PASANDO'];
const colores = ['coral', 'red', 'blue', 'green'];

const valoresFiltrados = valores.filter(val => val !== 0);
const nombresFiltrados = nombres.filter((_, i) => valores[i] !== 0);
const coloresFiltrados = colores.filter((_, i) => valores[i] !== 0);

const chartData = {
  labels: nombresFiltrados,
  datasets: [
    {
      data: valoresFiltrados,
      backgroundColor: coloresFiltrados,
      borderColor: 'black',
      borderWidth: 1,
    },
  ],
};

return (
  <div className="tamboChart">
    <h2>{tambo.name} - Animales en ordeñe</h2>
    <Pie data={chartData} />
  </div>
);
}

function AnimalesAusentesList({ animales }) {
if (animales.length === 0) {
  return  <div className="loaderGrafico" />;
}

return (
  <div className="AnimalesAusentesFormulario">
    <h2>Lista de Animales Ausentes</h2>
    <table className="tablaDeAnimales">
      <thead>
        <tr>
          <th>RP</th>
          <th>eRP</th>
          <th>Días Ausente</th>
        </tr>
      </thead>
      <tbody>
        {animales.map((animal, index) => (
          <tr key={index}>
            <td>{animal.RP || 'RP desconocido'}</td>
            <td>{animal.eRP || 'eRP desconocido'}</td>
            <td>{animal.DiasAusente}</td>
            
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
}
export default Grafico;