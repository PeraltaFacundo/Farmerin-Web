import React, { useState } from 'react';
import Router from 'next/router';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { ContenedorSpinner } from '../components/ui/Elementos';

import firebase from '../firebase2'

//hook de validacion de formualarios
import useValidacion from '../hook/useValidacion';
//importo las reglas de validacion para crear cuenta
import validarCrearCuenta from '../validacion/validarCrearCuenta';

//State inicial para el hook de validacion (inicializo vacío)
const STATE_INICIAL = {
  nombre: '',
  email: '',
  password: ''
}

const CrearCuenta = () => {

  const [error, guardarError] = useState(false);
  const { valores, errores, handleSubmit, handleChange, handleBlur } = useValidacion(STATE_INICIAL, validarCrearCuenta, crearCuenta);
  const { nombre, email, password } = valores;
  const [procesando, guardarProcesando] = useState(false);

  async function crearCuenta() {
    guardarProcesando(true);
    try {
      await firebase.registrar(nombre, email, password);
      Router.push('/');
    } catch (error) {
      console.error('hubo un errors', error.message);
      guardarError(error.message);
      guardarProcesando(false);
    }
    
  }

  return (
    <>
      {procesando ? <ContenedorSpinner> < Spinner animation="border" variant="info" /></ContenedorSpinner > :
        <Form
          onSubmit={handleSubmit}
        >
          <Form.Group>
            <Form.Control
              type="string"
              id="nombre"
              placeholder="Nombre y Apellido"
              name="nombre"
              value={nombre}
              onChange={handleChange}
              required

            />
            {errores.nombre && <Alert variant="danger">{errores.nombre}</Alert>}
          </Form.Group>

          <Form.Group>
            <Form.Control
              type="email"
              id="email"
              placeholder="Correo electrónico"
              name="email"
              value={email}
              onChange={handleChange}
              required
            />
            {errores.email && <Alert variant="danger">{errores.email}</Alert>}
          </Form.Group>


          <Form.Group>
            <Form.Control

              type="password"
              id="password"
              placeholder="Contraseña"
              name="password"
              value={password}
              onChange={handleChange}
              required
            />
            {errores.password && <Alert variant="danger">{errores.password}</Alert>}
          </Form.Group>


          <Form.Group>
            <Button
              variant="success" block
              type="submit"
              value="Crear Cuenta"
            >
              <h4>Registrarte</h4>
            </Button>
          </Form.Group>
          {error && <Alert variant="danger">{error}</Alert>}
          <p>Al hacer clic en "Registrarte", aceptas nuestras Condiciones, la Política de datos y la Política de cookies. </p>
        </Form>
      }
    </>
  );
}

export default CrearCuenta;