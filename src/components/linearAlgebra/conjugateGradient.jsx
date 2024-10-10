import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import { Button, Form, Table } from "react-bootstrap";
import NavigationBar from '../MyNavbar';
import '../../App.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import Modal from 'react-bootstrap/Modal';

const ConjugateGradient = () => {
    const [Dimension, setDimension] = useState(3);
    const [MatrixA, setMatrixA] = useState([]); 
    const [MatrixB, setMatrixB] = useState([]);
    const [initialX, setInitialX] = useState([]);
    const [solution, setSolution] = useState([]);
    const [steps, setSteps] = useState([]); // To store the steps for visualization
    const [errors, setErrors] = useState([]);
    // D alpha residual
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const dim = Number(Dimension);
        if (dim > 0) {
            setMatrixA(Array(dim).fill().map(() => Array(dim).fill(0)));
            setMatrixB(Array(dim).fill(0));
            setInitialX(Array(dim).fill(0));
        }
    }, [Dimension]);

    const getDimension = (event) => {
        const value = Number(event.target.value);
        if (value > 0){
            setDimension(value);
        }
    };

    const handleMatrixAChange = (i, j, value) => {
        const updatedMatrixA = [...MatrixA];
        updatedMatrixA[i][j] = parseFloat(value) || "0";
        setMatrixA(updatedMatrixA);
    };

    const handleMatrixBChange = (i, value) => {
        const updatedMatrixB = [...MatrixB];
        updatedMatrixB[i] = parseFloat(value) || "0";
        setMatrixB(updatedMatrixB);
    };

    const handleInitialXChange = (i, value) => {
        const updatedInitialX = [...initialX];
        updatedInitialX[i] = parseFloat(value) || "0";
        setInitialX(updatedInitialX);
    };

    const clearMatrixInputs = () => {
        const emptyMatrixA = MatrixA.map(row => row.map(() => ''));
        const emptyMatrixB = MatrixB.map(() => ''); 
        const emptyInitial = initialX.map(() => ''); 
    
        setMatrixA(emptyMatrixA);
        setMatrixB(emptyMatrixB);
        setInitialX(emptyInitial);
    };

    const getEquationApi = async () => {
        try {
            const response = await fetch(`https://numerical-method-web-app.onrender.com/linearAlgebraData/filter?data_id=3&dimension=${Dimension}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const equationData = await response.json();  
            //console.log(equationData);
            if (equationData) {
                setMatrixA(equationData.matrix_a);
                setMatrixB(equationData.matrix_b[0]);
                setInitialX(equationData.matrix_ini[0]);
            } else {
                console.error("No data received");
            }
        } catch (error) {
            console.error("Failed to fetch equation data:", error);
        }
    };

    const inputTable = () => {
        const borderStyle = { borderLeft: '1px solid #b0bdf0' };

        if (!MatrixA.length || !MatrixB.length) return null; // Avoid rendering if not initialized

        return (
            <Table className="rounded-table">
                <thead>
                    <tr>
                        <th></th> {/* Blank column */}
                        {[...Array(Dimension)].map((_, index) => (
                            <th key={index}> x<sub>{index + 1}</sub> </th>
                        ))}
                        <th style={borderStyle}>B</th>
                    </tr>
                </thead>
                <tbody>
                    {[...Array(Dimension)].map((_, i) => (
                        <tr key={i}>
                            <td style={{ textAlign: 'center' , width:"100px"}}>Equation {i + 1}</td>
                            {[...Array(Dimension)].map((_, j) => (
                                <td key={j}>
                                    <Form.Control 
                                        type="number"
                                        placeholder="0" className="custom-placeholder"
                                        value={MatrixA[i]?.[j] || ''} // Use an empty string instead of 0
                                        onChange={(event) => handleMatrixAChange(i, j, event.target.value)}
                                    />
                                </td>
                            ))}
                            <td style={borderStyle}>
                            <Form.Control 
                                type="number"
                                placeholder="0" className="custom-placeholder"
                                value={MatrixB[i] || ''} // Use an empty string instead of 0
                                onChange={(event) => handleMatrixBChange(i, event.target.value)}
                            />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

        );
    };

    const initialXTable = () => {
        return (
            <Table className="rounded-table">
                <thead>
                    <tr>
                        {[...Array(Dimension)].map((_, index) => (
                            <th key={index}> x<sub>{index + 1}</sub> </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {[...Array(Dimension)].map((_, i) => (
                            <td key={i}>
                                <Form.Control
                                    type="number"
                                    placeholder="0" className="custom-placeholder"
                                    value={initialX[i] || ''} // Use an empty string instead of 0
                                    onChange={(event) => handleInitialXChange(i, event.target.value)}
                                />
                            </td>
                        ))}
                    </tr>
                </tbody>
            </Table>
        );
    };

    const multiplyMatrices = (A, B) => A.map((row, i) => [row.reduce((sum, el, j) => sum + el * B[j][0], 0)]);

    const scalarMultiplyMatrix = (M, scalar) => M.map(row => [row[0] * scalar]);

    const subtractMatrices = (A, B) => A.map((row, i) => [row[0] - B[i][0]]);

    const findR = (A, B, X) => subtractMatrices(multiplyMatrices(A, X), B);

    const findError = (R, B) => {
        const errorNorm = Math.sqrt(R.reduce((sum, row) => sum + row[0] ** 2, 0));
        const referenceNorm = Math.sqrt(B.reduce((sum, row) => sum + row[0] ** 2, 0));
        return (errorNorm / referenceNorm); // Percentage error
    };
    

    const findRambda = (A, D, R) => {
        const numerator = multiplyMatrices(transposeMatrix(D), R)[0][0];
        const denominator = multiplyMatrices(transposeMatrix(D), multiplyMatrices(A, D))[0][0];
        return -numerator / denominator;
    };

    const findX = (X, rambda, D) => addMatrices(X, scalarMultiplyMatrix(D, rambda));

    const findAlpha = (Rnew, A, D) => {
        const numerator = multiplyMatrices(transposeMatrix(Rnew), Rnew)[0][0];
        const denominator = multiplyMatrices(transposeMatrix(D), multiplyMatrices(A, D))[0][0];
        return numerator / denominator;
    };

    const findD = (Rnew, alpha, D) => subtractMatrices(scalarMultiplyMatrix(D, alpha), Rnew);

    const addMatrices = (A, B) => A.map((row, i) => [row[0] + B[i][0]]);

    const transposeMatrix = M => M[0].map((_, colIndex) => M.map(row => row[colIndex]));

    const solveAnswer = () => {
        let A = MatrixA;
        let B = MatrixB.map(val => [val]);
        let X = initialX.map(val => [val]);
    
        let stepsData = [];
        let R = findR(A, B, X);
        let D = scalarMultiplyMatrix(R, -1);
        let error = findError(R, B);
    
        let iter = 0;
        let maxIter = 100;
        let tolerance = 0.01; 
    
        while (error > tolerance && iter < maxIter) {
            let rambda = findRambda(A, D, R);
            let newX = findX(X, rambda, D);
            let newR = findR(A, B, newX);
            let newError = findError(newR, B); // Calculate new %error
    
            let alpha = findAlpha(newR, A, D);
            let newD = findD(newR, alpha, D);
    
            stepsData.push({
                iteration: iter + 1,
                lambda: rambda.toFixed(6),
                D: D.map(row => row[0].toFixed(6)),
                X: newX.map(row => row[0].toFixed(6)),
                R: newR.map(row => row[0].toFixed(6)),
                error: newError.toFixed(5) // Format as percentage
            });
    
            X = newX;
            R = newR;
            D = newD;
            error = newError;
            iter++;
        }
    
        setSolution(X.map(val => val[0])); // Update solution state
        setSteps(stepsData); // Store all steps for visualization
    };
    
    
    
    
    const printSolution = () => {
        if (steps.length === 0) return null;

        return (
            <Table className='rounded-table'>
                <thead>
                    <tr style={{textAlign:"center"}}>
                        <th>Iteration (k)</th>
                        <th>λ<sub>k-1</sub></th>
                        <th>D<sub>k-1</sub></th>
                        <th>X<sub>k</sub></th>
                        <th>R<sub>k</sub></th>
                        <th>%Error</th>
                    </tr>
                </thead>
                <tbody style={{textAlign:"center"}}>
                    {steps.map((step, index) => (
                        <tr key={index}>
                            <td>{step.iteration}</td>
                            <td>{step.lambda}</td>
                            <td>
                                {step.D.map((val, i) => (
                                    <div key={i}>D<sub>{i + 1}</sub> = {val}</div>
                                ))}
                            </td>
                            <td>
                                {step.X.map((val, i) => (
                                    <div key={i}>x<sub>{i + 1}</sub> = {val}</div>
                                ))}
                            </td>
                            <td>
                                {step.R.map((val, i) => (
                                    <div key={i}>R<sub>{i + 1}</sub> = {val}</div>
                                ))}
                            </td>
                            <td>{step.error}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
    };
    

    const printAnswer = () => {
        if (solution.length === 0) return null;

        return (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                {solution.map((sol, index) => (
                    <div key={index}>
                        x<sub>{index + 1}</sub> = {sol.toFixed(6)}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <NavigationBar />
            <div className="outer-container">
                <h1 className='title'>Conjugate Gradient Methods</h1>
                <Row>
                    <Col md={3} className='left-column'>
                        <div className="form-container">
                            <Form>
                                <Form.Group className="mb-3" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <Form.Label>Matrix Dimension</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        value={Dimension} 
                                        onChange={getDimension} 
                                        style={{ width: '50%' }} 
                                        placeholder="3" 
                                    />
                                </Form.Group>

                                <Button variant="dark" onClick={handleShow} className="centered-button" style={{width:"125px"}}>
                                    Set Matrix
                                </Button>
                                <Button variant="dark" onClick={solveAnswer} className="centered-button" >
                                    Solve
                                </Button>
                                 <h5 style={{ textAlign: 'center', marginTop: '20px' }}>{printAnswer()}</h5>
                                <Modal show={show} onHide={handleClose} centered  size="lg">
                                    <Modal.Header closeButton>
                                        <Modal.Title>Matrix Input</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <div>{inputTable()}</div>
                                        <br />
                                        <br />
                                        <p style={{textAlign:"center"}}>Please enter initial X</p>

                                        <div>{initialXTable()}</div>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="dark" onClick={getEquationApi} className="centered-button-2" style={{ width: '15%' }}>
                                            Get Matrix
                                        </Button>
                                        <Button variant="danger" onClick={clearMatrixInputs}>
                                            Clear
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            </Form>
                        </div>
                    </Col>
                    <Col md={9} className='right-column'>
                        <Accordion defaultActiveKey="0">
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Solution</Accordion.Header>
                                <Accordion.Body>
                                    {printSolution()}
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default ConjugateGradient;
