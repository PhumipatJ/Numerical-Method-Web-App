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


const NewtonDivided = () => {
    const [findX, setFindX] = useState(40439); 
    const [point, setPoint] = useState(5); 
    const [X, setX] = useState([]); 
    const [fx, setFx] = useState([]);
    const [selectPoints, setSelectPoints] = useState([]); 
    const [dividedDifference, setDividedDifference] = useState([]); //table mem
    const [result, setResult] = useState(null);
    const [polynomial, setPolynomial] = useState(""); 

    const [show, setShow] = useState(false); 
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const clearInputs = () => {
        setX([]);
        setFx([]); 
        setSelectPoints([]);
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

    const newtonDividedDifference = (X, fx) => {
        let n = X.length;
        let table = [...Array(n)].map(() => Array(n).fill(0));

        for (let i = 0; i < n; i++) {
            table[i][0] = (fx[i] === "") ? 0 : fx[i];
        }

        for (let j = 1; j < n; j++) {
            for (let i = 0; i < n - j; i++) {
                table[i][j] = (table[i + 1][j - 1] - table[i][j - 1]) / (X[i + j] - X[i]);
            }
        }

        setDividedDifference(table);
        return table;
    };

    const generatePolynomial = (X, table) => {
        let polynomialLatex = `f(${findX}) = `;
        
        const formatTerm = (coeff, factors) => {
            let term = (parseFloat(coeff) || 0).toFixed(2);   // Format the coefficient for better display
            factors.forEach((factorIndex) => {
                const xi = X[factorIndex] || 0;  // Use 0 if X[factorIndex] is empty
                term += `\\left(x - ${xi}\\right)`; 
            });
            return term;
        };
        
        for (let i = 0; i < X.length; i++) {
            if (i > 0) polynomialLatex += " + ";  // Add plus between terms
            polynomialLatex += formatTerm(table[0][i], [...Array(i).keys()]);
        }

        const renderedPolynomial = katex.renderToString(polynomialLatex, {
            throwOnError: false,
        });
        
        setPolynomial(renderedPolynomial);
        return renderedPolynomial;
    };
    
    const calculatePolynomial = (X, table, xToFind) => {
        let result = table[0][0];
        let n = X.length;
        let product = 1;

        for (let i = 1; i < n; i++) {
            product *= (xToFind - X[i - 1]);
            result += table[0][i] * product;
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

        const dividedDiffTable = newtonDividedDifference(selectedX, selectedFx);
        const resultValue = calculatePolynomial(selectedX, dividedDiffTable, parseFloat(findX));
        const polynomialExpression = generatePolynomial(selectedX, dividedDiffTable);

        setResult(resultValue);
        setPolynomial(polynomialExpression);
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
        if (dividedDifference.length > 0) {
            return (
                <div>
                    <h5 style={{textAlign:"center"}}>Divided Difference Table</h5>
                    <Table className="rounded-table">
                        <thead>
                            <tr>
                                <th>x<sub>i</sub></th>
                                {[...Array(dividedDifference[0]?.length || 0)].map((_, j) => (
                                    <th key={j}>
                                        {`f[ ${[...Array(j + 1).keys()].map(i => `x${i+1}`).join(', ')} ]`}
                                    </th>
                                ))}
                            </tr>
                        </thead>


                        <tbody style={{textAlign:"center"}}>
                            {dividedDifference.map((row, i) => (
                                <tr key={i}>
                                    <td>{i+1}</td>
                                    {row.map((val, j) => (
                                        <td key={j}>{(val === 0 && j!=0) ? '' : val}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>

                    </Table>
                    <h5 style={{textAlign:"center"}}>Interpolation Equation</h5>
                    <div style={{textAlign:"center"}} dangerouslySetInnerHTML={{ __html: polynomial }}></div>
                    <div style={{textAlign:"center"}}>{printAnswer()}</div>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <NavigationBar />
            <div className="outer-container">
                <h1 className='title'>Newton Divided-Difference</h1>
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
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
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

export default NewtonDivided;
