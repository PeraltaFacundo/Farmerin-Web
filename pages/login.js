import React, { useState } from 'react';
import LayoutLogin from '../components/layout/layoutLogin';
import Router from 'next/router';
import CrearCuenta from './crear-cuenta';
//formato del formulario
import { Contenedor, ContenedorPoliticas, ContenedorLogin, ContenedorSpinner, ContenedorPass } from '../components/ui/Elementos';
import { Form, Button, Alert, Spinner, Row, Container, Col, Image, Modal } from 'react-bootstrap';
import firebase from '../firebase2'
import { IoMdEyeOff, IoMdEye } from 'react-icons/io';

//hook de validacion de formualarios
import useValidacion from '../hook/useValidacion';
//importo las reglas de validacion para crear cuenta
import validarIniciarSesion from '../validacion/validarIniciarSesion';

//State inicial para el hook de validacion (inicializo vacío)
const STATE_INICIAL = {
  email: '',
  password: ''
}

const Login = () => {
  const [procesando, guardarProcesando] = useState(false);
  const [error, guardarError] = useState(false);

  const { valores, errores, handleSubmit, handleChange, handleBlur } = useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion);

  const { email, password } = valores;

  const [showPass, setShowPass] = useState(false);
  const [show, setShow] = useState(false);
  const [showPoliticas, setShowPoliticas] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClosePoliticas = () => setShowPoliticas(false);
  const handleShowPoliticas = () => setShowPoliticas(true);

  async function iniciarSesion() {
    guardarProcesando(true);
    try {
      await firebase.login(email, password);
      Router.push('/');
    } catch (error) {
      console.error('hubo un error', error.message);
      guardarError(error.message);
      guardarProcesando(false);
    }


  }

  return (
    <LayoutLogin>
      <ContenedorLogin>
        {procesando ? <ContenedorSpinner> <Spinner animation="border" variant="info" /></ContenedorSpinner> :

          <Container>
            <Row>
              <Col lg={true}>
                <Image src="logoBAJA.png" fluid />
                <hr />
                <h3>Iniciar Sesión</h3>
              </Col>
              <Col lg={true}>
                <Contenedor>
                  <Form
                    onSubmit={handleSubmit}
                  >
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
                      {errores.email && <Alert variant="danger" >{errores.email}</Alert>}
                    </Form.Group>

                    <Form.Group>
                      <ContenedorPass>
                        <Form.Control
                          type={showPass ? 'text' : 'password'}
                          id="password"
                          placeholder="Contraseña"
                          name="password"
                          value={password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required
                        />

                        <Button
                          variant="light"
                          onClick={() => setShowPass(!showPass)}
                          size="sm"
                        >
                          {showPass ?
                            <IoMdEyeOff size={20} />
                            :
                            <IoMdEye size={20} />

                          }

                        </Button>
                      </ContenedorPass>
                    </Form.Group>

                    {errores.password && <Alert variant="danger" >{errores.password}</Alert>}
                    {error && <Alert variant="danger" >{error}</Alert>}
                    <Form.Group>
                      <Button
                        variant="info" block
                        type="submit"
                      >
                        <h4>Iniciar Sesión</h4>

                      </Button>
                    </Form.Group>
                    <Form.Group>
                      <p>¿Olvidaste tu contraseña?</p>
                    </Form.Group>
                  </Form>
                  <hr />

                  <Button
                    variant="success"
                    onClick={handleShow}
                  >
                    <h5>Crear cuenta</h5>

                  </Button>
                  <br></br>
                  <Button
                    variant="link"
                    onClick={setShowPoliticas}
                  >
                    <h6>Políticas de Privacidad</h6>
                  </Button>

                </Contenedor>
              </Col>
            </Row>
          </Container>

        }
      </ContenedorLogin>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3>Registrarse</h3>
            <p>Es rápido y fácil</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body><CrearCuenta /></Modal.Body>
      </Modal>


      <Modal show={showPoliticas} onHide={handleClosePoliticas}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3>Políticas de Privacidad</h3>

          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ContenedorPoliticas>
            <p>La presente Política de Privacidad establece los términos en que Farmerin usa y protege la información que es proporcionada por sus usuarios al momento de utilizar su sitio web y/o aplicación mobile. Esta compañía está comprometida con la seguridad de los datos de sus usuarios. Cuando le pedimos llenar los campos de información personal con la cual usted pueda ser identificado, lo hacemos asegurando que sólo se empleará de acuerdo con los términos de este documento. Sin embargo esta Política de Privacidad puede cambiar con el tiempo o ser actualizada por lo que le recomendamos y enfatizamos revisar continuamente esta página para asegurarse que está de acuerdo con dichos cambios.</p>
            <h4> Información que es recogida</h4>
            <p>Nuestro sitio web y/o aplicación mobile podrá recoger información personal por ejemplo: Nombre,  información de contacto como  su dirección de correo electrónica e información demográfica. Así mismo cuando sea necesario podrá ser requerida información específica para procesar algún pedido o realizar una entrega o facturación.</p>
            <h4>Uso de la información recogida</h4>
            <p>Nuestro sitio web emplea la información con el fin de proporcionar el mejor servicio posible, particularmente para mantener un registro de usuarios, de pedidos en caso que aplique, y mejorar nuestros productos y servicios.  Es posible que sean enviados correos electrónicos periódicamente a través de nuestro sitio con ofertas especiales, nuevos productos y otra información publicitaria que consideremos relevante para usted o que pueda brindarle algún beneficio, estos correos electrónicos serán enviados a la dirección que usted proporcione y podrán ser cancelados en cualquier momento.</p>
            <p>Farmerin está altamente comprometido para cumplir con el compromiso de mantener su información segura. Usamos los sistemas más avanzados y los actualizamos constantemente para asegurarnos que no exista ningún acceso no autorizado.</p>
            <h4>Cookies</h4>
            <p>Una cookie se refiere a un fichero que es enviado con la finalidad de solicitar permiso para almacenarse en su ordenador, al aceptar dicho fichero se crea y la cookie sirve entonces para tener información respecto al tráfico web y/o aplicación mobile, y también facilita las futuras visitas a una web y/o aplicación mobile recurrente. Otra función que tienen las cookies es que con ellas las web y/o aplicación mobile pueden reconocerte individualmente y por tanto brindarte el mejor servicio personalizado de su web.</p>
            <p>Nuestro sitio web emplea las cookies para poder identificar las páginas que son visitadas y su frecuencia. Esta información es empleada únicamente para análisis estadístico y después la información se elimina de forma permanente. Usted puede eliminar las cookies en cualquier momento desde su ordenador. Sin embargo las cookies ayudan a proporcionar un mejor servicio de los sitios web y/o aplicación mobile, estás no dan acceso a información de su ordenador ni de usted, a menos de que usted así lo quiera y la proporcione directamente noticias. Usted puede aceptar o negar el uso de cookies, sin embargo la mayoría de navegadores aceptan cookies automáticamente pues sirve para tener un mejor servicio web y/o aplicación mobile. También usted puede cambiar la configuración de su ordenador para declinar las cookies. Si se declinan es posible que no pueda utilizar algunos de nuestros servicios.</p>
            <h4>Enlaces a Terceros</h4>
            <p>Este sitio web y/o aplicación mobile pudiera contener en laces a otros sitios que pudieran ser de su interés. Una vez que usted de clic en estos enlaces y abandone nuestra página, ya no tenemos control sobre al sitio al que es redirigido y por lo tanto no somos responsables de los términos o privacidad ni de la protección de sus datos en esos otros sitios terceros. Dichos sitios están sujetos a sus propias políticas de privacidad por lo cual es recomendable que los consulte para confirmar que usted está de acuerdo con estas.</p>
            <h4>Control de su información personal</h4>
            <p>En cualquier momento usted puede restringir la recopilación o el uso de la información personal que es proporcionada a nuestro sitio web y/o aplicación mobile.  Cada vez que se le solicite rellenar un formulario, como el de alta de usuario, puede marcar o desmarcar la opción de recibir información por correo electrónico.  En caso de que haya marcado la opción de recibir nuestro boletín o publicidad usted puede cancelarla en cualquier momento.</p>
            <p>Esta compañía no venderá, cederá ni distribuirá la información personal que es recopilada sin su consentimiento, salvo que sea requerido por un juez con un orden judicial.</p>
            <p>Farmerin se reserva el derecho de cambiar los términos de la presente Política de Privacidad en cualquier momento.</p>
          </ContenedorPoliticas>
        </Modal.Body>
      </Modal>
    </LayoutLogin >
  );
}

export default Login;