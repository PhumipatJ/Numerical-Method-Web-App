import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { evaluate } from 'mathjs';
import NavigationBar from '../MyNavbar';
import '../../App.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import { Table, Container } from 'react-bootstrap';
import Plot from 'react-plotly.js';

const BisectionMethods = () => {
    const [Error, setError] = useState([]);
    const [XLCal, setXLCal] = useState([]);
    const [XRCal, setXRCal] = useState([]);
    const [XMCal, setXMCal] = useState([]);
    const [selectedXL, setSelectedXL] = useState(0);
    const [selectedXR, setSelectedXR] = useState(0);
    const [selectedXM, setSelectedXM] = useState(0);
    const [Iteration, setIteration] = useState([]);
    const [Equation, setEquation] = useState("");
    const [X, setX] = useState(0);
    const [XL, setXL] = useState("");
    const [XR, setXR] = useState("");

    const error = (xold, xnew) => Math.abs((xnew - xold) / xnew) * 100;

    const Calbisection = (xl, xr) => {
        let xm, fXm, fXr, ea, scope;
        let iter = 0;
        const e = 0.000001;

        let iterArr = [];
        let xlArr = [];
        let xrArr = [];
        let xmArr = [];
        let errArr = [];

        do {
            xm = (xl + xr) / 2.0;
            scope = { x: xr };
            fXr = evaluate(Equation, scope);

            scope = { x: xm };
            fXm = evaluate(Equation, scope);

            iter++;
            if (fXm * fXr > 0) {
                ea = error(xr, xm);
                xlArr.push(xl);
                xrArr.push(xr);
                xmArr.push(xm);
                errArr.push(ea);
                iterArr.push(iter);
                xr = xm;
            } else if (fXm * fXr < 0) {
                ea = error(xl, xm);
                xlArr.push(xl);
                xrArr.push(xr);
                xmArr.push(xm);
                errArr.push(ea);
                iterArr.push(iter);
                xl = xm;
            }
        } while (ea > e);

        setIteration(iterArr);
        setError(errArr);
        setXLCal(xlArr);
        setXRCal(xrArr);
        setXMCal(xmArr);
        //console.log(iterArr);
        //console.log(xlArr);
        //console.log(xrArr);
        //console.log(xmArr);
        //console.log(errArr);
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
        Calbisection(xlnum, xrnum);
    };

    const getEquationApi = async () => {
        try {
            const response = await fetch("http://localhost:5000/rootOfEquationData/filter?data_id=1"); 
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const equationData = await response.json();  
            console.log(equationData);
            if (equationData) {
                setEquation(equationData.fx);
                setXL(parseFloat(equationData.xl).toFixed(4));
                setXR(parseFloat(equationData.xr).toFixed(4));
            } else {
                console.error("No data received");
            }
        } catch (error) {
            console.error("Failed to fetch equation data:", error);
        }
    };
    
    const ErrorGraph = () => {
        let xData = Iteration.map((iter) => iter);
        let yData = Error.map((error) => error); 
    
        return (
            <Plot
                data={[
                    {
                        x: xData,
                        y: yData,
                        mode: 'lines+markers',
                        type: 'scatter',
                        marker: { color: '#5045e5' },
                        name: 'Error (%)',
                    },
                ]}
                layout={{
                    xaxis: {
                        title: 'Iteration',
                    },
                    yaxis: {
                        title: 'Error (%)',
                        rangemode: 'tozero',
                    },
                }}
            />
        );
    };

    const EquationGraph = (selectedXL,selectedXR,selectedXM) => {
        const xlNum = parseFloat(XL);
        const xrNum = parseFloat(XR);

        const stepSize = (xrNum - xlNum) / 100;  
        const xValues = Array.from({ length: 100 }, (_, i) => xlNum + (i * stepSize)); 
        const yValues = xValues.map(x => {
            try {
                return evaluate(Equation, { x });  
            } catch (error) {
                console.error(`Error evaluating equation at x=${x}:`, error);
                return null;  
            }
        });

        return (
            <Plot
                data={[
                    {
                        x: xValues,
                        y: yValues,
                        mode: 'lines',
                        type: 'scatter',
                        marker: { color: '#5045e5' },
                        name: 'f(x)',
                    },
                ]}

                layout={{
                    title: 'Equation Graph',
                    xaxis: {
                        title: 'x',
                    },
                    yaxis: {
                        title: 'f(x)',
                        rangemode: 'tozero',
                    },
                    shapes: [
                        // Vertical line at XL
                        {
                            type: 'line',
                            x0: selectedXL, 
                            x1: selectedXL, 
                            y0: Math.min(...yValues),
                            y1: Math.max(...yValues),
                            line: {
                                color: 'red',
                                width: 2,
                            },
                        },
                        // Vertical line at XR
                        {
                            type: 'line',
                            x0: selectedXR, 
                            x1: selectedXR, 
                            y0: Math.min(...yValues),
                            y1: Math.max(...yValues),
                            line: {
                                color: 'red',
                                width: 2,
                            },
                        },
                        // Vertical line at XM
                        {
                            type: 'line',
                            x0: selectedXM, 
                            x1: selectedXM, 
                            y0: Math.min(...yValues),
                            y1: Math.max(...yValues),
                            line: {
                                color: 'green',
                                width: 2,
                            },
                        },
                        
                        
                    ],
                }}
                
                
            
            />
        );
    };

    const handleSelectedIteration = (value) => {
        setSelectedXL(XLCal[value]);
        setSelectedXR(XRCal[value]);
        setSelectedXM(XMCal[value]);
        //console.log("xl : " + selectedXL);
        //console.log("xr : " + selectedXR);
        //console.log("xm : " + selectedXM);
    };

    const IterationTable = () => {
        const combinedData = Error.map((error, index) => ({
            iteration: Iteration[index],
            Xl: XLCal[index],
            Xm: XMCal[index],
            Xr: XRCal[index],
            Error: error,
        }));
    
        return (
            <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Table className="rounded-table">
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center', width: '10%', fontWeight: '600' }}>Iteration</th>
                            <th style={{ textAlign: 'center', width: '10%', fontWeight: '600' }}>Xʟ</th>
                            <th style={{ textAlign: 'center', width: '10%', fontWeight: '600' }}>Xᴍ</th>
                            <th style={{ textAlign: 'center', width: '10%', fontWeight: '600' }}>Xʀ</th>
                            <th style={{ textAlign: 'center', width: '10%', fontWeight: '600' }}>Error(%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {combinedData.map((element, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: 'center' }}>{element.iteration}</td>
                                <td style={{ textAlign: 'center' }}>{element.Xl.toFixed(7)}</td>
                                <td style={{ textAlign: 'center' }}>{element.Xm.toFixed(7)}</td>
                                <td style={{ textAlign: 'center' }}>{element.Xr.toFixed(7)}</td>
                                <td style={{ textAlign: 'center' }}>{element.Error.toFixed(7)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        );
    };

    return (
        <>
            <NavigationBar />
            <div className="outer-container">
                <h1 className='title'>Bisection Methods</h1>
                <Row>
                    <Col md={3} className='left-column'>
                        <div className="form-container">
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Input Equation f(x)</Form.Label>
                                    <Form.Control type="text" id="equation" value={Equation} onChange={inputEquation} style={{ width: '80%' }} className="custom-placeholder"/>
                                    <Form.Text className="text-muted">
                                        Ensure proper arithmetic syntax.
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Input Xʟ</Form.Label>
                                    <Form.Control type="number" value={XL} id="XL" onChange={inputXL} style={{ width: '50%' }} className="custom-placeholder"/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Input Xʀ</Form.Label>
                                    <Form.Control type="number" value={XR} id="XR" onChange={inputXR} style={{ width: '50%' }} className="custom-placeholder"/>
                                </Form.Group>
                                <Button variant="dark" onClick={getEquationApi} className="centered-button" style={{ width: '50%' }}>
                                    Get Equation
                                </Button>
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
                                <Accordion.Header>Equation Graph</Accordion.Header>
                                <Accordion.Body>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                        {EquationGraph(selectedXL,selectedXR,selectedXM)}
                                    </div>
                                    <div style={{ width: '80%', margin: '0 auto', textAlign: 'center' }}>
                                        <Form.Label>Iteration</Form.Label>
                                        <Form.Range 
                                            min={0} 
                                            max={Iteration.length-1} 
                                            step={1} 
                                            onChange={(e) => handleSelectedIteration(Number(e.target.value))}
                                        />
                                    </div>
                                    <br />
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>Error Graph</Accordion.Header>
                                <Accordion.Body>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                        {ErrorGraph()}
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="2">
                                    <Accordion.Header>Iteration Table</Accordion.Header>
                                <Accordion.Body>
                                    <div>{IterationTable()}</div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default BisectionMethods;
