import React from 'react'
import NavigationBar from './MyNavbar'
import '../css all/Home.css'
import { Link } from "react-router-dom";

function Home() {

  return (
    <>
    <NavigationBar />
    
    <h1>Numerical Method</h1>
    <div className="container">
      <div className="item">
      <h3 className="topic">Root of Equation</h3>
        <p><Link to="/graphical" className="link">Graphical methods</Link></p>
        <p><Link to="/bisection" className="link">Bisection methods</Link></p>
        <p><Link to="/false-position" className="link">False-position methods</Link></p>
        <p><Link to="/one-point" className="link">One-point Iteration methods</Link></p>
        <p><Link to="/newton-raphson" className="link">Newton-Raphson methods</Link></p>
        <p><Link to="/secant" className="link">Secant methods</Link></p>
      </div>
      <div className="item">
        <h3 className="topic">Linear Algebra Equation</h3>
        <p><Link to="/cramer" className="link">Cramer's rule</Link></p>
        <p><Link to="/gauss-elimination" className="link">Gauss elimination</Link></p>
        <p><Link to="/gauss-jordan" className="link">Gauss Jordan elimination</Link></p>
        <p><Link to="/matrix-inversion" className="link">Matrix Inversion</Link></p>
        <p><Link to="/lu-decomposition" className="link">LU Decomposition</Link></p>
        <p><Link to="/cholesky-decomposition" className="link">Cholesky Decomposition</Link></p>
        <p><Link to="/jacobi" className="link">Jacobi Iteration Methods</Link></p>
        <p><Link to="/gauss-seidel" className="link">Gauss-Seidel Iteration</Link></p>
        <p><Link to="/conjugate-gradient" className="link">Conjugate Gradient Methods</Link></p>
      </div>
      <div className="item">
        <h3 className="topic">Interpolation</h3>
        <p><Link to="/newton-divided-differences" className="link">Newton divided-differences</Link></p>
        <p><Link to="/lagrange" className="link">Lagrange interpolation</Link></p>
        <p><Link to="/spline" className="link">Spline interpolation</Link></p>
        
      </div>
      <div className="item">
        <h3 className="topic">Extrapolation</h3>
        <p><Link to="/linear-regression" className="link">Linear Regression</Link></p>
        <p><Link to="/multiple-linear-regression" className="link">Multiple Linear Regression</Link></p>
        <p><Link to="/polynomial-regression" className="link">Polynomial Regression</Link></p>
      </div>
      <div className="item">
        <h3 className="topic">Integration</h3>
        <p><Link to="/trapezoidal-rule" className="link">Trapezoidal Rule</Link></p>
        <p><Link to="/simpson-rule" className="link">Simpson Rule</Link></p>
        <br />
        <br />
        <br />
        <br />
      </div>
      <div className="item">
        <h3 className="topic">Differentiation</h3>
        <p><Link to="/numerical-differentiation" className="link">Numerical Differentiation</Link></p>
      </div>
    </div>

    
    </>
  )
}

export default Home