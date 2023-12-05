import styled from '@emotion/styled';

export const ContenedorLogin = styled.div`
    margin-top: 5rem;
    text-align:center;   
`;

export const ContenedorPass = styled.div`
   flex:1;
   display: flex;
  // background-color:red;
`;

export const Contenedor = styled.div`
background-color:white;
margin:1rem;
border: 0;
border-radius: 10px;
box-shadow: 0 1px 1px 0 rgba(60,75,100,.14), 0 2px 1px -1px rgba(60,75,100,.12), 0 1px 3px 0 rgba(60,75,100,.2);
padding: 1rem;

`;

export const ContenedorAlertas = styled.div`
 height: 28rem;
 overflow-y: auto;
`;

export const ContenedorSpinner = styled.div`
    background-image:url("LogoF.png");
    background-repeat: no-repeat;
    background-position: center;
    background-blend-mode:lighten;
    background-size:auto 100%;
    margin:auto;
    text-align:center;
    padding: auto;
    height:2rem;
`;

export const ContenedorPoliticas = styled.div`
    height: 80vh;
    overflow-y: auto;
`;

export const ContenedorFila = styled.div`
background-color:white;
margin:1rem;
border: 0;
border-radius: 10px;
box-shadow: 0 1px 1px 0 rgba(60,75,100,.14), 0 2px 1px -1px rgba(60,75,100,.12), 0 1px 3px 0 rgba(60,75,100,.2);
padding: 1rem;
align-items: center;
display: flex;
`;

export const Botonera = styled.div`
    margin: 1rem;
    text-align:left;
    /*z-index: 1;
    position:fixed;
    display:flex;
    background-color:whitesmoke;
    padding:2rem;*/
`;

export const Mensaje = styled.div`
    margin:1rem;
    border: 0;
`;

export const Campo = styled.div`
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    label {
        flex: 0 0 150px;
        font-size: 1.8rem;
    }
    input, 
    textarea {
        flex: 1;
        padding: 1rem;
    }
    textarea {
        height: 400px;
    }
`;

export const InputSubmit = styled.input`
    background-color: var(--orange);
    width: 100%;
    padding: 1.5rem;
    text-align: center;
    color: #FFF;
    font-size: 1.8rem;
    text-transform: uppercase;
    border: none;
    font-family: 'PT Sans', sans-serif;
    font-weight: 700;
    &:hover {
        cursor: pointer;
    }
`;

export const Error = styled.p`
    background-color: red;
    padding: 1rem;
    font-family: 'PT Sans', sans-serif;
    font-weight: 700;
    font-size: 1.4rem;
    color: #FFF;
    text-align: center;
    text-transform: uppercase;
    margin: 2rem 0;
`;