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


const PolynomialRegression = () => {
    const [findX, setFindX] = useState(4.5); 
    const [order, setOrder] = useState(2); 
    const [point, setPoint] = useState(5); 
    const [X, setX] = useState([]); 
    const [fx, setFx] = useState([]);
    const [result, setResult] = useState(null);
    const [coefficient, setCoefficient] = useState([]);
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
            const response = await fetch(`https://pj-numer-api.onrender.com/interExtraData/filter?data_id=1`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const equationData = await response.json();  
            console.log(equationData);
            if (equationData) {
                setPoint(equationData.point_amount);
                setX(equationData.x[0]);
                setFx(equationData.fx);
            } else {
                console.error("No data received");
            }
        } catch (error) {
            console.error("Failed to fetch equation data:", error);
        }
    };

    const handleOrderChange = (event) => {
        const newOrder = parseInt(event.target.value) || 1;
        setOrder(newOrder);
    };

    
    const inputTable = (point) => {
        const handleXChange = (index, event) => {
            let newX = [...X];
            //newX[index] = event.target.value === "" ? 0 : Number(event.target.value);
            newX[index] = parseFloat(event.target.value) || 0;
            setX(newX);
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
                        <th>x</th>
                        <th>f(x)</th>
                    </tr>
                </thead>
                <tbody style={{ textAlign: "center" }}>
                    {[...Array(parseInt(point)).keys()].map((i) => (
                        <tr key={i}>
                            <td>{i + 1}</td>
                            <td>
                                <Form.Control
                                    type="number"
                                    placeholder={`0`}
                                    value={X[i] || ""}
                                    onChange={(event) => handleXChange(i, event)}
                                />
                            </td>
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
    console.log(fx);
    if (X.length < 2 || fx.length < 2) {
        alert("Please enter at least two points.");
        return;
    }
    let equationLatex = "";
    let matrixLatex = "";
    let matrixSubstitudeLatex = "";

    const n = X.length;

    let A = Array.from({ length: order + 1 }, () => Array(order + 1).fill(0));
    let B = Array(order + 1).fill(0);
 
    for (let i = 0; i < n; i++) {
        let xi = X[i];  
        let yi = fx[i]; 
        B[0] += yi; 
        
        for (let j = 1; j <= order; j++) {
            B[j] += Math.pow(xi, j) * yi;  
        }

        for (let j = 0; j <= order; j++) {
            for (let l = 0; l <= order; l++) {
                A[j][l] += Math.pow(xi, j + l);  
            }
        }
    }

    console.log("Matrix A:", A);
    console.log("Matrix B:", B);
    const resultA = lusolve(A, B);  

    let coefficients = resultA.map(Number); 
    console.log("Polynomial coefficients:", coefficients);

    let calculatedResult = coefficients[0]; 
    for (let j = 1; j <= order; j++) {
        calculatedResult += coefficients[j] * Math.pow(findX, j);  
    }
    console.log("Predicted result:", calculatedResult);



    equationLatex += `From \\ f(x) = a_0 + a_1x + a_2x^2 + ... + a_mx^m `;
    // Matrix no substitude
   // Matrix A
    matrixLatex += `\\begin{bmatrix} n`;
    for (let j = 1; j < order + 1; j++) {
        matrixLatex += ` & \\sum_{i=1}^{n} x_i`;
        if (j > 1) matrixLatex += `^${j}`;
    }
    matrixLatex += ` \\\\`;

    // Remaining rows
    for (let j = 1; j < order + 1; j++) {
        matrixLatex += `\\sum_{i=1}^{n} x_i`;
        if (j > 1) matrixLatex += `^${j}`;
        for (let l = 1; l < order + 1; l++) {
            matrixLatex += ` & \\sum_{i=1}^{n} x_i^${j + l}`;
        }
        matrixLatex += ` \\\\`;
    }
    matrixLatex += `\\end{bmatrix}`;

    // Matrix X
    matrixLatex += `\\begin{bmatrix}`;
    for (let j = 0; j < order + 1; j++) {
        matrixLatex += ` a_${j} \\\\`;
    }
    matrixLatex += `\\end{bmatrix}=`;

    // Matrix B
    matrixLatex += `\\begin{bmatrix}`;
    for (let j = 0; j < order + 1; j++) {
        if(j === 0){
            matrixLatex += `\\sum_{i=1}^{n} y_i \\\\`;
        }
        else if(j === 1){
            matrixLatex += `\\sum_{i=1}^{n} x_iy_i \\\\`;
        }
        else{
            matrixLatex += `\\sum_{i=1}^{n} x_i^${j} y_i \\\\`;
        }
    }
    matrixLatex += `\\end{bmatrix}`;


     // Substitute Matrix LaTeX
     let index = 0;

     // Start the LaTeX matrix
     matrixSubstitudeLatex += `\\begin{bmatrix}`;
 
     // Loop to create the matrix rows and columns
     for (let j = 0; j < order + 1; j++) {
         for (let m = 0; m < order + 1; m++) {
             matrixSubstitudeLatex += `${A[j][m]}`;
             index++;
 
             // Add an "&" separator if not the last element of the row
             if (m < order) {
              matrixSubstitudeLatex += ` & `;
             }
         }
         matrixSubstitudeLatex += `\\\\`;
     }
     matrixSubstitudeLatex += `\\end{bmatrix}`;
 
 
     // Matrix X
     matrixSubstitudeLatex += `\\begin{bmatrix}`;
     for (let j = 0; j < order+1; j++) {
         matrixSubstitudeLatex += ` a_{${j}} \\\\`;
     }
     matrixSubstitudeLatex += `\\end{bmatrix}=`;
 
     // Matrix B
     matrixSubstitudeLatex += `\\begin{bmatrix}`;
     for (let j = 0; j < order+1; j++) {
         matrixSubstitudeLatex += `${B[j]} \\\\ `;
     }
     matrixSubstitudeLatex += `\\end{bmatrix}`;


    let equationPlot = `${coefficients[0]}`;
    let functionLatex = `f(x) = ${coefficients[0]}`;  
    for (let i = 1; i < order+1; i++) {
        functionLatex += ` + (${coefficients[i]})x^{${i}}`;
        equationPlot += ` + ${coefficients[i]}x^${i}`
    }

    console.log(equationPlot);
    setEquation(equationPlot);


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
    setCoefficient(coefficients);
    console.log(calculatedResult);
    setResult(calculatedResult);
    
}
    

const printAnswer = () => {
    if (result !== null) {
        //console.log(result);
        let polynomialLatex = `f(${findX}) = ${result.toFixed(6)}`;
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

const EquationGraph = () => {
    const xMin = Math.min(...X) - 2; 
    const xMax = Math.max(...X) + 2;

    const stepSize = (xMax - xMin) / 100;
    const xValues = Array.from({ length: 100 }, (_, i) => xMin + (i * stepSize)); 
    const yValues = xValues.map(x => {
        try {
            return evaluate(Equation, { x });  
        } catch (error) {
            console.error(`Error evaluating equation at x=${x}:`, error);
            return null;  
        }
    });


    return (
        <Plot
            data={[
                //graph
                {
                    x: xValues,
                    y: yValues,
                    mode: 'lines',
                    type: 'scatter',
                    marker: { color: '#5045e5' },
                    name: 'f(x)',
                },
                // points
                {
                    x: X,   
                    y: fx, 
                    mode: 'markers',
                    type: 'scatter',
                    marker: { color: '#D91656', size: 8 }, 
                    name: 'Points',
                },
                // result
                {
                    x: [parseFloat(findX)],   
                    y: [parseFloat(result)], 
                    mode: 'markers',
                    type: 'scatter',
                    marker: { color: '#117554', size: 8 }, 
                    name: 'Answer',
                },
                
            ]}

            config={{
                displayModeBar: true, 
                scrollZoom: true,
            }}

            layout={{
                xaxis: {
                    title: 'x',
                },
                yaxis: {
                    title: 'f(x)',
                    rangemode: 'tozero',
                },     
            }}            
        />
    );
};


    return (
        <>
            <NavigationBar />
            <div className="outer-container">
                <h1 className='title'>Polynomial Regression</h1>
                <Row>
                    <Col md={3} className='left-column'>
                        <div className="form-container">
                            <Form>
                                <Form.Group className="mb-3" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <Form.Label>Find f(x) where x is</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={findX}
                                        onChange={(event) => setFindX(event.target.value)}
                                        style={{ width: '50%' }}
                                        placeholder="3"
                                    />
                                </Form.Group>

                                <Form.Label style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>m (order)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={order}
                                        onChange={handleOrderChange}
                                        style={{ width: '50%',margin: '0 auto'}}
                                        placeholder="2"
                                    />

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
                                        {EquationGraph()}
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

export default PolynomialRegression;

