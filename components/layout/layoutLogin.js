import React from 'react';

import Footer from './footer'


const LayoutLogin = props => {

  return (
  

      <div className="app">
        <main>
          
          {props.children}
         

          <Footer/>
        </main>
        
      </div>
    
  );
}

export default LayoutLogin;
