import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import { Button, Form, Table } from "react-bootstrap";
import NavigationBar from '../MyNavbar';
import '../../App.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import Modal from 'react-bootstrap/Modal';

const MatrixInversion = () => {
    const [Dimension, setDimension] = useState(3);
    const [MatrixA, setMatrixA] = useState([]); 
    const [MatrixB, setMatrixB] = useState([]);
    const [inverseMatrix, setInverseMatrix] = useState([]);
    const [steps, setSteps] = useState([]);
    const [solutionSteps, setSolutionSteps] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [formulas, setFormulas] = useState([]);

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
            const response = await fetch(`https://pj-numer-api.onrender.com/linearAlgebraData/filter?data_id=1&dimension=${Dimension}`);
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

        if (!MatrixA.length || !MatrixB.length) return null;

        return (
            <Table className="rounded-table">
                <thead>
                    <tr>
                        <th></th>
                        {[...Array(Dimension)].map((_, index) => (
                            <th key={index}> x<sub>{index + 1}</sub> </th>
                        ))}
                        <th style={borderStyle}>B</th>
                    </tr>
                </thead>
                <tbody>
                    {[...Array(Dimension)].map((_, i) => (
                        <tr key={i}>
                            <td style={{ textAlign: 'center', width: "100px" }}>Equation {i + 1}</td>
                            {[...Array(Dimension)].map((_, j) => (
                                <td key={j}>
                                    <Form.Control
                                        type="number"
                                        placeholder="0" className="custom-placeholder"
                                        value={MatrixA[i]?.[j] || ''}
                                        onChange={(event) => handleMatrixAChange(i, j, event.target.value)}
                                    />
                                </td>
                            ))}
                            <td style={borderStyle}>
                                <Form.Control
                                    type="number"
                                    placeholder="0" className="custom-placeholder"
                                    value={MatrixB[i] || ''}
                                    onChange={(event) => handleMatrixBChange(i, event.target.value)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
    };

    const solveInverse = () => {
        const matrixA = MatrixA.map(row => row.slice());
        const matrixB = MatrixB.slice();
        const n = Dimension;

        // Initialize the augmented matrix [A | I]
        const augmentedMatrix = matrixA.map((row, i) => [...row, ...Array(n).fill(0)]);
        for (let i = 0; i < n; i++) augmentedMatrix[i][n + i] = 1;

        const stepsList = [];
    
        const addStep = (description, matrix) => {
            stepsList.push({ description, matrix: matrix.map(row => row.slice()) });
        };

        // Apply Gauss-Jordan Elimination
        for (let k = 0; k < n; k++) {
            // Partial Pivoting
            if (augmentedMatrix[k][k] === 0) {
                for (let i = k + 1; i < n; i++) {
                    if (augmentedMatrix[i][k] !== 0) {
                        // Swap rows
                        [augmentedMatrix[k], augmentedMatrix[i]] = [augmentedMatrix[i], augmentedMatrix[k]];
                        addStep(`Swapped row ${k + 1} with row ${i + 1}`, augmentedMatrix);
                        break;
                    }
                }
            }

            // Normalize the pivot row
            const pivot = augmentedMatrix[k][k];
            for (let j = 0; j < 2 * n; j++) {
                augmentedMatrix[k][j] /= pivot;
            }
            addStep(`Normalized row ${k + 1}`, augmentedMatrix);

            // Eliminate the current column from other rows
            for (let i = 0; i < n; i++) {
                if (i !== k) {
                    const factor = augmentedMatrix[i][k];
                    for (let j = 0; j < 2 * n; j++) {
                        augmentedMatrix[i][j] -= factor * augmentedMatrix[k][j];
                    }
                    addStep(`Eliminated column ${k + 1} from row ${i + 1}`, augmentedMatrix);
                }
            }
        }

        // Extract the inverse matrix
        const inverse = augmentedMatrix.map(row => row.slice(n));
        const formulas = inverse.map((row, i) => `Row ${i + 1}: ${row.map(val => val).join(' | ')}`);

        // Multiply the inverse matrix with matrix B
        const resultX = Array(n).fill(0);
        const solutionStepsList = [];

        for (let i = 0; i < n; i++) {
            let sum = 0;
            for (let j = 0; j < n; j++) {
                sum += inverse[i][j] * matrixB[j];
            }
            resultX[i] = sum;
            solutionStepsList.push({
                description: `Row ${i + 1} multiplication`,
                step: `X${i + 1} = ${inverse[i].map((val, idx) => `${val} * ${matrixB[idx]}`).join(' + ')} = ${sum}`
            });
        }

        setInverseMatrix(inverse);
        setSteps(stepsList);
        setSolutionSteps(solutionStepsList);
        setFormulas(formulas);
    };

    const printSolution = () => {
        if (steps.length === 0) return <div>No solution available</div>;

        return (
            <div>

                {steps.map((step, index) => (
                    <div key={index}>
                        <h5 style={{ textAlign: "center" }}>Step {index + 1}: {step.description}</h5>
                        <Table className="rounded-table">
                            <thead>
                                <tr>
                                    <th></th>
                                    {[...Array(Dimension * 2)].map((_, idx) => (
                                        <th key={idx}>X<sub>{idx + 1}</sub></th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody style={{ textAlign: "center" }}>
                                {step.matrix.map((row, i) => (
                                    <tr key={i}>
                                        <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                        {row.map((value, j) => (
                                            <td key={j}>{value}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                ))}


                
            <Row>
                <Col>
                    <h5 style={{ textAlign: 'center', marginTop: "40px" }}>Matrix A Inverse</h5>
                    <Table className="rounded-table">
                        <thead>
                            <tr>
                                {[...Array(Dimension)].map((_, index) => (
                                    <th key={index}>x<sub>{index + 1}</sub></th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {inverseMatrix.map((row, i) => (
                                <tr key={i}>
                                    {row.map((val, j) => (
                                        <td key={j} style={{ textAlign: 'center' }}>{val}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>

                <Col>
                    <h5 style={{ textAlign: 'center', marginTop: "40px" }}>Matrix B</h5>
                    <Table className="rounded-table">
                        <thead>
                            <tr>
                                <th>B</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MatrixB.map((val, i) => (
                                <tr key={i}>
                                    <td style={{ textAlign: 'center' }}>{val}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>  
            </Row>
            
            <h5 style={{ textAlign: 'center', marginTop: "40px" }}>From X = A<sup>-1</sup>B</h5>
            <div style={{ textAlign: 'center' }}>
                {solutionSteps.map((step, index) => (
                    <div key={index}>
                        <div>{step.step}</div>
                    </div>
                ))}
            </div>
            
            </div>
        );
    };

    const printAnswer = () => {
        if (inverseMatrix.length === 0 || MatrixB.length === 0) {
            return "";
        }
    

        const result = [];
        const n = Dimension;
        const resultX = Array(n).fill(0);
    
        for (let i = 0; i < n; i++) {
            let sum = 0;
            for (let j = 0; j < n; j++) {
                sum += inverseMatrix[i][j] * MatrixB[j];
            }
            resultX[i] = sum;
            result.push(<div key={i}>x{<sub>{i + 1}</sub>} = {resultX[i]}</div>);
        }
    
        return (
            <div style={{ textAlign: 'center' }}>
                {result}
            </div>
        );
    };
    
    
    



    return (
        <>
            <NavigationBar />
            <div className="outer-container">
                <h1 className='title'>Matrix Inversion</h1>
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
                                <Button variant="dark" onClick={solveInverse} className="centered-button" >
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

export default MatrixInversion;
