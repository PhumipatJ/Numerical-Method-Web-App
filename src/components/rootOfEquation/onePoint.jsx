import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import { Button, Form, Table, Container } from "react-bootstrap";
import { evaluate } from 'mathjs';
import NavigationBar from '../MyNavbar';
import '../../App.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import '../../css all/IterationTable.css'
import Plot from 'react-plotly.js';


const OnePointMethods = () => {

    const [Error, setError] = useState([]);
    const [selectedXnew, setSelectedXnew] = useState(0);
    const [selectedXold, setSelectedXold] = useState(0);
    const [selectedIter, setSelectedIter] = useState();

    const [XCal, setXCal] = useState(0);
    const [Iteration, setIteration] = useState([]);

    const [Equation, setEquation] = useState("");
    const [X, setX] = useState(0);
    const [Xini, setXini] = useState("");
    

    const error = (xold, xnew) => Math.abs((xnew - xold) / xnew) * 100;

    const getEquationApi = async () => {
        try {
            const response = await fetch("http://localhost:5000/rootOfEquationData/filter?data_id=2"); 
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const equationData = await response.json();  
            console.log(equationData);
            if (equationData) {
                setEquation(equationData.fx);
                setXini(parseFloat(equationData.initial_x).toFixed(4));
            } else {
                console.error("No data received");
            }
        } catch (error) {
            console.error("Failed to fetch equation data:", error);
        }
    };


    const equation = (x) => {
        return evaluate(Equation, { x });
    };
    
    let xData = [];
    let errData = [];
    let iterData = []

    let iter = 0;
    const CalOnePoint = (x1) => {
        let err;
        let x2 = equation(x1);
        if(Math.abs(x2-x1) < 0.00001){
            setError(errData);
            setXCal(xData);
            setIteration(iterData)
            setX(x2);
            return;
        }
        else{
            iter++;
            err = error(x1, x2);
            xData.push(x2);
            errData.push(err);
            iterData.push(iter);

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

    const handleSelectedIteration = (value) => {
        //console.log(value);
        //console.log(XCal);
        setSelectedIter(value);
        setSelectedXnew(XCal[value]);
        if(value != 0){
            setSelectedXold(XCal[value-1]);
        }
        else{
            setSelectedXold(Xini);
        }
        //console.log(selectedXold);
        //console.log(selectedXnew);
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

    const EquationGraph = (selectedXold,selectedXnew) => { 
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

        const xValues2 = Array.from({ length: 100 }, (_, i) => -5 + (i * stepSize)); // adjust number 0 to -5 to select quadrant
        const yValues2 = xValues2.map(x => x);

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
                    {
                        x: xValues2, 
                        y: yValues2, 
                        mode: 'lines',
                        type: 'scatter',
                        marker: { color: '#e55a50' },
                        name: 'x', 
                    },
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
                        // X old
                        {
                            type: 'line',
                            x0: selectedXold, 
                            x1: selectedXold, 
                            y0: 0,
                            y1: selectedXnew, 
                            line: {
                                color: '#117554',
                                width: 2,
                                dash: 'dot',
                            },
                        }, 
                         // Xold to Xnew
                         {
                            type: 'line',
                            x0: selectedXold, 
                            x1: selectedXnew, 
                            y0: selectedXnew,
                            y1: selectedXnew, 
                            line: {
                                color: '#7A1CAC',
                                width: 2,
                            },
                        }, 
                        // Xold to 0
                        {
                            type: 'line',
                            x0: selectedXnew, 
                            x1: selectedXnew, 
                            y0: selectedXnew,
                            y1: 0, 
                            line: {
                                color: '#7A1CAC',
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
            X: XCal[index],
            Error: error,
        }));
    
        return (
            <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Table className="rounded-table">
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center', width: '10%', fontWeight: '600' }}>Iteration</th>
                            <th style={{ textAlign: 'center', width: '10%', fontWeight: '600' }}>X</th>
                            <th style={{ textAlign: 'center', width: '10%', fontWeight: '600' }}>Error(%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {combinedData.map((element, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: 'center' }}>{element.iteration}</td>
                                <td style={{ textAlign: 'center' }}>{element.X.toFixed(7)}</td>
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
                <h1 className='title'>One-point Iteration Methods</h1>
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
                                    <Form.Label>Input X (initial value)</Form.Label>
                                    <Form.Control type="number" id="XL" value={Xini} onChange={inputInitial} style={{ width: '50%' }}  className="custom-placeholder"/>
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
                                        {EquationGraph(selectedXold,selectedXnew)}
                                    </div>
                                    <div style={{ width: '80%', margin: '0 auto', textAlign: 'center' }}>
                                        <Form.Label>
                                            Iteration {selectedIter+1}
                                            <br />                                      
                                            <span style={{ color: '#7A1CAC' , fontWeight: '500'}}>
                                                x<sub>new</sub> = {selectedXnew}
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

export default OnePointMethods;
