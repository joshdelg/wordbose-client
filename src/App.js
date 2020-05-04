import React from 'react';
import './App.css';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

import Routes from './Routes';

function App() {
  return (
    <div className="App">
      <Navbar variant="dark" bg="info" className="navigation">
        <LinkContainer to="/">
          <Navbar.Brand>Wordbose</Navbar.Brand>
        </LinkContainer>
        <Navbar.Text>|</Navbar.Text>
        <Nav>
          <LinkContainer to="/about">
            <Nav.Link>About</Nav.Link>
          </LinkContainer>
        </Nav>
        <Nav className="ml-auto">
          <LinkContainer to="/login">
            <Nav.Link>Log In</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/signup">
            <Nav.Link>Sign Up</Nav.Link>
          </LinkContainer>
        </Nav>
      </Navbar>
      <Routes />
    </div>
  );
}

export default App;
