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
import katex from 'katex';

const Trapezoidal = () => {
    const [Equation, setEquation] = useState("");
    const [area, setArea] = useState(0);
    const [XL, setXL] = useState(""); //a
    const [XR, setXR] = useState(""); //b
    const [solution,setSolution] = useState("");

    const CalArea = (a, b) => {
        const h = b-a;
        const fa = evaluate(Equation, { x: a });
        const fb = evaluate(Equation, { x: b });
        let integrateArea = (h/2)*(fa+fb);

        let solutionLatex = `\\displaystyle
        Evaluate \\ ; \\ I = \\int_{a}^{b} f(x) \\ dx \\ = \\int_{${a}}^{${b}} ${Equation} \\ dx \\\\
        when \\ \\ x_0 = a \\ ,\\  x_1 = b \\\\
        From \\ \\ \\ I = \\frac{h}{2} [f(x_0) + f(x_1)] \\ ; \\ h = b-a \\\\
        I = \\frac{${h}}{2} [(${fa}) + (${fb})] = ${integrateArea}
        `;


        const renderedSolution = katex.renderToString(solutionLatex, {
            throwOnError: false,
        });
        setSolution(renderedSolution);
        setArea(integrateArea);
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
        CalArea(xlnum, xrnum);
    };

    const getEquationApi = async () => {
        try {
            const response = await fetch("https://pj-numer-api.onrender.com/integrateData/random"); 
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const equationData = await response.json();  
            console.log(equationData);
            if (equationData) {
                setEquation(equationData.fx);
                setXL(parseFloat(equationData.a).toFixed(4));
                setXR(parseFloat(equationData.b).toFixed(4));
            } else {
                console.error("No data received");
            }
        } catch (error) {
            console.error("Failed to fetch equation data:", error);
        }
    };

    const getLineFunction = () => {
        let fXL,fXR;
        try {
            fXL = evaluate(Equation, { x: XL });
        } catch (error) {
            console.error(`Error evaluating equation at XL=${XL}:`, error);
            fXL = null; 
        }
        
        try {
            fXR = evaluate(Equation, { x: XR });
        } catch (error) {
            console.error(`Error evaluating equation at XR=${XR}:`, error);
            fXR = null; 
        }
        const m = (fXR - fXL) / (XR - XL);
    
        const lineFunction =  `${m}*x + ${fXR-(m*XR)}`;
    
        return lineFunction;
    };

    
    const EquationGraph = (XL,XR) => {
        const xlNum = parseFloat(XL) - 1;
        const xrNum = parseFloat(XR) + 1;

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

        let slopeEquation = getLineFunction();
        //console.log(slopeEquation);
        const realXL = parseFloat(XL);
        const stepSize2 = (XR - XL) / 100;
        const areaX = Array.from({ length: 101 }, (_, i) => realXL + i * stepSize2);
        const areaY = areaX.map(x => {
            try {
                return evaluate(slopeEquation, { x });
            } catch (error) {
                console.error(`Error evaluating area equation at x=${x}:`, error);
                return null;
            }
        });

    console.log('areaX:', areaX);
    console.log('areaY:', areaY);

        return (
            <Plot
                data={[
                    {
                        x: areaX,
                        y: areaY,
                        fill: 'tozeroy', 
                        type: 'scatter',
                        mode: 'none',
                        fillcolor: 'rgba(182, 255, 161, 0.5)', 
                        name: 'Area',
                    },
                    {
                        x: xValues,
                        y: yValues,
                        mode: 'lines',
                        type: 'scatter',
                        marker: { color: '#5045e5' },
                        name: 'f(x)',
                    },
                ]}

                config={{
                    displayModeBar: true, 
                    scrollZoom: true,
                }}

                layout={{
                    xaxis: {
                        title: 'x',
                    },
                    yaxis: {
                        title: 'f(x)',
                        rangemode: 'tozero',
                    },
                    shapes: [
                        // Vertical line at a 
                        {
                            type: 'line',
                            x0: XL, 
                            x1: XL, 
                            y0: 0,
                            y1: (() => {
                                try {
                                    return evaluate(Equation, { x: XL }); 
                                } catch (error) {
                                    return null; 
                                }
                            })(),
                            line: {
                                color: '#117554',
                                width: 2,
                                dash: 'dot',
                            },
                        },
                        // Vertical line at b
                        {
                            type: 'line',
                            x0: XR, 
                            x1: XR, 
                            y0: 0,
                            y1: (() => {
                                try {
                                    return evaluate(Equation, { x: XR }); 
                                } catch (error) {
                                    return null; 
                                }
                            })(),
                            line: {
                                color: '#117554',
                                width: 2,
                                dash: 'dot',
                            },
                        },
                        // Vertical line from f(a) to f(b)
                        {
                            type: 'line',
                            x0: XL, 
                            x1: XR, 
                            y0: (() => {
                                try {
                                    return evaluate(Equation, { x: XL }); 
                                } catch (error) {
                                    return null; 
                                }
                            })(),
                            y1: (() => {
                                try {
                                    return evaluate(Equation, { x: XR }); 
                                } catch (error) {
                                    return null; 
                                }
                            })(),
                            line: {
                                color: '#117554',
                                width: 2,
                                dash: 'dot',
                            },
                        },
                        
                    ],
                    
                }}
                
                
            
            />
        );
    };

    return (
        <>
            <NavigationBar />
            <div className="outer-container" >
                <h1 className='title'>Trapezoidal Rule</h1>
                <Row>
                    <Col md={3} className='left-column'>
                        <div className="form-container" >
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Input Equation f(x)</Form.Label>
                                    <Form.Control type="text" id="equation" value={Equation} onChange={inputEquation} style={{ width: '80%' }} className="custom-placeholder"/>
                                    <Form.Text className="text-muted">
                                        Ensure proper arithmetic syntax.
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Input a (left)</Form.Label>
                                    <Form.Control type="number" value={XL} id="XL" onChange={inputXL} style={{ width: '50%' }} className="custom-placeholder"/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Input b (right)</Form.Label>
                                    <Form.Control type="number" value={XR} id="XR" onChange={inputXR} style={{ width: '50%' }} className="custom-placeholder"/>
                                </Form.Group>
                                <Button variant="dark" onClick={getEquationApi} className="centered-button" style={{ width: '50%' }}>
                                    Get Equation
                                </Button>
                                <Button variant="dark" onClick={calculateRoot} className="centered-button">
                                    Solve
                                </Button>
                                <h5 style={{ textAlign: 'center', marginTop: '20px' }}>Area : {area.toPrecision(7)}</h5>
                            </Form>
                        </div>
                    </Col>
                    <Col md={9} className='right-column'>
                        <Accordion defaultActiveKey="0" className='according-container'>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Equation Graph</Accordion.Header>
                                <Accordion.Body>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                        {EquationGraph(XL,XR)}
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>Solution</Accordion.Header>
                                <Accordion.Body>
                                    <div style={{ textAlign: 'center' }}>
                                        {<div dangerouslySetInnerHTML={{ __html: solution }} />}
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

export default Trapezoidal;
