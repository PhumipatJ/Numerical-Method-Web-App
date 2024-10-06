import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { evaluate } from 'mathjs';
import NavigationBar from '../MyNavbar';
import '../../App.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import ErrorGraph from './ErrorGraph';
import IterationTable from './IterationTable';

const FalsePositionMethods = () => {
    const [data, setData] = useState([]);

    const [Equation, setEquation] = useState("(x^4)-13");
    const [X, setX] = useState(0);
    const [XL, setXL] = useState(0);
    const [XR, setXR] = useState(0);

    const error = (xold, xnew) => Math.abs((xnew - xold) / xnew) * 100;

    const equation = (x) => {
        return evaluate(Equation, { x });
    };

    const CalFalsePosition = (xl, xr) => {
        let xm, fXm, fXr,fXl, ea;
        let iter = 0;
        const e = 0.001;
        const newData = [];

        do {
            fXl = equation(xl);
            fXr = equation(xr);
            xm = ((xl*fXr)-(xr*fXl))/(fXr-fXl);
            fXm = equation(xm);

            iter++;
            if (fXm * fXr > 0) {
                ea = error(xr, xm);
                newData.push({ iteration: iter, Xl: xl, Xm: xm, Xr: xr, Error: ea });
                xr = xm;
            } else if (fXm * fXr < 0) {
                ea = error(xl, xm);
                newData.push({ iteration: iter, Xl: xl, Xm: xm, Xr: xr, Error: ea });
                xl = xm;
            }
        } while (ea > e);

        setData(newData);
        setX(xm);
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
        CalFalsePosition(xlnum, xrnum);
    };

    return (
        <>
            <NavigationBar />
            <div className="outer-container">
                <h1 className='title'>False-position Methods</h1>
                <Row>
                    <Col md={3} className='left-column'>
                        <div className="form-container">
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Input Equation f(x)</Form.Label>
                                    <Form.Control type="text" id="equation" value={Equation} onChange={inputEquation} style={{ width: '80%' }} placeholder="(x^4)-13" className="custom-placeholder"/>
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
                                    <div><IterationTable data={data} /></div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default FalsePositionMethods;
