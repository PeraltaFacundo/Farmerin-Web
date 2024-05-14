import React, { useState, useEffect, useContext } from 'react'
import Link from 'next/link';

import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from 'react-pro-sidebar';
import { FaTachometerAlt, FaIndustry, FaChartLine, FaCog, FaTools } from 'react-icons/fa';
import { GiCow } from 'react-icons/gi';
import { FirebaseContext } from '../../firebase2';
const Aside = ({ collapsed, toggled, handleToggleSidebar }) => {

  const { tamboSel, porc, setPorc } = useContext(FirebaseContext);


 
    

  let num = Math.floor(Math.random() * 5) + 1;
  return (

    <ProSidebar
      //image={`/menu${num}.png`}
      image={`/menu3.png`}
      collapsed={collapsed}
      toggled={toggled}
      breakPoint="md"
      onToggle={handleToggleSidebar}
    >
      <SidebarHeader>
        <div
          className="sidebar-logo-wrapper"
          style={{
            padding: '10px 14px',
            fontWeight: 'bold',
            fontSize: 50,
            letterSpacing: '1px',

          }}
        >

          <div className="sidebar-logo">
            <img width={50} src="/logoF.png" alt="Farmerin" />
            <Link href="/">
              <img width={185} src="/logoLetras.png" alt="Farmerin" href="" />
            </Link>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <Menu iconShape="circle">
          <Link href="/">
            <MenuItem icon={<FaIndustry />}>
              Tambos</MenuItem>
          </Link>
          <Link href="/animales">
            <MenuItem icon={<GiCow size={22} />}>
              Animales</MenuItem>
          </Link>

        </Menu>
        <Menu iconShape="circle">
          <SubMenu
            suffix={<span className="badge yellow">3</span>}
            title='Nutricion'
            icon={<FaTachometerAlt />}
          >
            <Link href="/parametros">
              <MenuItem>Parametros</MenuItem>
            </Link>
            <Link href="/control">
              <MenuItem>Control</MenuItem>
            </Link>
            <Link href="/controlLechero">
              <MenuItem>Control Lechero</MenuItem>
            </Link >

          </SubMenu>

        </Menu>
        <Menu iconShape="circle">
          <SubMenu
            suffix={<span className="badge yellow">4</span>}
            title='Reportes'
            icon={<FaChartLine />}
          >
            <Link href="/gralAnimales">
              <MenuItem>Gral. Animales</MenuItem>
            </Link>
            <Link href="/produccion">
              <MenuItem>Produccion</MenuItem>
            </Link>
            <Link href="/parteDiario">
              <MenuItem>Parte Diario</MenuItem>
            </Link>
            <Link href="/recepciones">
              <MenuItem>Recepciones</MenuItem>
            </Link>
          </SubMenu>
          </Menu>
          
          <Menu iconShape="circle">
          <SubMenu
            suffix={<span className="badge yellow">1</span>}
            title='Herramientas'
            icon={<FaTools />}
          >
            <Link href="/monitor">
              <MenuItem>Monitor de Ingreso </MenuItem>
            </Link>
          </SubMenu>
        </Menu>

        <Menu iconShape="circle">
          <SubMenu
            // suffix={<span className="badge yellow">2</span>}
            title='Configuracion'
            icon={<FaCog />}
          >
            <Link href="/listados">
              <MenuItem>Listados</MenuItem>
            </Link >
            <Link href="/altaMasiva">
              <MenuItem>Alta Masiva</MenuItem>
            </Link >
            <Link href="/actualizacion">
              <MenuItem>Actualizacion Masiva</MenuItem>
            </Link >
            <Link href="/testFuncion">
              <MenuItem>Test Alimentacion</MenuItem>
            </Link >
            <Link href="/dirsa">
              <MenuItem>Dirsa</MenuItem>
            </Link >
          </SubMenu>
        </Menu>
       
      </SidebarContent>

      <SidebarFooter style={{ textAlign: 'center' }}>
        <div
          className="sidebar-btn-wrapper"
          style={{
            padding: '20px 24px',
          }}
        >
          <a
            href="https://ultraidi.com.ar/"
            target="_blank"
            className="sidebar-btn"
            rel="noopener noreferrer"
          >
            <img width={25} src="/logoUgris.png" alt="Ultra I+D+I" />
            <span> Ultra I+D+I</span>
          </a>
        </div>
      </SidebarFooter>
    </ProSidebar>
  );
};

export default Aside;