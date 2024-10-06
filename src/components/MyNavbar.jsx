import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css all/MyNavbar.css'
import { Container } from "react-bootstrap";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from "react-router-dom";

function NavigationBar() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
            <Container >
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                <Nav.Link as={Link} to="/" style={{ fontWeight: 500, color: '#5045e5' }}>Home</Nav.Link>

                <NavDropdown title="Root of Equation" id="basic-nav-dropdown" className='dropdown-title'>
                  <NavDropdown.Item as={Link} to="/graphical">Graphical methods</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/bisection">Bisection methods</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/false-position">False-position methods</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/one-point">One-point Iteration methods</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/newton-raphson">Newton-Raphson methods</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/secant">Secant methods</NavDropdown.Item>
                </NavDropdown>

                <NavDropdown title="Linear Algebra Equation" id="basic-nav-dropdown" className='dropdown-title'>
                  <NavDropdown.Item as={Link} to="/cramer">Cramer's rule</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/gauss-elimination">Gauss elimination</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/gauss-jordan">Gauss Jordan elimination</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/matrix-inversion">Matrix Inversion</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/lu-decomposition">LU Decomposition</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/cholesky-decomposition">Cholesky Decomposition</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/jacobi">Jacobi Iteration Methods</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/gauss-seidel">Gauss-Seidel Iteration</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/conjugate-gradient">Conjugate Gradient Methods</NavDropdown.Item>
                </NavDropdown>

                <NavDropdown title="Interpolation" id="basic-nav-dropdown" className='dropdown-title'>
                  <NavDropdown.Item as={Link} to="/newton-divided-differences">Newton divided-differences</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/lagrange">Lagrange interpolation</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/spline">Spline interpolation</NavDropdown.Item>
                </NavDropdown>

                <NavDropdown title="Extrapolation" id="basic-nav-dropdown" className='dropdown-title'>
                  <NavDropdown.Item as={Link} to="/linear-regression">Linear Regression</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/multiple-linear-regression">Multiple Linear Regression</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/polynomial-regression">Polynomial Regression</NavDropdown.Item>
                </NavDropdown>

                <NavDropdown title="Integration" id="basic-nav-dropdown" className='dropdown-title'>
                  <NavDropdown.Item as={Link} to="/trapezoidal-rule">Trapezoidal Rule</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/composite-trapezoidal">Composite Trapezoidal Rule</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/simpson-rule">Simpson Rule</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/composite-simpson">Composite Simpson Rule</NavDropdown.Item>
                </NavDropdown>

                <NavDropdown title="Differentiation" id="basic-nav-dropdown" className='dropdown-title'>
                  <NavDropdown.Item as={Link} to="/numerical-differentiation">Numerical Differentiation</NavDropdown.Item>
                </NavDropdown>

                </Nav>
                </Navbar.Collapse>
            </Container>
      </Navbar>
  )
}

export default NavigationBar