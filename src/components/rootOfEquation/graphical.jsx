import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { evaluate } from 'mathjs';
import NavigationBar from '../MyNavbar';
import '../../App.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import '../../css all/IterationTable.css'

const GraphicalMethods = () => {
    const [data, setData] = useState([]);
    const [Equation, setEquation] = useState("43x-180");
    const [Root, setRoot] = useState(null);
    const [XL, setXL] = useState(0);
    const [XR, setXR] = useState(0);
    
    const equation = (x) => {
        return evaluate(Equation, { x });
    };

    const start = (xlnum, xrnum) => {
        let left = 0, right = 0;
        for (let i = xlnum; i < xrnum; i++) {
            left = equation(i);
            right = equation(i + 1);
            if (left * right < 0) {
                return i;
            }
        }
        return -1;
    };

    const calGraphical = (xlnum, xrnum) => {
        let iter = 0;
        const st = start(xlnum, xrnum);
        if (st === -1) {
            alert("No root found in the interval.");
            return;
        }

        let newData = [];
        let root = null;
        for (let i = st; i < st + 1; i += 0.00001) {
            let result = equation(i);
            iter++;
            newData.push({Iteration:iter, x: i, y: result });
            if (result > -0.001 && result < 0.001) {
                root = i;
                break;
            }
        }
        setData(newData);
        setRoot(root);
        
    };

    const inputEquation = (event) => {
        setEquation(event.target.value);
    };

    const inputXL = (event) => {
        setXL(event.target.value);
    };

    const inputXR = (event) => {
        setXR(event.target.value);
    };

    const calculateRoot = () => {
        const xlnum = parseFloat(XL);
        const xrnum = parseFloat(XR);
        calGraphical(xlnum, xrnum);
        console.log(data);
        console.log(Root);
    };
    
    const print = () => {

        const first10Data = data.slice(0, 10);
        const last10Data = data.slice(-10);
    
        return (
            <div style={{ marginTop: '20px' }}>
            <Table className="rounded-table">
                <thead>
                    <tr>
                        <th>Iteration</th>
                        <th>x</th>
                        <th>f(x)</th>
                    </tr>
                </thead>
                <tbody>
                    {first10Data.map((item, index) => (
                        <tr key={index}>
                            <td style={{ textAlign: 'center' }}>{item.Iteration}</td>
                            <td style={{ textAlign: 'center' }}>{item.x.toPrecision(6)}</td>
                            <td style={{ textAlign: 'center' }}>{item.y.toPrecision(6)}</td>
                        </tr>
                    ))}
    
                    <tr>
                        <td colSpan="3" style={{ textAlign: 'center' }}>
                            . . . 
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="3" style={{ textAlign: 'center' }}>
                            . . .
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="3" style={{ textAlign: 'center' }}>
                            . . .
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="3" style={{ textAlign: 'center' }}>
                            . . .
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="3" style={{ textAlign: 'center' }}>
                            . . .
                        </td>
                    </tr>
    
                    {last10Data.map((item, index) => (
                        <tr key={index}>
                            <td style={{ textAlign: 'center' }}>{item.Iteration}</td>
                            <td style={{ textAlign: 'center' }}>{item.x.toPrecision(6)}</td>
                            <td style={{ textAlign: 'center' }}>{item.y.toPrecision(6)}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            </div>
        );
    };
    


    return (
        <>
            <NavigationBar />
            <div className="outer-container">
                <h1 className='title'>Graphical Methods</h1>
                <Row>
                    <Col md={3} className='left-column'>
                        <div className="form-container">
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Input Equation f(x)</Form.Label>
                                    <Form.Control type="text" id="equation" value={Equation} onChange={inputEquation} style={{ width: '80%' }} placeholder="43x-180" className="custom-placeholder"/>
                                    <Form.Text className="text-muted">
                                        Ensure proper arithmetic syntax.
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Input Xʟ</Form.Label>
                                    <Form.Control type="number" id="XL" onChange={inputXL} style={{ width: '50%' }} placeholder="1" className="custom-placeholder"/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Input Xʀ</Form.Label>
                                    <Form.Control type="number" id="XR" onChange={inputXR} style={{ width: '50%' }} placeholder="5" className="custom-placeholder"/>
                                </Form.Group>
                                <Button variant="dark" onClick={calculateRoot} className="centered-button">
                                    Solve
                                </Button>
                                <h5 style={{ textAlign: 'center', marginTop: '20px' }}>Answer : {Root}</h5>
                                
                            </Form>
                        </div>
                    </Col>
                    <Col md={9} className='right-column'>
                        <Accordion defaultActiveKey="0" className='according-container'>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Iteration Table</Accordion.Header>
                                <Accordion.Body>
                                    <div>{print()} </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default GraphicalMethods;
