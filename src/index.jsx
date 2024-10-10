import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import Home from './components/Home';
import BisectionMethods from './components/rootOfEquation/bisection';
import GraphicalMethods from './components/rootOfEquation/graphical';
import FalsePositionMethods from './components/rootOfEquation/falsePosition';
import OnePointMethods from './components/rootOfEquation/onePoint';
import NewtonRaphsonMethods from './components/rootOfEquation/newtonRaphson';
import SecantMethods from './components/rootOfEquation/secant';
import CramerRule from './components/linearAlgebra/cramer';
import GaussElimination from './components/linearAlgebra/gaussElimination';
import GaussJordan from './components/linearAlgebra/gaussJordan';
import MatrixInversion from './components/linearAlgebra/matrixInversion';
import LU from './components/linearAlgebra/luDecomposition';
import CholeskyDecomposition from './components/linearAlgebra/cholesky';
import Jacobi from './components/linearAlgebra/jacobi';
import GaussSeidel from './components/linearAlgebra/gaussSeidel';
import ConjugateGradient from './components/linearAlgebra/conjugateGradient';
import NewtonDivided from './components/interpolation/newtonDivided';
import Lagrange from './components/interpolation/lagrange';
import Spline from './components/interpolation/spline';
import LinearRegression from './components/extrapolation/linearRegression';
import MultipleLinearRegression from './components/extrapolation/multipleLinearRegression';
import PolynomialRegression from './components/extrapolation/polynomialRegression';
import Trapezoidal from './components/integration/trapezoidal';
import Simpson from './components/integration/simpson';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/bisection",
    element: <BisectionMethods />
  }
  ,
  {
    path: "/graphical",
    element: <GraphicalMethods />
  }
  ,
  {
    path: "/false-position",
    element: <FalsePositionMethods />
  }
  ,
  {
    path: "/one-point",
    element: <OnePointMethods />
  }
  ,
  {
    path: "/newton-raphson",
    element: <NewtonRaphsonMethods />
  }
  ,
  {
    path: "/secant",
    element: <SecantMethods />
  }
  ,
  {
    path: "/cramer",
    element: <CramerRule />
  }
  ,
  {
    path: "/gauss-elimination",
    element: <GaussElimination />
  }
  ,
  {
    path: "/gauss-jordan",
    element: <GaussJordan />
  }
  ,
  {
    path: "/matrix-inversion",
    element: <MatrixInversion />
  }
  ,
  {
    path: "/lu-decomposition",
    element: <LU />
  }
  ,
  {
    path: "/cholesky-decomposition",
    element: <CholeskyDecomposition />
  }
  ,
  {
    path: "/jacobi",
    element: <Jacobi />
  }
  ,
  {
    path: "/gauss-seidel",
    element: <GaussSeidel />
  }
  ,
  {
    path: "/conjugate-gradient",
    element: <ConjugateGradient />
  }
  ,
  {
    path: "/newton-divided-differences",
    element: <NewtonDivided />
  }
  ,
  {
    path: "/lagrange",
    element: <Lagrange />
  }
  ,
  {
    path: "/spline",
    element: <Spline />
  }
  ,
  {
    path: "/linear-regression",
    element: <LinearRegression />
  }
  ,
  {
    path: "/multiple-linear-regression",
    element: <MultipleLinearRegression />
  }
  ,
  {
    path: "/polynomial-regression",
    element: <PolynomialRegression />
  }
  ,
  {
    path: "/trapezoidal-rule",
    element: <Trapezoidal />
  },
  {
    path: "/simpson-rule",
    element: <Simpson />
  }
 
  
  
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();