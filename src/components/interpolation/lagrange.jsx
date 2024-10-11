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

const Lagrange = () => {
    const [findX, setFindX] = useState(40439); 
    const [point, setPoint] = useState(5); 
    const [X, setX] = useState([]); 
    const [fx, setFx] = useState([]);
    const [selectPoints, setSelectPoints] = useState([]); 
    const [lagrangeTable, setLagrangeTable] = useState([]); // renamed from dividedDifference
    const [result, setResult] = useState(null);
    const [polynomial, setPolynomial] = useState(""); 
    const [BackSubstitudeFormula, setBackSubstitudeFormula] = useState(""); 
    const [BackSubstitude, setBackSubstitude] = useState(""); 
    
    const [show, setShow] = useState(false); 
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const clearInputs = () => {
        setX([]);
        setFx([]); 
        setSelectPoints([]);
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

    const inputTable = (point) => {
        const handleXChange = (index, event) => {
            let newX = [...X];
            newX[index] = parseFloat(event.target.value) || "0";
            setX(newX);
        };

        const handleFxChange = (index, event) => {
            let newFx = [...fx];
            newFx[index] = parseFloat(event.target.value) || "0";
            setFx(newFx);
        };

        const handleSelectChange = (index, event) => {
            let newSelectPoints = [...selectPoints];
            newSelectPoints[index] = event.target.checked;
            setSelectPoints(newSelectPoints);
        };

        return (
            <Table className="rounded-table">
                <thead>
                    <tr>
                        <th>Point</th>
                        <th>x</th>
                        <th>f(x)</th>
                        <th>Select</th>
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
                            <td>
                                <Form.Check
                                    type="checkbox"
                                    checked={selectPoints[i] || false}
                                    onChange={(event) => handleSelectChange(i, event)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
    };
    
    const createLagrangeTable = (X, fx) => {
        const n = X.length;
        let table = [...Array(n)].map((_, i) => [
            X[i] === "" ? 0 : X[i],
            fx[i] === "" ? 0 : fx[i]
        ]);
        setLagrangeTable(table);
        return table;
    };

const generatePolynomial = (X, fx, xToFind) => {
    if (typeof xToFind === 'undefined' || xToFind === null) {
        console.error("xToFind is undefined or null.");
        return;
    }

    let polynomialLatex = "";
    let contributions = [];
    let finalExpression = `f(${xToFind}) = `;
    let finalExpressionSubstitude = `f(${xToFind}) = `;

    for (let i = 0; i < X.length; i++) {
        let term = `L_{${i}} = \\frac{`;
        let numerator = "";
        let denominator = "";

        for (let j = 0; j < X.length; j++) {
            if (j !== i) {
                numerator += `(x_{${j}} - x)`;
                denominator += `(x_{${j}} - x_{${i}})`;
            }
        }

        term += `${numerator}}{${denominator}} `;

        const substitutedNumerator = numerator.replace(/x_{(\d+)}/g, (_, index) => X[index]);
        const substitutedDenominator = denominator.replace(/x_{(\d+)}/g, (_, index) => X[index]);

        const finalNumerator = substitutedNumerator.replace(/x/g, `${xToFind}`);
        const finalDenominator = substitutedDenominator.replace(/x/g, `${xToFind}`);

        term += `= \\frac{${finalNumerator}}{${finalDenominator}} `;

        // value cal
        const numValue = X.reduce((acc, xVal, idx) => {
            if (idx !== i) {
                return acc * (xToFind - xVal);
            }
            return acc;
        }, 1);

        const denValue = X.reduce((acc, xVal, idx) => {
            if (idx !== i) {
                return acc * (X[i] - xVal);
            }
            return acc;
        }, 1);


        const result = (numValue / denValue).toFixed(6); //value cal
        term += `= ${result} \\newline \\newline `;
        contributions.push(term);

        finalExpression += `L_{${i}} f(x_{${i}}) + `;
        finalExpressionSubstitude += `(${result})(${fx[i]}) + `;
    }

    polynomialLatex = contributions.join("");
    finalExpression = finalExpression.slice(0, -3);
    finalExpressionSubstitude = finalExpressionSubstitude.slice(0, -3);

    

    const renderedPolynomial = katex.renderToString(polynomialLatex, {
        throwOnError: false,
    });

    const renderedFinalExpressionFormula = katex.renderToString(finalExpression, {
        throwOnError: false,
    });

    const renderedFinalExpression = katex.renderToString(finalExpressionSubstitude, {
        throwOnError: false,
    });
    
    setBackSubstitudeFormula(renderedFinalExpressionFormula);
    setBackSubstitude(renderedFinalExpression);
    setPolynomial(renderedPolynomial);
    return renderedPolynomial;
};

const calculatePolynomial = (X, fx, xToFind) => {
        let result = 0;
        const n = X.length;
    
        for (let i = 0; i < n; i++) {
            let term = fx[i];
            for (let j = 0; j < n; j++) {
                if (j !== i) {
                    term *= ( X[j] - xToFind ) / ( X[j] - X[i] );
                }
            }
            result += term;
        }
    
        return result;
};
    
    
    const solveAnswer = () => {
        let selectedX = X.filter((_, i) => selectPoints[i]);
        let selectedFx = fx.filter((_, i) => selectPoints[i]);
    
        if (selectedX.length < 2) {
            alert("Please select at least 2 points.");
            return;
        }
        
        createLagrangeTable(selectedX, selectedFx);
        const resultValue = calculatePolynomial(selectedX, selectedFx, parseFloat(findX));
    
        if (!isNaN(resultValue)) {
            const polynomialExpression = generatePolynomial(selectedX, selectedFx, parseFloat(findX));
            setResult(resultValue);
            setPolynomial(polynomialExpression);
        } else {
            console.error("Result value is not a number.");
        }
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
        if (lagrangeTable.length > 0) {
            return (
                <div>
                    <Table className="rounded-table">
                        <thead>
                            <tr>
                                <th>i</th>
                                <th>x<sub>i</sub></th>
                                <th>f(x<sub>i</sub>)</th>
                            </tr>
                        </thead>
                        <tbody style={{ textAlign: "center" }}>
                            {lagrangeTable.map((row, i) => (
                                <tr key={i}>
                                    <td>{i}</td>
                                    <td>{row[0]}</td>
                                    <td>{row[1]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <h5 style={{ textAlign: "center" }}>Interpolation Equation</h5>
                    <div style={{ textAlign: "center" }} dangerouslySetInnerHTML={{ __html: polynomial }} />
                    <br />
                    <div style={{ textAlign: "center" }} dangerouslySetInnerHTML={{ __html: BackSubstitudeFormula }} />
                    <div style={{ textAlign: "center" }} dangerouslySetInnerHTML={{ __html: BackSubstitude }} />
                    <div style={{ textAlign: "center" }} >{printAnswer()}</div>
                </div>
            );
        }
        return null;
    };
    

    return (
        <>
            <NavigationBar />
            <div className="outer-container">
                <h1 className='title'>Lagrange Interpolation</h1>
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

export default Lagrange;
