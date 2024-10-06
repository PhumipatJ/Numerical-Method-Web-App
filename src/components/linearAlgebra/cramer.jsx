import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import { Button, Form, Table } from "react-bootstrap";
import NavigationBar from '../MyNavbar';
import '../../App.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import Modal from 'react-bootstrap/Modal';
import { det } from 'mathjs';

const CramerRule = () => {
    const [Dimension, setDimension] = useState(3);
    const [MatrixA, setMatrixA] = useState([]); 
    const [MatrixB, setMatrixB] = useState([]);
    const [solution, setSolution] = useState([]);
    const [determinants, setDeterminants] = useState([]);
    const [detA, setDetA] = useState(null)

    // Initial 0
    useEffect(() => {
        const dim = Number(Dimension);
        if (dim > 0) {
            setMatrixA(Array(dim).fill().map(() => Array(dim).fill(0)));
            setMatrixB(Array(dim).fill(0));
        }
    }, [Dimension]);
    
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const getDimension = (event) => {
        const value = Number(event.target.value);
        if (value > 0){
            setDimension(value);
        }
        else{
            alert("no 0");
        }
    };

    const handleMatrixAChange = (i, j, value) => {
        const updatedMatrixA = [...MatrixA];
        updatedMatrixA[i][j] = parseFloat(value) || "0";
        setMatrixA(updatedMatrixA);
        console.log("MatrixA updated:", updatedMatrixA);
    };
    
    const handleMatrixBChange = (i, value) => {
        const updatedMatrixB = [...MatrixB];
        updatedMatrixB[i] = parseFloat(value) || "0";
        setMatrixB(updatedMatrixB);
        console.log("MatrixB updated:", updatedMatrixB);
    };
    
    const clearMatrixInputs = () => {
        const emptyMatrixA = MatrixA.map(row => row.map(() => ''));
        const emptyMatrixB = MatrixB.map(() => '');
    
        setMatrixA(emptyMatrixA);
        setMatrixB(emptyMatrixB);
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
        const matrixA = MatrixA.map(row => row.slice());
        const matrixB = MatrixB.slice();

        const detA = det(matrixA); // Determinant of MatrixA
        setDetA(detA);

        if (detA === 0) {
            setSolution(['No unique solution']); // System might be singular or inconsistent
            setDeterminants([]);
            return;
        }

        const solutions = [];
        const dets = [];
        for (let i = 0; i < Dimension; i++) {
            const matrixAi = matrixA.map((row, index) => {
                return row.map((value, colIndex) => (colIndex === i ? matrixB[index] : value));
            });
            const detAi = det(matrixAi);
            dets.push(detAi);
            solutions.push(detAi / detA);
        }

        setDeterminants(dets);
        setSolution(solutions);
        //console.log(dets);
        //console.log(solutions);
    };

    const printAnswer = () => {
        if (solution.length === 0) return <div>No solution available</div>;

        return (
            <div>
                {solution.map((sol, index) => (
                    <div key={index}> x<sub>{index + 1}</sub> = {sol} </div>
                ))}
            </div>
        );
    };

    const printSolution = () => {
        if (detA === null || determinants.length === 0) return <div>No solution available</div>;
        
        return (
            <div>
                <h5 style={{ textAlign: "center" }}>Matrix A</h5>
                <Table className="rounded-table">
                    <thead>
                        <tr>
                            <th></th>
                            {[...Array(Dimension)].map((_, index) => (
                                <th key={index}>x<sub>{index + 1}</sub></th>
                            ))}
                        </tr>
                    </thead>
                    <tbody style={{ textAlign: "center" }}>
                        {[...Array(Dimension)].map((_, i) => (
                            <tr key={i}>
                                <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                {[...Array(Dimension)].map((_, j) => (
                                    <td key={j}>{MatrixA[i][j]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <p style={{ fontSize: "18px", textAlign: "center" }}>det(A) = {detA}</p>
                <br />
                <br />
    
                {determinants.map((detAi, index) => (
                    <div key={index}>
                        <h5 style={{ textAlign: "center" }}>Matrix A<sub>{index + 1}</sub></h5>
                        <Table className="rounded-table">
                            <thead>
                                <tr>
                                    <th></th>
                                    {[...Array(Dimension)].map((_, idx) => (
                                        <th key={idx}>x<sub>{idx + 1}</sub></th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody style={{ textAlign: "center" }}>
                                {[...Array(Dimension)].map((_, i) => (
                                    <tr key={i}>
                                        <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                        {[...Array(Dimension)].map((_, j) => (
                                            <td key={j} style={{ backgroundColor: j === index ? '#f0f8ff' : 'inherit' }}>
                                                {/* Replace column 'index' with MatrixB for the respective matrix */}
                                                {j === index ? MatrixB[i] : MatrixA[i][j]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <p style={{ fontSize: "18px", textAlign: "center" }}>
                            det(A<sub>{index + 1}</sub>) = {detAi}
                        </p>
                        <br />
                        <br />
                    </div>
                ))}
    
                <div style={{ fontSize: "18px"}}>
                    {solution.map((sol, index) => (
                        <div key={index} style={{ textAlign: 'center', marginBottom: '10px' }}>
                            <span>
                                x<sub>{index + 1}</sub> = 
                            </span>
                            <div style={{ display: 'inline-block', verticalAlign: 'middle',marginLeft: '5px' }}>
                                <div style={{ borderBottom: '1px solid black', paddingBottom: '2px' }}>
                                    det(A<sub>{index + 1}</sub>)
                                </div>
                                <div style={{ paddingTop: '2px' }}>
                                    det(A)
                                </div>
                            </div>
                            <span> = </span>

                            <div style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                                <div style={{ borderBottom: '1px solid black', paddingBottom: '2px' }}>
                                    {determinants[index]}
                                </div>
                                <div style={{ paddingTop: '2px' }}>
                                    {detA}
                                </div>
                            </div>
                            <span> = {sol}</span>
                        </div>
                    ))}
                </div>

            </div>
        );
    };
    

    return (
        <>
            <NavigationBar />
            <div className="outer-container">
                <h1 className='title'>Cramer's Rule</h1>
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

                                <Modal show={show} onHide={handleClose} centered  size="lg">
                                    <Modal.Header closeButton>
                                        <Modal.Title>Matrix Input</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <div>{inputTable()}</div>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="danger" onClick={clearMatrixInputs}>
                                            Clear
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                                <Button variant="dark" onClick={solveAnswer} className="centered-button" >
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

export default CramerRule;
