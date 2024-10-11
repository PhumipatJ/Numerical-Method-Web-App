import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import { Button, Form, Table } from "react-bootstrap";
import NavigationBar from '../MyNavbar';
import '../../App.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import Modal from 'react-bootstrap/Modal';


const LU = () => {
    const [Dimension, setDimension] = useState(3);
    const [MatrixA, setMatrixA] = useState([]); 
    const [MatrixB, setMatrixB] = useState([]);
    const [MatrixL, setMatrixL] = useState([]);
    const [MatrixU, setMatrixU] = useState([]);
    const [steps, setSteps] = useState([]);
    const [solutionSteps, setSolutionSteps] = useState([]);

    const [show, setShow] = useState(false);
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

    const solveLU = () => {
        const matrixA = MatrixA.map(row => row.slice());
        const matrixB = MatrixB.slice();
        const n = Dimension;

        // Initialize L and U matrices
        const L = Array(n).fill().map(() => Array(n).fill(0));
        const U = Array(n).fill().map(() => Array(n).fill(0));
        const stepsList = [];

        //LU Decomposition
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (i <= j) {
                    U[i][j] = matrixA[i][j];
                    for (let k = 0; k < i; k++) {
                        U[i][j] -= L[i][k] * U[k][j];
                    }
                }
                if (i === j) {
                    L[i][i] = 1;
                } else if (i < j) {
                    L[j][i] = matrixA[j][i];
                    for (let k = 0; k < i; k++) {
                        L[j][i] -= L[j][k] * U[k][i];
                    }
                    L[j][i] /= U[i][i];
                }
            }
            stepsList.push({
                description: `Step ${i + 1}`,
                matrix: { L: L.map(row => row.slice()), U: U.map(row => row.slice()) }
            });
        }

        // Solve for Y in LY = B
        const Y = Array(n).fill(0);
        const YSteps = [];

        for (let i = 0; i < n; i++) {
            Y[i] = matrixB[i];
            for (let j = 0; j < i; j++) {
                Y[i] -= L[i][j] * Y[j];
            }
            YSteps.push({
                description: `Solving for Y${i + 1}`,
                step: `Y${i + 1} = ${Y[i]}`
            });
        }

        // Solve for X in UX = Y
        const X = Array(n).fill(0);
        const XSteps = [];

        for (let i = n - 1; i >= 0; i--) {
            X[i] = Y[i];
            for (let j = i + 1; j < n; j++) {
                X[i] -= U[i][j] * X[j];
            }
            XSteps.push({
                description: `Solving for X${i + 1}`,
                step: `X${i + 1} = ${X[i]}`
            });
        }

        setMatrixL(L);
        setMatrixU(U);
        setSteps(stepsList);
        setSolutionSteps([...YSteps, ...XSteps]);
    };
    
    const printSolution = () => {
        if (steps.length === 0) return <div>No solution available</div>;
    
        const borderStyle = { borderRight: '1px solid #b0bdf0', backgroundColor: '#dbeafe', fontWeight: "600", textAlign: "center" };
    
        return (
            <div>
                <h5 style={{ textAlign: 'center' }}>From Ax = B</h5>
                <h5 style={{ textAlign: 'center' }}>Decompose A to LU</h5>
                
                <Row>
                    <Col>
                        <h5 style={{ textAlign: 'center', marginTop: "40px" }}>Matrix A</h5>
                        <Table className="rounded-table">
                            <thead>
                                <tr>
                                    <th style={borderStyle}></th>
                                    {[...Array(Dimension)].map((_, index) => (
                                        <th key={index}>c{index + 1}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Array(Dimension).fill().map((_, i) => (
                                    <tr key={i}>
                                        <td style={borderStyle}>{`r${i + 1}`}</td>
                                        {Array(Dimension).fill().map((_, j) => (
                                            <td key={j} style={{ textAlign: 'center' }}>{`A${i + 1}${j + 1}`}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                    <Col>
                        <h5 style={{ textAlign: 'center', marginTop: "40px" }}>Matrix L</h5>
                        <Table className="rounded-table">
                            <thead>
                                <tr>
                                    <th style={borderStyle}></th>
                                    {[...Array(Dimension)].map((_, index) => (
                                        <th key={index}>c{index + 1}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Array(Dimension).fill().map((_, i) => (
                                    <tr key={i}>
                                        <td style={borderStyle}>{`r${i + 1}`}</td>
                                        {Array(Dimension).fill().map((_, j) => (
                                            <td key={j} style={{ textAlign: 'center' }}>
                                                {i === j ? '1' : i > j ? `L${i + 1}${j + 1}` : '0'}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                    <Col>
                        <h5 style={{ textAlign: 'center', marginTop: "40px" }}>Matrix U</h5>
                        <Table className="rounded-table">
                            <thead>
                                <tr>
                                    <th style={borderStyle}></th>
                                    {[...Array(Dimension)].map((_, index) => (
                                        <th key={index}>c{index + 1}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Array(Dimension).fill().map((_, i) => (
                                    <tr key={i}>
                                        <td style={borderStyle}>{`r${i + 1}`}</td>
                                        {Array(Dimension).fill().map((_, j) => (
                                            <td key={j} style={{ textAlign: 'center' }}>
                                                {i === j ? `U${i + 1}${j + 1}` : i < j ? `U${i + 1}${j + 1}` : '0'}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
    
                <Row style={{ marginTop: "40px" }}>
                    <Col>
                        <h5 style={{ textAlign: 'center' }}>Matrix L (Values)</h5>
                        <Table className="rounded-table">
                            <thead>
                                <tr>
                                    <th style={borderStyle}></th>
                                    {[...Array(Dimension)].map((_, index) => (
                                        <th key={index}>c{index + 1}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Array(Dimension).fill().map((_, i) => (
                                    <tr key={i}>
                                        <td style={borderStyle}>{`r${i + 1}`}</td>
                                        {MatrixL[i].map((val, j) => (
                                            <td key={j} style={{ textAlign: 'center' }}>{val}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                    <Col>
                        <h5 style={{ textAlign: 'center' }}>Matrix U (Values)</h5>
                        <Table className="rounded-table">
                            <thead>
                                <tr>
                                    <th style={borderStyle}></th>
                                    {[...Array(Dimension)].map((_, index) => (
                                        <th key={index}>c{index + 1}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Array(Dimension).fill().map((_, i) => (
                                    <tr key={i}>
                                        <td style={borderStyle}>{`r${i + 1}`}</td>
                                        {MatrixU[i].map((val, j) => (
                                            <td key={j} style={{ textAlign: 'center' }}>{val}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                
                <h5 style={{ textAlign: 'center' }}>From LUx = B, let Ux = Y</h5>
                <h5 style={{ textAlign: 'center' }}>Find Y from LY = B</h5>
                <Table className="rounded-table">
                    <thead>
                        <tr>
                            <th style={borderStyle}>Y<sub>i</sub></th>
                            <th style={borderStyle}>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array(Dimension).fill().map((_, i) => (
                            <tr key={i}>
                                <td style={borderStyle}>{`Y${i + 1}`}</td>
                                <td style={{ textAlign: 'center' }}>{solutionSteps.find(step => step.description === `Solving for Y${i + 1}`)?.step || '0'}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <h5 style={{ textAlign: 'center' }}>Find X from Ux = Y</h5>
                <h5 style={{ textAlign: 'center', marginTop: '20px' }}>{printAnswer()}</h5>
            </div>
        );
    };

    const printAnswer = () => {
        const matrixB = MatrixB.slice();
        const n = Dimension;
    
        if (steps.length === 0) return <div>No solution available</div>;
    
        const L = MatrixL;
        const U = MatrixU;
        
        // Solve for Y in LY = B
        const Y = Array(n).fill(0);
        for (let i = 0; i < n; i++) {
            Y[i] = matrixB[i];
            for (let j = 0; j < i; j++) {
                Y[i] -= L[i][j] * Y[j];
            }
        }
    
        // Solve for X in UX = Y
        const X = Array(n).fill(0);
        for (let i = n - 1; i >= 0; i--) {
            X[i] = Y[i];
            for (let j = i + 1; j < n; j++) {
                X[i] -= U[i][j] * X[j];
            }
            X[i] /= U[i][i];
        }
    
        return (
            <div>
                {X.map((value, index) => (
                    <div key={index}>
                        x<sub>{index + 1}</sub> = {value}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <NavigationBar />
            <div className="outer-container">
                <h1 className='title'>LU Decomposition</h1>
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
                                <Button variant="dark" onClick={solveLU} className="centered-button" >
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

export default LU;