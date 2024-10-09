import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import { Button, Form, Table } from "react-bootstrap";
import NavigationBar from '../MyNavbar';
import '../../App.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import Modal from 'react-bootstrap/Modal';

const GaussSeidel = () => {
    const [Dimension, setDimension] = useState(3);
    const [MatrixA, setMatrixA] = useState([]); 
    const [MatrixB, setMatrixB] = useState([]);
    const [initialX, setInitialX] = useState([]);
    const [solution, setSolution] = useState([]);
    const [steps, setSteps] = useState([]); // To store the steps for visualization
    const [errors, setErrors] = useState([]);
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
            const response = await fetch(`http://localhost:5000/linearAlgebraData/filter?data_id=3&dimension=${Dimension}`);
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

    const solveAnswer = () => {
        const tolerance = 0.00001;
        let currentX = [...initialX];
        const newSteps = [];
        const maxIterations = 100; 
    
        for (let k = 0; k < maxIterations; k++) {
            let nextX = [...currentX];
            let maxError = 0;
    
            for (let i = 0; i < Dimension; i++) {
                let sum = 0;
                for (let j = 0; j < Dimension; j++) {
                    if (j !== i) {
                        sum += MatrixA[i][j] * (nextX[j] !== undefined ? nextX[j] : currentX[j]); // Use nextX if already computed, else currentX
                    }
                }
                nextX[i] = (MatrixB[i] - sum) / MatrixA[i][i];
                maxError = Math.max(maxError, Math.abs(nextX[i] - currentX[i]));
            }
    
            // Store current iteration's results
            const errors = nextX.map((value, index) => 
                Math.abs(value - currentX[index]) < tolerance 
                ? '0' 
                : (Math.abs(value - currentX[index]) / Math.abs(value) * 100).toFixed(6)
            );
            newSteps.push({
                iteration: k + 1,
                values: nextX.map(v => v.toFixed(6)),
                errors: errors
            });
    
            if (maxError < tolerance) {
                break; // Stop if the solution converges
            }
    
            currentX = [...nextX]; // Update for the next iteration
        }
    
        setSolution(currentX); // Final solution
        setSteps(newSteps); // Store all steps
    };
    
    
    
    const printSolution = () => {
        if (steps.length === 0) return null;
    
        return (
            <Table className='rounded-table'>
                <thead>
                    <tr style={{textAlign:"center"}}>
                        <th>Iteration</th>
                        {Array.from({ length: Dimension }, (_, i) => <th key={i}>x<sub>{i + 1}</sub></th>)}
                        {Array.from({ length: Dimension }, (_, i) => <th key={i}>%Error<sub>{i + 1}</sub></th>)}
                    </tr>
                </thead>
                <tbody style={{textAlign:"center"}}>
                    {steps.map((step) => (
                        <tr key={step.iteration}>
                            <td>{step.iteration}</td>
                            {step.values.map((value, index) => (
                                <td key={index}>{value}</td>
                            ))}
                            {step.errors.map((error, index) => (
                                <td key={index}>{error}</td>
                            ))}
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
                <h1 className='title'>Gauss-Seidel Iteration</h1>
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

export default GaussSeidel;
