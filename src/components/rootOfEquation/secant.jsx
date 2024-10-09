import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import { Button, Form, Table, Container } from "react-bootstrap";
import { evaluate } from 'mathjs';
import NavigationBar from '../MyNavbar';
import '../../App.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import Plot from 'react-plotly.js';
import '../../css all/IterationTable.css'


const SecantMethods = () => {

    const [Error, setError] = useState([]);
    const [selectedXnew, setSelectedXnew] = useState(0);
    const [selectedXnow, setSelectedXnow] = useState(0);
    const [selectedXold, setSelectedXold] = useState(0);
    const [selectedIter, setSelectedIter] = useState();

    const [XCalOld, setXCalOld] = useState(0);
    const [XCalNew, setXCalNew] = useState(0);
    const [Iteration, setIteration] = useState([]);

    const [Equation, setEquation] = useState("");
    const [X, setX] = useState(0);
    const [Xini1, setXini1] = useState("");
    const [Xini2, setXini2] = useState("");

    const getEquationApi = async () => {
        try {
            const response = await fetch("http://localhost:5000/rootOfEquationData/filter?data_id=3"); 
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const equationData = await response.json();  
            console.log(equationData);
            if (equationData) {
                setEquation(equationData.fx);
                setXini1(parseFloat(equationData.initial_first_x).toFixed(4));
                setXini2(parseFloat(equationData.initial_second_x).toFixed(4));
            } else {
                console.error("No data received");
            }
        } catch (error) {
            console.error("Failed to fetch equation data:", error);
        }
    };

    const error = (xold, xnew) => Math.abs((xnew - xold) / xnew) * 100;

    const fx = (x) => {
        return evaluate(Equation, { x });
    };

    const equation = (x1, x2) => {
        const f_x1 = fx(x1);
        const f_x2 = fx(x2);
        return x2 - (f_x2 * (x1 - x2) / (f_x1 - f_x2));
    };

    let xDataOld = [];
    let xDataNew = [];
    let errData = [];
    let iterData = []

    let iter = 0;
    const CalSecant = (x1,x2) => {
        let err;
        let x3 = equation(x1,x2);
        if(Math.abs(x3-x2) < 0.000001){
            
            setXCalOld(xDataOld);
            setXCalNew(xDataNew);
            setIteration(iterData);
            setError(errData);
            setX(x3);
            return;
        }
        else{
            iter++;
            err = error(x2, x3);
            xDataOld.push(x2);
            xDataNew.push(x3);
            errData.push(err);
            iterData.push(iter);
            return CalSecant(x2,x3);
        }

    };

    const inputEquation = (event) => {
        setEquation(event.target.value);
    };

    const inputInitial1 = (event) => {
        setXini1(event.target.value);
    };

    const inputInitial2 = (event) => {
        setXini2(event.target.value);
    };

    const calculateRoot = () => {
        const xini1 = parseFloat(Xini1);
        const xini2 = parseFloat(Xini2);
        CalSecant(xini1,xini2);
    };

    const handleSelectedIteration = (value) => {
        //console.log(value);
        //console.log(XCal);
        setSelectedIter(value);
        if(value === 0){
            setSelectedXold(Xini1);
            setSelectedXnow(Xini2);
            setSelectedXnew(XCalNew[value]);
        }
        else if(value === Iteration.length-1){
            setSelectedXold(XCalOld[value]);
            setSelectedXnow(XCalNew[value]);
            setSelectedXnew(X);
        }
        else {
            setSelectedXold(XCalOld[value]);
            setSelectedXnow(XCalNew[value]);
            setSelectedXnew(XCalNew[value+1]);
        }

        //console.log("Xold : " + selectedXold);
        //console.log("Xnow : " + selectedXnow);
        //console.log("Xnew : " + selectedXnew);
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
                        mode: 'lines',
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

    const EquationGraph = (selectedXold,selectedXnow,selectedXnew) => { 
        const stepSize = 0.1; 
        const xValues = Array.from({ length: 100 }, (_, i) => -5 + (i * stepSize)); // adjust number 0 to -5 to select quadrant
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
                    }
                ]}

                config={{
                    displayModeBar: true, 
                    scrollZoom: true,
                }}

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
                        //xold to f(x)
                        {
                            type: 'line',
                            x0: selectedXold, 
                            x1: selectedXold, 
                            y0: 0,
                            y1: (() => {
                                try {
                                    return evaluate(Equation, { x: selectedXold }); 
                                } catch (error) {
                                    console.error(`Error evaluating equation at x=${selectedXold}:`, error);
                                    return null; 
                                }
                            })(),
                            line: {
                                color: '#117554',
                                width: 2,
                                dash: 'dot',
                            },
                        }, 
                         // xnow to x line
                         {
                            type: 'line',
                            x0: selectedXnow, 
                            x1: selectedXnow, 
                            y0: 0,
                            y1: (() => {
                                try {
                                    return evaluate(Equation, { x: selectedXnow }); 
                                } catch (error) {
                                    console.error(`Error evaluating equation at x=${selectedXold}:`, error);
                                    return null; 
                                }
                            })(),
                            line: {
                                color: '#7A1CAC',
                                width: 2,
                                dash: 'dot',
                            },
                        }, 
                        //xold to (xnew,0)
                        {
                            type: 'line',
                            x0: selectedXnew, 
                            x1: selectedXold, 
                            y0: 0,
                            y1: (() => {
                                try {
                                    return evaluate(Equation, { x: selectedXold }); 
                                } catch (error) {
                                    console.error(`Error evaluating equation at x=${selectedXold}:`, error);
                                    return null; 
                                }
                            })(),
                            line: {
                                color: '#D91656',
                                width: 2,
                            },
                        }, 
                        // xnow to (xnew,0)
                        {
                            type: 'line',
                            x0: selectedXnew, 
                            x1: selectedXnow, 
                            y0: 0,
                            y1: (() => {
                                try {
                                    return evaluate(Equation, { x: selectedXnow }); 
                                } catch (error) {
                                    console.error(`Error evaluating equation at x=${selectedXold}:`, error);
                                    return null; 
                                }
                            })(),
                            line: {
                                color: '#D91656',
                                width: 2,
                            },
                        }, 
                        // x line to f(Xnew)
                        {
                            type: 'line',
                            x0: selectedXnew, 
                            x1: selectedXnew, 
                            y0: 0,
                            y1: (() => {
                                try {
                                    return evaluate(Equation, { x: selectedXnew }); 
                                } catch (error) {
                                    console.error(`Error evaluating equation at x=${selectedXnew}:`, error);
                                    return null; 
                                }
                            })(), 
                            line: {
                                color: '#D91656',
                                width: 2,
                                dash: 'dot',
                            },
                        }, 
                        
                    ],
                }}      
            />
        );
    };

    const IterationTable = () => {
        const combinedData = Error.map((error, index) => ({
            iteration: Iteration[index],
            XOld: XCalOld[index],
            XNew: XCalNew[index],
            Error: error,
        }));
    
        return (
            <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Table className="rounded-table">
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center', width: '10%', fontWeight: '600' }}>Iteration</th>
                            <th style={{ textAlign: 'center', width: '10%', fontWeight: '600' }}>X<sub>old</sub></th>
                            <th style={{ textAlign: 'center', width: '10%', fontWeight: '600' }}>X<sub>new</sub></th>
                            <th style={{ textAlign: 'center', width: '10%', fontWeight: '600' }}>Error(%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {combinedData.map((element, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: 'center' }}>{element.iteration}</td>
                                <td style={{ textAlign: 'center' }}>{element.XOld.toFixed(7)}</td>
                                <td style={{ textAlign: 'center' }}>{element.XNew.toFixed(7)}</td>
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
                <h1 className='title'>Secant Methods</h1>
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
                                    <Form.Label>Input X₀ (first initial value)</Form.Label>
                                    <Form.Control type="number" id="XL" value={Xini1} onChange={inputInitial1} style={{ width: '50%' }}  className="custom-placeholder"/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Input X₁ (second initial value)</Form.Label>
                                    <Form.Control type="number" id="XL" value={Xini2} onChange={inputInitial2} style={{ width: '50%' }}  className="custom-placeholder"/>
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
                                        {EquationGraph(selectedXold,selectedXnow,selectedXnew)}
                                    </div>
                                    <div style={{ width: '80%', margin: '0 auto', textAlign: 'center' }}>
                                        <Form.Label>
                                            Iteration {selectedIter+1}
                                            <br />                                                                      
                                            <span style={{ color: '#7A1CAC', fontWeight: '500' }}>
                                                x<sub>new</sub> = {selectedXnow}
                                            </span>
                                            <br />                                   
                                            <span style={{ color: '#117554', fontWeight: '500' }}>
                                                x<sub>old</sub> = {selectedXold}
                                            </span>
                                        </Form.Label>

                                        <Form.Range 
                                            min={0} 
                                            max={(Iteration.length)-1} 
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

export default SecantMethods;
