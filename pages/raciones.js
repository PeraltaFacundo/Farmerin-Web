import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

// URLs y nombres de los tambos
const tambos = [
  'https://tambo-expo-device.dataplicity.io/node/raciones/',
];
const nombresTambos = [
  'Tambo Farmerin',
];

function Grafico() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para controlar la carga
  const [animalesAusentes, setAnimalesAusentes] = useState([]);
  const [animalesNuncaPaso, setAnimalesNuncaPaso] = useState([]);
  const [animalesNoLeyo, setAnimalesNoLeyo] = useState([]);

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
              name: nombresTambos[index] || 'Tambo ${index + 1}',
              data: dfUrl,
            };
          } else {
            return {
              name: nombresTambos[index] ||' Tambo ${index + 1}',
              data: null,
            };
          }
        } catch (error) {
          console.error('Error fetching data', error);
          return {
            name: nombresTambos[index] || 'Tambo ${index + 1}',
            data: null,
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

      // Filtrar y recopilar animales "Nunca Paso"
      const nuncapaso = allData.reduce((acc, tambo) => {
        if (tambo.data) {
          const nuncapasoEnTambo = tambo.data.filter(row => parseInt(row.DiasAusente) === -1);
          return acc.concat(nuncapasoEnTambo);
        }
        return acc;
      }, []);
      setAnimalesNuncaPaso(nuncapaso);

      // Filtrar y recopilar animales "No Leyo"
      const noleyo = allData.reduce((acc, tambo) => {
        if (tambo.data) {
          const noleyoEnTambo = tambo.data.filter(row => parseInt(row.DiasAusente) === 1);
          return acc.concat(noleyoEnTambo);
        }
        return acc;
      }, []);
      setAnimalesNoLeyo(noleyo);

      setLoading(false); // Finaliza la carga después de obtener los datos
    }

    fetchData();
  }, []);

  return (
    <div className="containerGrafico">
      <div className="chartContainer">
        {loading ? (
          <div className="loaderGrafico">OBTENIENDO INFORMACION</div>
        ) : (
          data.map((tambo, index) => (
            <TamboChart key={index} tambo={tambo} />
          ))
        )}
      </div>
      {!loading && (
        <div className="listContainer">
          {/* Lista de Animales Ausentes */}
          {animalesAusentes.length > 0 ? (
            <AnimalesAusentesList animales={animalesAusentes} />
          ) : (
            <div className="mensajeVacio">NO SE ENCONTRARON RESULTADOS PARA ANIMALES AUSANTES.</div>
          )}
          {/* Lista de Animales que Nunca Pasaron */}
          {animalesNuncaPaso.length > 0 ? (
            <AnimalesNuncaPasoList animales={animalesNuncaPaso} />
          ) : (
            <div className="mensajeVacio">NO SE ENCONTRARON RESULTADOS PARA ANIMALES QUE NUNCA PASARON.</div>
          )}
          {/* Lista de Animales que No Leyo */}
          {animalesNoLeyo.length > 0 ? (
            <AnimalesNoLeyoList animales={animalesNoLeyo} />
          ) : (
            <div className="mensajeVacio">NO SE ENCONTRARON RESULTADOS PARA ANIMALES QUE NO SE LEYERON.</div>
          )}
        </div>
      )}
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
      <div className="tamboChart">
        <h2><span className="titulo-grande">{tambo.name} - Animales En Ordeñe</span></h2>
        <img src="/FARMERINNOTFOUND.jpeg" alt="Not Found" />
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
  const nombres = ['NUNCA SE LEYO', 'NO SE LEYO', 'AUSENTE', 'SE LEYO'];
  const colores = ['pink', 'red', 'blue', 'green'];

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
      <h2><span className="titulo-grande">{tambo.name} - Animales En Ordeñe</span></h2>
      <Pie data={chartData} />
    </div>
  );
}

function AnimalesAusentesList({ animales }) {
  if (animales.length === 0) {
    return null; // Retorna null para evitar renderizar cuando no hay datos
  }

  return (
    <div className="AnimalesFormulario">
      <h2>Lista de animales ausentes</h2>
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
              <td>{animal.RFID || 'eRP desconocido'}</td>
              <td>{animal.DiasAusente}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AnimalesNuncaPasoList({ animales }) {
  if (animales.length === 0) {
    return null; // Retorna null para evitar renderizar cuando no hay datos
  }

  return (
    <div className="AnimalesFormulario">
      <h2>Lista de animales que nunca se leyeron</h2>
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
              <td>{animal.RFID || 'eRP desconocido'}</td>
              <td>{animal.DiasAusente}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AnimalesNoLeyoList({ animales }) {
  if (animales.length === 0) {
    return null; // Retorna null para evitar renderizar cuando no hay datos
  }

  return (
    <div className="AnimalesFormulario">
      <h2>Lista de animales que no leyo</h2>
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
              <td>{animal.RFID || 'eRP desconocido'}</td>
              <td>{animal.DiasAusente}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Grafico;