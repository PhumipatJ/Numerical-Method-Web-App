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
import { lusolve } from 'mathjs';


const LinearRegression = () => {
    const [findX, setFindX] = useState(4.5); 
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


    const [show, setShow] = useState(false); 
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    const clearInputs = () => {
        setX([]);
        setFx([]); 
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
    let totalX = 0;
    let totalY = 0;
    let totalXY = 0;
    let totalX2 = 0;
    for(let i = 0;i<n;i++){
        totalX += X[i];
        totalY += fx[i];
        totalXY += X[i]*fx[i];
        totalX2 += X[i]*X[i];
    }
    let A = [
        [n, totalX],
        [totalX, totalX2]
      ];
    let B = [totalY, totalXY];
    
    const resultA = lusolve(A, B);
    console.log(resultA);
    
    let slope = Number(resultA[1]);
    let intercept = Number(resultA[0]);
    let calculatedResult = (slope * findX) + intercept;

    equationLatex += `From \\ y = c + mx \\ \\\\ Let \\ f(x) = a_0 + a_1 x \\ \\\\ when \\ c,a_0 \\ is \\ y-intercept \\ \\\\ and \\ m,a_1 \\ is \\ slope`;
    matrixLatex += `
    \\begin{bmatrix} n & \\sum_{i=1}^{n} x_i \\\\ \\sum_{i=1}^{n} x_i & \\sum_{i=1}^{n} x_i^2 \\end{bmatrix}
    \\begin{bmatrix} a_0 \\\\ a_1 \\end{bmatrix}=
    \\begin{bmatrix} \\sum_{i=1}^{n} y_i \\\\ \\sum_{i=1}^{n} x_iy_i \\end{bmatrix}
    `
    matrixSubstitudeLatex+=`
    \\begin{bmatrix} ${n} & ${totalX} \\\\ ${totalX} & ${totalX2} \\end{bmatrix}
    \\begin{bmatrix} a_0 \\\\ a_1 \\end{bmatrix}=
    \\begin{bmatrix} ${totalY} \\\\ ${totalXY} \\end{bmatrix}
    `

    let functionLatex = `f(${findX}) =(${intercept}) + (${slope})x`

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
                <Table className="rounded-table">
                    <thead>
                        <tr>
                            <th>x<sub>i</sub></th>
                            <th>y<sub>i</sub></th>
                            <th>x<sub>i</sub><sup>2</sup></th>
                            <th>x<sub>i</sub>y<sub>i</sub></th>
                        </tr>
                    </thead>
                    <tbody style={{ textAlign: "center" }}>
                        {X.map((xVal, index) => (
                                <tr key={index}>
                                    <td>{X[index]}</td>
                                    <td>{fx[index]}</td>
                                    <td>{X[index] ** 2}</td>
                                    <td>{X[index] * fx[index]}</td>
                                </tr>
                            ))}
                    </tbody>
                </Table>
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
                <h1 className='title'>Linear Regression</h1>
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

export default LinearRegression;

