import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import { Button, Form, Table } from "react-bootstrap";
import NavigationBar from '../MyNavbar';
import '../../App.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import Modal from 'react-bootstrap/Modal';

const GaussElimination = () => {
    const [Dimension, setDimension] = useState(3);
    const [MatrixA, setMatrixA] = useState([]); 
    const [MatrixB, setMatrixB] = useState([]);
    const [solution, setSolution] = useState([]);
    const [steps, setSteps] = useState([]); // To store the steps for visualization
    const [show, setShow] = useState(false);
    const [formulas, setFormulas] = useState([]); 
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const dim = Number(Dimension);
        if (dim > 0) {
            setMatrixA(Array(dim).fill().map(() => Array(dim).fill(0)));
            setMatrixB(Array(dim).fill(0));
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

    const clearMatrixInputs = () => {
        const emptyMatrixA = MatrixA.map(row => row.map(() => ''));
        const emptyMatrixB = MatrixB.map(() => ''); 

        setMatrixA(emptyMatrixA);
        setMatrixB(emptyMatrixB);
    };

    const getEquationApi = async () => {
        try {
            const response = await fetch(`http://localhost:5000/linearAlgebraData/filter?data_id=1&dimension=${Dimension}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const equationData = await response.json();  
            //console.log(equationData);
            if (equationData) {
                setMatrixA(equationData.matrix_a);
                setMatrixB(equationData.matrix_b[0]);
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

    const solveAnswer = () => {
        setFormulas([]); 
        const matrixA = MatrixA.map(row => row.slice());
        const matrixB = MatrixB.slice();
        const stepsList = [];
    
        const addStep = (description, matrix, vector) => {
            stepsList.push({ description, matrix: matrix.map(row => row.slice()), vector: vector.slice() });
        };
    
        const n = Dimension;
    
        // Gauss Elimination
        for (let k = 0; k < n; k++) {
            if (matrixA[k][k] === 0) {
                for (let i = k + 1; i < n; i++) {
                    if (matrixA[i][k] !== 0) {
                        // Swap rows
                        [matrixA[k], matrixA[i]] = [matrixA[i], matrixA[k]];
                        [matrixB[k], matrixB[i]] = [matrixB[i], matrixB[k]];
                        addStep(`Swapped row ${k + 1} with row ${i + 1}`, matrixA, matrixB);
                        break;
                    }
                }
            }
    
            for (let i = k + 1; i < n; i++) {
                const factor = matrixA[i][k] / matrixA[k][k];
                for (let j = k; j < n; j++) {
                    matrixA[i][j] -= factor * matrixA[k][j];
                }
                matrixB[i] -= factor * matrixB[k];
                addStep(`Eliminated X${k + 1} from row ${i + 1}`, matrixA, matrixB);
            }
        }
        
        // Back-substitution
        const x = Array(n).fill(0);
        for (let i = n - 1; i >= 0; i--) {
            let formula = `X<sub>${i + 1}</sub> = ${matrixB[i]}`;
            let sum = 0; 
        
            // Calculate the sum of known x values
            for (let j = i + 1; j < n; j++) {
                sum += matrixA[i][j] * x[j];
                formula += ` - ${matrixA[i][j]}X<sub>${j + 1}</sub>`;
            }
        
            // Calculate x[i]
            x[i] = (matrixB[i] - sum) / matrixA[i][i];
            formula += ` / ${matrixA[i][i]} = ${x[i]}`;
            formulas.push(formula);
        }
    
        setSolution(x);
        setSteps(stepsList);
        setFormulas(formulas); // save the formulas state
    };
    
    

    const printSolution = () => {
        if (steps.length === 0) return <div>No solution available</div>;
    
        return (
            <div>
                <h5 style={{ textAlign: 'center' }}>Forward Substitution</h5>
                {steps.map((step, index) => (
                    <div key={index}>
                        <h5 style={{ textAlign: "center" }}>Step {index + 1}: {step.description}</h5>
                        <Table className="rounded-table">
                            <thead>
                                <tr>
                                    <th></th>
                                    {[...Array(Dimension)].map((_, idx) => (
                                        <th key={idx}>X<sub>{idx + 1}</sub></th>
                                    ))}
                                    <th>B</th>
                                </tr>
                            </thead>
                            <tbody style={{ textAlign: "center" }}>
                                {step.matrix.map((row, i) => (
                                    <tr key={i}>
                                        <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                        {row.map((value, j) => (
                                            <td key={j}>{value}</td>
                                        ))}
                                        <td>{step.vector[i]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                ))}
                <h5 style={{ textAlign: 'center', marginTop: "40px" }}>Backward Substitution</h5>
                <div style={{ textAlign: 'center' }}>
                    {formulas.map((formula, index) => (
                        <div key={index} dangerouslySetInnerHTML={{ __html: formula }} />
                    ))}
                </div>
            </div>
        );
    };
    

    const printAnswer = () => {
        if (solution.length === 0) return null;

        return (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                {solution.map((sol, index) => (
                    <div key={index}>
                        x<sub>{index + 1}</sub> = {sol}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <NavigationBar />
            <div className="outer-container">
                <h1 className='title'>Gauss Elimination</h1>
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

export default GaussElimination;
