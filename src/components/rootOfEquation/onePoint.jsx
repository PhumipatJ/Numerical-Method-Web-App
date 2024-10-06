import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { evaluate } from 'mathjs';
import NavigationBar from '../MyNavbar';
import '../../App.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import ErrorGraph from './ErrorGraph';
import '../../css all/IterationTable.css'


const OnePointMethods = () => {
    const [data, setData] = useState([]);
    const [Equation, setEquation] = useState("((x^2)+7) / 2x");
    const [X, setX] = useState(0);
    const [Xini, setXini] = useState(0);
    let newData = [];

    const error = (xold, xnew) => Math.abs((xnew - xold) / xnew) * 100;

    const equation = (x) => {
        return evaluate(Equation, { x });
    };

    let iter = 0;
    const CalOnePoint = (x1) => {
        let err;
        let x2 = equation(x1);
        if(Math.abs(x2-x1) < 0.00001){
            setData(newData);
            setX(x2);
            return;
        }
        else{
            iter++;
            err = error(x1, x2);
            newData.push({iteration:iter, newX: x2, Error: err });
            return CalOnePoint(x2);
        }

    };

    const inputEquation = (event) => {
        setEquation(event.target.value);
    };

    const inputInitial = (event) => {
        setXini(event.target.value);
    };

    const calculateRoot = () => {
        const xini = parseFloat(Xini);
        CalOnePoint(xini);
    };

    const print = () => {
        return (
            <div style={{ marginTop: '20px' }}>
                <Table className="rounded-table">
                    <thead>
                        <tr>
                            <th>Iteration</th>
                            <th>x</th>
                            <th>Error (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: 'center' }}>{item.iteration}</td>
                                <td style={{ textAlign: 'center' }}>{item.newX.toPrecision(7)}</td>
                                <td style={{ textAlign: 'center' }}>{item.Error.toPrecision(7)}</td>
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
                <h1 className='title'>One-point Iteration Methods</h1>
                <Row>
                    <Col md={3} className='left-column'>
                        <div className="form-container">
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Input Equation f(x)</Form.Label>
                                    <Form.Control type="text" id="equation" value={Equation} onChange={inputEquation} style={{ width: '80%' }} placeholder="((x^2)+7) / 2x" className="custom-placeholder"/>
                                    <Form.Text className="text-muted">
                                        Ensure proper arithmetic syntax.
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Input X (initial value)</Form.Label>
                                    <Form.Control type="number" id="XL" onChange={inputInitial} style={{ width: '50%' }} placeholder="1" className="custom-placeholder"/>
                                    <Form.Text className="text-muted">
                                        Avoid input 0 as a initial value.
                                    </Form.Text>
                                </Form.Group>
                                <Button variant="dark" onClick={calculateRoot} className="centered-button">
                                    Solve
                                </Button>
                                <h5 style={{ textAlign: 'center', marginTop: '20px' }}>Answer : {X.toPrecision(7)}</h5>
                            </Form>
                        </div>
                    </Col>
                    <Col md={9} className='right-column'>
                        <Accordion defaultActiveKey="0" className='according-container'>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Error Graph</Accordion.Header>
                                <Accordion.Body>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                        <ErrorGraph xData={data.map((x) => x.iteration)} yData={data.map((x) => x.Error)} />
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                                    <Accordion.Header>Iteration Table</Accordion.Header>
                                <Accordion.Body>
                                    <div>{print()}</div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default OnePointMethods;
