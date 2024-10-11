import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import NavigationBar from '../MyNavbar';
import '../../App.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import Modal from 'react-bootstrap/Modal';
import 'katex/dist/katex.min.css';
import katex from 'katex';
import { lusolve, evaluate } from 'mathjs';
import Plot from 'react-plotly.js';


const MultipleLinearRegression = () => {
    const [findX, setFindX] = useState([0]); 
    const [K, setK] = useState(2); // numbers of k
    const [point, setPoint] = useState(5); 
    const [X, setX] = useState([]); 
    const [fx, setFx] = useState([]);
    const [result, setResult] = useState(null);
    const [slope, setSlope] = useState();
    const [intercept, setIntercept] = useState();
    const [regressionFunction, setRegressionFunction] = useState(""); 
    const [regressionFunctionSubstitude, setRegressionFunctionSubstitude] = useState(""); 
    const [matrixEquation, setMatrixEquation] = useState(""); 
    const [matrixSubstitude, setMatrixSubstitude] = useState(""); 
    const [Equation, setEquation] = useState("");


    const [show, setShow] = useState(false); 
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    const clearInputs = () => {
        setX([]);
        setFx([]); 
    };

    const getEquationApi = async () => {
        try {
            const response = await fetch(`https://pj-numer-api.onrender.com/interExtraData/filter?data_id=2`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const equationData = await response.json();  
            console.log(equationData);
            if (equationData) {
                setPoint(equationData.point_amount);
                setK(equationData.x_amount);

                let xArr = [];
                for(let i=0;i<point;i++){
                    xArr[i] = equationData.x[i];
                }
                setX(xArr);
                console.log(X);
                setFx(equationData.fx);
            } else {
                console.error("No data received");
            }
        } catch (error) {
            console.error("Failed to fetch equation data:", error);
        }
    };

    const handleKChange = (event) => {
        const newK = parseInt(event.target.value) || 1;
        setK(newK);

        let newFindX = [...findX];
        if (newK > newFindX.length) {
            newFindX = [...newFindX, ...Array(newK - newFindX.length).fill(0)];
        } else {
            newFindX = newFindX.slice(0, newK);
        }
        setFindX(newFindX);
        setX(Array(newK).fill(0));  
    };

    const handleFindXChange = (index, event) => {
        let newFindX = [...findX];
        newFindX[index] = parseFloat(event.target.value) || 0;
        setFindX(newFindX);
        //console.log(newFindX);
    };


const inputTable = (point) => {
    const handleXChange = (pointIndex, xIndex, event) => {
        let newX = [...X];
        if (!newX[pointIndex]) newX[pointIndex] = Array(K).fill(0);
        newX[pointIndex][xIndex] = parseFloat(event.target.value) || 0; 
        setX(newX);
        console.log(newX);
    };

    const handleFxChange = (index, event) => {
        let newFx = [...fx];
        newFx[index] = parseFloat(event.target.value) || 0; 
        setFx(newFx);
    };

    return (
        <Table className="rounded-table">
            <thead>
                <tr>
                    <th>Point</th>
                    {[...Array(K)].map((_, xIndex) => (
                        <th key={xIndex}>x{xIndex + 1}</th>
                    ))}
                    <th>f(x)</th>
                </tr>
            </thead>
            <tbody style={{ textAlign: "center" }}>
                {[...Array(parseInt(point)).keys()].map((i) => (
                    <tr key={i}>
                        <td>{i + 1}</td>
                        
                        {[...Array(K)].map((_, xIndex) => (
                            <td key={xIndex}>
                                <Form.Control
                                    type="number"
                                    placeholder={`0`}
                                    value={X[i]?.[xIndex] || ""} // Access the specific x value
                                    onChange={(event) => handleXChange(i, xIndex, event)}
                                />
                            </td>
                        ))}
                        <td>
                            <Form.Control
                                type="number"
                                placeholder={`0`}
                                value={fx[i] || ""}
                                onChange={(event) => handleFxChange(i, event)}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

    
    
const solveAnswer = () => {
    console.log(X);
    console.log(fx);
    if (X.length < 2 || fx.length < 2) {
        alert("Please enter at least two points.");
        return;
    }
    let equationLatex = "";
    let matrixLatex = "";
    let matrixSubstitudeLatex = "";

    const n = X.length;
    let A = Array.from({ length: K + 1 }, () => Array(K + 1).fill(0));
    let B = Array(K + 1).fill(0);


    A[0][0] = n;
    for (let i = 0; i < n; i++) {
        let yi = fx[i];
        B[0] += yi;  // ∑yi

        for (let j = 0; j < K; j++) { 
            let xji = X[i][j]; // x vertical

            A[0][j + 1] += xji;     // first row
            A[j + 1][0] += xji;     // first col
            B[j + 1] += xji * yi;   // ∑ xi*yi

            // matrix body
            for (let l = 0; l < K; l++) {
                let xli = X[i][l];  // x horizontal
                A[j + 1][l + 1] += xji * xli;  // ∑ xji*xli
            }
        }
    }
    console.log("A "+ A);
    console.log("B "+ B);
    const resultA = lusolve(A, B);
    //console.log(resultA);
    
    let slopes = resultA.slice(1).map(Number);
    let intercept = Number(resultA[0]);
    console.log("slope ai "+slopes);
    console.log("intercept a0 "+intercept);

    let calculatedResult = intercept;
    for (let j = 0; j < K; j++) {
        calculatedResult += slopes[j] * findX[j];
    }
    //console.log(calculatedResult);
    

   equationLatex += `From \\ f(x) = a_0 + \\sum_{i=1}^{k} a_i x_i \\ \\\\ when \\ a_0 \\ is \\ y-intercept \\ \\\\ and \\ a_i \\ is \\ slope`;

   // Matrix no substitude
   
   // Matrix A
   // First row
   matrixLatex += `\\begin{bmatrix} n`;
   for (let j = 1; j < K+1; j++) {
        matrixLatex += ` & \\sum_{i=1}^{n} x_{${j}i}`;
   }
    matrixLatex += `\\\\`;
    // Remaining rows
    for (let j = 1; j < K+1; j++) {
        matrixLatex += `\\sum_{i=1}^{n} x_{${j}i}`;
        for (let l = 1; l < K+1; l++) {
            matrixLatex += ` & \\sum_{i=1}^{n} x_{${j}i} x_{${l}i}`;
        }
        matrixLatex += ` \\\\`;
    }
    matrixLatex += `\\end{bmatrix}`;

    // Matrix X
    matrixLatex += `\\begin{bmatrix}`;
    for (let j = 0; j < K+1; j++) {
        matrixLatex += ` a{${j}} \\\\`;
    }
    matrixLatex += `\\end{bmatrix}=`;

    // Matrix B
    matrixLatex += `\\begin{bmatrix}`;
    for (let j = 0; j < K+1; j++) {
        if(j === 0){
            matrixLatex += `\\sum_{i=1}^{n} `;
        }
        else{
            matrixLatex += `\\sum_{i=1}^{n} x_{${j}i}`;
        }
        matrixLatex += ` y_{i} \\\\`;
    }
    matrixLatex += `\\end{bmatrix}`;



    //console.log(A[0]);
    // Substitute Matrix LaTeX
    let index = 0;

    // Start the LaTeX matrix
    matrixSubstitudeLatex += `\\begin{bmatrix}`;

    // Loop to create the matrix rows and columns
    for (let j = 0; j < K + 1; j++) {
        for (let m = 0; m < K + 1; m++) {
            matrixSubstitudeLatex += `${A[j][m]}`;
            index++;

            // Add an "&" separator if not the last element of the row
            if (m < K) {
             matrixSubstitudeLatex += ` & `;
            }
        }
        matrixSubstitudeLatex += `\\\\`;
    }
    matrixSubstitudeLatex += `\\end{bmatrix}`;


    // Matrix X
    matrixSubstitudeLatex += `\\begin{bmatrix}`;
    for (let j = 0; j < K+1; j++) {
        matrixSubstitudeLatex += ` a_{${j}} \\\\`;
    }
    matrixSubstitudeLatex += `\\end{bmatrix}=`;

    // Matrix B
    matrixSubstitudeLatex += `\\begin{bmatrix}`;
    for (let j = 0; j < K+1; j++) {
        matrixSubstitudeLatex += `${B[j]} \\\\ `;
    }
    matrixSubstitudeLatex += `\\end{bmatrix}`;


   let functionLatex = `f(${Array.from({ length: K }, (_, idx) => `x_{${idx + 1}}`).join(', ')}) = ${intercept} + ` + slopes.map((slope, idx) => `(${slope})x_${idx + 1}`).join(' + ');

    const renderedFunction = katex.renderToString(functionLatex, {
        throwOnError: false,
    });

    const renderedEquation = katex.renderToString(equationLatex, {
        throwOnError: false,
    });

    const renderedMatrix = katex.renderToString(matrixLatex, {
        throwOnError: false,
    });

    const renderedMatrixSubstitude = katex.renderToString(matrixSubstitudeLatex, {
        throwOnError: false,
    });

    setRegressionFunctionSubstitude(renderedFunction);
    setMatrixSubstitude(renderedMatrixSubstitude);
    setRegressionFunction(renderedEquation);
    setMatrixEquation(renderedMatrix);
    setSlope(slope);
    setIntercept(intercept);
    setResult(calculatedResult);
    
}
    

const printAnswer = () => {
    if (result !== null) {
        let polynomialLatex = `f(${findX}) = ${result}`;
        const renderedAnswer = katex.renderToString(polynomialLatex, {
            throwOnError: false,
        });
        
        return (
            <div dangerouslySetInnerHTML={{ __html: renderedAnswer }} />
        );
    }
    return null;
};


const printSolution = () => {
    if (result !== null) {
        return (
            <div>
                <div style={{ textAlign: "center" }} dangerouslySetInnerHTML={{ __html: regressionFunction }} />
                <br />
                <div style={{ textAlign: "center" }} dangerouslySetInnerHTML={{ __html: matrixEquation }} />
                <br />
                <div style={{ textAlign: "center" }} dangerouslySetInnerHTML={{ __html: matrixSubstitude }} />
                <br />
                <div style={{ textAlign: "center" }} dangerouslySetInnerHTML={{ __html: regressionFunctionSubstitude }} />
                <br />
                <div style={{ textAlign: "center" }} dangerouslySetInnerHTML={{ __html: printAnswer().props.dangerouslySetInnerHTML.__html }} />
                
            </div>
        );
    }
    return null;
};

    
    return (
        <>
            <NavigationBar />
            <div className="outer-container">
                <h1 className='title'>Multiple Linear Regression</h1>
                <Row>
                    <Col md={3} className='left-column'>
                        <div className="form-container" >
                            <Form>
                            <Form.Group className="mb-3" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <Form.Label>k (number of x)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={K}
                                        onChange={handleKChange}
                                        style={{ width: '50%' }}
                                        placeholder="2"
                                    />
                                </Form.Group>
                                <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                <Form.Label style={{ alignItems: 'center' }}>Find f(x) where x is</Form.Label>
                                </span>
                                {[...Array(K)].map((_, index) => (
                                    <Form.Group key={index} className="mb-3" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        <Form.Control
                                            type="number"
                                            value={findX[index] || ""}
                                            onChange={(event) => handleFindXChange(index, event)}
                                            style={{ width: '50%' }}
                                            placeholder={`x${index + 1}`}
                                        />
                                    </Form.Group>
                                ))}


                                <Button variant="dark" onClick={handleShow} className="centered-button" style={{ width: "125px" }}>
                                    Set Value
                                </Button>

                                <Modal show={show} onHide={handleClose} centered size="lg">
                                    <Modal.Header closeButton>
                                        <Modal.Title>Value Input</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Form.Group className="mb-3" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                            <Form.Label style={{ marginRight: '10px' }}>Points Amount</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={point}
                                                onChange={(event) => setPoint(event.target.value)}
                                                style={{ width: '15%' }}
                                                placeholder="3"
                                            />
                                        </Form.Group>
                                        <div>{inputTable(point)}</div>
                                        <p style={{textAlign:"center"}}>Please input at least 2 points</p>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="dark" onClick={getEquationApi} className="centered-button-2" style={{ width: '15%' }}>
                                            Get Points
                                        </Button>
                                        <Button variant="danger" onClick={clearInputs}>
                                            Clear
                                        </Button>
                                    </Modal.Footer>
                                </Modal>

                                <Button variant="dark" onClick={solveAnswer} className="centered-button">
                                    Solve
                                </Button>

                                <h5 style={{ textAlign: 'center', marginTop: '20px' }}>{printAnswer()}</h5>
                            </Form>
                        </div>
                    </Col>
                    <Col md={9} className='right-column'>
                        <Accordion defaultActiveKey="0" className='according-container'>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Equation Graph</Accordion.Header>
                                <Accordion.Body>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                        {}
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>Solution</Accordion.Header>
                                <Accordion.Body>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                                        {printSolution()}
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default MultipleLinearRegression;

