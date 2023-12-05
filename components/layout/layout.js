import React, { useState, useContext, useEffect } from 'react';
import Sidebar from './sidebar';
import Navegacion from './navegacion';
import Footer from './footer'
import { useRouter } from 'next/router';
import { FirebaseContext } from '../../firebase2';

const Layout = props => {

  const { usuario } = useContext(FirebaseContext);
  const router = useRouter();

  //valida que el usuario esté logueado
  useEffect(() => {
    const redirectLogin = async () => {
      await router.push('/login');
    };
    if (!usuario) {
      redirectLogin();
    }
  }, [])

  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);

  const handleCollapsedChange = (checked) => {
    setCollapsed(checked);
  };

  const handleToggleSidebar = (value) => {
    setToggled(value);
  };

  return (

    <div className={`app  ${toggled ? 'toggled' : ''}`}>

      <Sidebar

        collapsed={collapsed}
        toggled={toggled}
        handleToggleSidebar={handleToggleSidebar}
      />

      <main>


        <Navegacion
          collapsed={collapsed}
          toggled={toggled}
          handleToggleSidebar={handleToggleSidebar}
          handleCollapsedChange={handleCollapsedChange}
          titulo={props.titulo}
        />



        <div style={{
          paddingTop: "6rem"
        }}>
          {props.children}
        </div>

        <Footer />
      </main>
    </div>

  );
  // }
}

export default Layout;
