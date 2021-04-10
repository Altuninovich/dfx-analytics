import React from 'react';
import {Link} from "react-router-dom";
import {Jumbotron, Container, Nav, NavLink} from 'react-bootstrap';

export const Header = () => {
    return (
        <Jumbotron fluid>
          <Container>
            <h1>dfx token analysis</h1>
          </Container>
          <Nav className="mr-auto">
              <NavLink><Link to="/">Анализ DFX</Link></NavLink>
              <NavLink><Link to="/users">Aнализ по адресу</Link></NavLink>
          </Nav>
        </Jumbotron>
    )
}
