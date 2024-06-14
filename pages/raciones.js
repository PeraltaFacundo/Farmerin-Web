import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const Grafico = ({ tamboLink, tamboName }) => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(tamboLink);
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.data, 'text/html');
        const table = doc.querySelector('table');
        if (table) {
          const dfUrl = tableToDataFrame(table);
          setData(dfUrl);
        }
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    
    fetchData();
  }, [tamboLink]);

  return (
    <div className="contenedor-grafico-formulario">
      <div className="tambo-chart">
        <h2>{tamboName} - <span className="titulo-grande">Animales En Ordeñe</span></h2>
        <ChartDisplay data={data} />
      </div>
      <AnimalesAusentesList data={data} />
    </div>
  );
};

const tableToDataFrame = (table) => {
  const rows = table.querySelectorAll('tr');
  const headers = Array.from(rows[0].querySelectorAll('th')).map(th => th.textContent);
  const dfUrl = Array.from(rows).slice(1).map(row => {
    const cells = row.querySelectorAll('td');
    const obj = {};
    cells.forEach((cell, i) => {
      obj[headers[i]] = cell.textContent;
    });
    return obj;
  });
  return dfUrl;
};

const ChartDisplay = ({ data }) => {
  const contarPorNumero = (data, columna, numero) => {
    return data.filter(row => row[columna] === String(numero)).length;
  };

  const contarPorNumeroMayor = (data, columna, numero) => {
    return data.filter(row => parseInt(row[columna]) >= numero).length;
  };

  const cantidadDiasAusentem1 = contarPorNumero(data, 'DiasAusente', -1);
  const cantidadDiasAusente0 = contarPorNumero(data, 'DiasAusente', 0);
  const cantidadDiasAusente1 = contarPorNumero(data, 'DiasAusente', 1);
  const cantidadDiasAusentemayor = contarPorNumeroMayor(data, 'DiasAusente', 2);

  const valores = [cantidadDiasAusentem1, cantidadDiasAusente1, cantidadDiasAusentemayor, cantidadDiasAusente0];
  const nombres = ['Nunca Paso', 'No se leyo', 'Ausente', 'Pasando'];
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

  return <Pie data={chartData} options={{ maintainAspectRatio: false }} />;
};

const AnimalesAusentesList = ({ data }) => {
  const animalesAusentes = data.filter(row => parseInt(row.DiasAusente) >= 0);

  return (
    <div className="formulario">
      <h3>Animales Ausentes</h3>
      <table className="tabla-animales">
        <thead>
          <tr>
            <th>RP</th>
            <th>eRP</th>
            <th>Días Ausentes</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {animalesAusentes.map((animal, index) => (
            <tr key={index}>
              <td>{animal.RP}</td>
              <td>{animal.eRP}</td>
              <td>{animal.DiasAusente}</td>
              <td>
                <button className="btn-accion" onClick={() => alert(`RP: ${animal.RP}, eRP: ${animal.eRP}`)}>Ver</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Grafico;
