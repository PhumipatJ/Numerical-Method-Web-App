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


const Spline = () => {
    const [findX, setFindX] = useState(4.5); 
    const [point, setPoint] = useState(5); 
    const [selectedPolynomial, setSelectedPolynomial] = useState("1"); // linear, quadratic, cubic
    const [X, setX] = useState([]); 
    const [fx, setFx] = useState([]);
    const [result, setResult] = useState(null);
    const [polynomial, setPolynomial] = useState(""); 
    const [answerPolynomial, setAnswerPolynomial] = useState(""); 
    const [slopeArr, setSlope] = useState([]); 
    
    const [show, setShow] = useState(false); 
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSelectedPolynomialChange = (event) => {
        setSelectedPolynomial(event.target.value);
    };
    
    const clearInputs = () => {
        setX([]);
        setFx([]); 
    };

    const getEquationApi = async () => {
        try {
            const response = await fetch(`http://localhost:5000/interExtraData/filter?data_id=1`);
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
    
    const inputTable = (point) => {
        const handleXChange = (index, event) => {
            let newX = [...X];
            newX[index] = parseFloat(event.target.value) || "0";
            setX(newX);
            let slope=[];
            setSlope(slope);
        };

        const handleFxChange = (index, event) => {
            let newFx = [...fx];
            newFx[index] = parseFloat(event.target.value) || "0";
            setFx(newFx);
            let slope=[];
            setSlope(slope);
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
    if (X.length < 2 || fx.length < 2) {
        alert("Please enter at least two points.");
        return;
    }

    const xValues = X.map(Number);
    const fValues = fx.map(Number);
    let interpolatedValue; // for store result
    
    let slope = [];
    for(let i=1;i<X.length;i++){
        const x0 = xValues[i - 1];
        const x1 = xValues[i];
        const f0 = fValues[i - 1];
        const f1 = fValues[i];
        slope[i] =  ((f1 - f0) / (x1 - x0));
    }
    setSlope(slope);
    

    let polynomialLatex = "";
    let AnswerPolynomialLatex = "";

    if (selectedPolynomial === "1") { // Linear Spline
        const index = xValues.findIndex(x => x > findX);
        if (index === 0 || index === -1) {
            interpolatedValue = "Out of bounds.";
        } 
        else {
            for (let i = 1; i < X.length; i++) {
                const x0 = xValues[i - 1];
                const x1 = xValues[i];
                const f0 = fValues[i - 1];
                const currentSlope = slope[i];
                
                polynomialLatex += `f_{${i}}(x) = ${f0} + (${currentSlope})(x - ${x0}); \\ ${x0} \\leq x \\leq ${x1} \\\\ `;

                // answer calculate
                if (x0 <= findX && findX <= x1) {
                    interpolatedValue = f0 + (findX - x0) * currentSlope;
                    AnswerPolynomialLatex += `From \\ f_{${i}}(x) = ${f0} + (${currentSlope})(x - ${x0}) \\  when \\ ${x0} \\leq x \\leq ${x1} \\\\ `
                    AnswerPolynomialLatex += `f(${findX}) = ${f0} + (${currentSlope})(${findX} - ${x0}) = ${interpolatedValue} \\\\ `;
                }
            }
        }

    } 
    else if (selectedPolynomial === "2") { // Quadratic Spline
        const n = X.length; // Number of points
        const a = new Array(n - 1);
        const b = new Array(n - 1);
        const c = new Array(n - 1);
        
        const h = new Array(n - 1);
        const alpha = new Array(n - 1);
        
        // Calculate h and alpha
        for (let i = 0; i < n - 1; i++) {
            h[i] = X[i + 1] - X[i];
            alpha[i] = (fx[i + 1] - fx[i]) / h[i];
        }
        
        // Set c coefficients to zero for the natural spline case
        c[0] = 0; // Assuming natural boundary condition
        for (let i = 0; i < n - 2; i++) {
            c[i + 1] = (alpha[i + 1] - alpha[i]) / h[i + 1];
        }
        c[n - 2] = 0; // Last c coefficient is also set to zero
    
        // Initialize a coefficients (function values)
        for (let i = 0; i < n - 1; i++) {
            a[i] = fx[i];
        }
    
        // Calculate b coefficients
        for (let i = 0; i < n - 2; i++) {
            b[i] = alpha[i] - h[i] * c[i];
        }
        b[n - 2] = alpha[n - 2]; // Last b coefficient
    
        // Generate polynomial string and calculate interpolated values
        for (let i = 0; i < n - 1; i++) {
            const x0 = X[i];
            const x1 = X[i + 1];
            
            polynomialLatex += `f_{${i}}(x) = (${a[i]}) + (${b[i]}) (x - ${x0}) + (${c[i]}) (x - ${x0})^2; \\ ${x0} \\leq x \\leq ${x1} \\\\ `;
    
            // Calculate the interpolated value
            if (x0 <= findX && findX <= x1) {
                const dx = findX - x0;
                interpolatedValue = a[i] + b[i] * dx + c[i] * dx * dx; // Evaluate the spline at findX
                AnswerPolynomialLatex += `From \\ f_{${i}}(x) = (${a[i]}) + (${b[i]}) (x - ${x0}) + (${c[i]}) (x - ${x0})^2 \\quad where \\quad ${x0} \\leq x \\leq ${x1} \\\\ `;
                AnswerPolynomialLatex += `f(${findX}) = ${a[i]} + ${b[i]}(${findX} - ${x0}) + ${c[i]}(${findX} - ${x0})^2 = ${interpolatedValue} \\\\ `;
            }
        }
    }
    
    else if (selectedPolynomial === "3") { // Cubic Spline
        const n = X.length; // Number of points
        const a = new Array(n - 1);
        const b = new Array(n - 1);
        const c = new Array(n);
        const d = new Array(n - 1);
        
        const h = new Array(n - 1);
        
        // Calculate h values
        for (let i = 0; i < n - 1; i++) {
            h[i] = xValues[i + 1] - xValues[i];
        }
    
        // Set up the system of equations
        const A = new Array(n).fill(0).map(() => new Array(n).fill(0));
        const rhs = new Array(n).fill(0);
    
        // Natural spline conditions
        A[0][0] = 1; // C[0] = 0 (natural spline boundary condition)
        for (let i = 1; i < n - 1; i++) {
            A[i][i - 1] = h[i - 1];
            A[i][i] = 2 * (h[i - 1] + h[i]);
            A[i][i + 1] = h[i];
            rhs[i] = (3 / h[i]) * (fValues[i + 1] - fValues[i]) - (3 / h[i - 1]) * (fValues[i] - fValues[i - 1]);
        }
        A[n - 1][n - 1] = 1; // C[n-1] = 0 (natural spline condition)
    
        // Solve the linear system for c
        for (let i = 1; i < n - 1; i++) {
            const m = A[i][i - 1] / A[i - 1][i - 1];
            A[i][i] -= m * A[i - 1][i];
            rhs[i] -= m * rhs[i - 1];
        }
        c[n - 1] = rhs[n - 1] / A[n - 1][n - 1];
        
        for (let i = n - 2; i >= 0; i--) {
            c[i] = (rhs[i] - A[i][i + 1] * c[i + 1]) / A[i][i];
        }
    
        // Calculate a, b, and d coefficients
        for (let i = 0; i < n - 1; i++) {
            a[i] = fValues[i];
            d[i] = (c[i + 1] - c[i]) / (3 * h[i]);
            b[i] = (fValues[i + 1] - fValues[i]) / h[i] - (h[i] * (c[i + 1] + 2 * c[i])) / 3;
        }
    
        // Generate polynomial string and calculate interpolated values
        for (let i = 0; i < n - 1; i++) {
            const x0 = X[i];
            const x1 = X[i + 1];
    
            polynomialLatex += `f_{${i}}(x) = (${a[i]}) + (${b[i]}) (x - ${x0}) + (${c[i]}) (x - ${x0})^2 + (${d[i]}) (x - ${x0})^3; \\ ${x0} \\leq x \\leq ${x1} \\\\ `;
    
            // Calculate the interpolated value
            if (x0 <= findX && findX <= x1) {
                const dx = findX - x0;
                interpolatedValue = a[i] + b[i] * dx + c[i] * dx * dx + d[i] * dx * dx * dx; // Evaluate the spline at findX
                AnswerPolynomialLatex += `From \\ f_{${i}}(x) = (${a[i]}) + (${b[i]}) (x - ${x0}) + (${c[i]}) (x - ${x0})^2 + (${d[i]}) (x - ${x0})^3 \\quad where \\quad ${x0} \\leq x \\leq ${x1} \\\\ `;
                AnswerPolynomialLatex += `f(${findX}) = ${a[i]} + ${b[i]}(${findX} - ${x0}) + ${c[i]}(${findX} - ${x0})^2 + ${d[i]}(${findX} - ${x0})^3 = ${interpolatedValue} \\\\ `;
            }
        }
    }
    

    
    const renderedPolynomial = katex.renderToString(polynomialLatex, {
        throwOnError: false,
    });

    const renderedAnswerPolynomial = katex.renderToString(AnswerPolynomialLatex, {
        throwOnError: false,
    });

    setPolynomial(renderedPolynomial);
    setAnswerPolynomial(renderedAnswerPolynomial);
    setResult(interpolatedValue);
};

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
        return (
            <div style={{ width: "100%" }}>
                <Table className="rounded-table">
                    <thead>
                        <tr>
                            <th>i</th>
                            <th>x<sub>i</sub></th>
                            <th>f(x<sub>i</sub>)</th>
                        </tr>
                    </thead>
                    <tbody style={{ textAlign: "center" }}>
                        {X.map((value, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{value}</td> 
                                <td>{fx[index]}</td> 
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <h5 style={{ textAlign: "center" }}>Spline Equation</h5>
                <div style={{ textAlign: "center" }} dangerouslySetInnerHTML={{ __html: polynomial }} />
                <br />
                <div style={{ textAlign: "center" }} dangerouslySetInnerHTML={{ __html: answerPolynomial }} />
            </div>
        );
};

    
    return (
        <>
            <NavigationBar />
            <div className="outer-container">
                <h1 className='title'>Spline Interpolation</h1>
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

                                <Form.Label style={{ display: 'flex', justifyContent: 'center' }}>Select Solution</Form.Label>
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <Form.Select
                                            style={{ width: "125px" }}
                                            value={selectedPolynomial}
                                            onChange={handleSelectedPolynomialChange} 
                                        >
                                            <option value="1">Linear</option>
                                            <option value="2">Quadratic</option>
                                            <option value="3">Cubic</option>
                                    </Form.Select>
                                </div>
                                

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
                                        <p style={{textAlign:"center"}}>Please select at least 2 ponts</p>
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

export default Spline;

