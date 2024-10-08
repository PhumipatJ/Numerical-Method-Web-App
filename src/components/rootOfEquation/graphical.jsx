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
import Plot from 'react-plotly.js';

const GraphicalMethods = () => {
    const [data, setData] = useState([]);
    const [Equation, setEquation] = useState("");
    const [Root, setRoot] = useState(null);
    const [XL, setXL] = useState("");
    const [XR, setXR] = useState("");

    const [XCal, setXCal] = useState([]);
    const [YCal, setYCal] = useState([]);
    

    const [selectedX, setSelectedX] = useState(0);
    const [selectedY, setSelectedY] = useState(0);
    const [selectedIter, setSelectedIter] = useState();
    
    const equation = (x) => {
        return evaluate(Equation, { x });
    };


    const calGraphical = (xlnum, xrnum) => {
        let iter = 0;
        let st = 0;

        let xData = [];
        let yData = [];

        let left = 0, right = 0;
        for (let i = xlnum; i < xrnum; i++) {
            left = equation(i);
            right = equation(i + 1);
            xData.push(i);
            yData.push(equation(i));
            if (left * right < 0) {
                st = i;
                break;
            }
        }

        if (st === -1) {
            alert("No root found in the interval.");
            return;
        }

        let newData = [];
        let root = null;
        for (let i = st+0.00001; i < st + 1; i += 0.00001) {
            let result = equation(i);
            iter++;
            newData.push({Iteration:iter, x: i, y: result });
            xData.push(i);
            yData.push(equation(i));
            if (result > -0.001 && result < 0.001) {
                root = i;
                break;
            }
        }
        setXCal(xData);
        setYCal(yData);
        console.log(xData);
        console.log(yData);
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
        //console.log(data);
        console.log(Root);
    };

    
    const print = () => {
        const combinedData = XCal.map((_, index) => ({
            iteration: index,
            X: XCal[index],
            Fx: YCal[index],
        }));

        const first10Data = combinedData.slice(0, 10);
        const last10Data = combinedData.slice(-10);
    
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
                            <td style={{ textAlign: 'center' }}>{item.iteration}</td>
                            <td style={{ textAlign: 'center' }}>{item.X.toPrecision(6)}</td>
                            <td style={{ textAlign: 'center' }}>{item.Fx.toPrecision(6)}</td>
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
                            <td style={{ textAlign: 'center' }}>{item.iteration}</td>
                            <td style={{ textAlign: 'center' }}>{item.X.toPrecision(6)}</td>
                            <td style={{ textAlign: 'center' }}>{item.Fx.toPrecision(6)}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            </div>
        );
    };
    
    const handleSelectedIteration = (value) => {
        setSelectedIter(value);
        setSelectedX(XCal[value]);
        setSelectedY(YCal[value]);
        //console.log("xl : " + selectedXL);
        //console.log("xr : " + selectedXR);
        //console.log("xm : " + selectedXM);
    };

    const EquationGraph = (selectedX) => {
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
                        {
                            type: 'line',
                            x0: selectedX, 
                            x1: selectedX, 
                            y0: Math.min(...yValues),
                            y1: Math.max(...yValues),
                            line: {
                                color: '#117554',
                                width: 2,
                            },
                        },
                        
                        
                    ],
                }}
                
                
            
            />
        );
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
                                    <Form.Control type="text" id="equation" value={Equation} onChange={inputEquation} style={{ width: '80%' }} className="custom-placeholder"/>
                                    <Form.Text className="text-muted">
                                        Ensure proper arithmetic syntax.
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Input Xʟ</Form.Label>
                                    <Form.Control type="number" id="XL" value={XL} onChange={inputXL} style={{ width: '50%' }}  className="custom-placeholder"/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Input Xʀ</Form.Label>
                                    <Form.Control type="number" id="XR" value={XR} onChange={inputXR} style={{ width: '50%' }}  className="custom-placeholder"/>
                                </Form.Group>
                                <Button variant="dark" onClick={getEquationApi} className="centered-button" style={{ width: '50%' }}>
                                    Get Equation
                                </Button>
                                <Button variant="dark" onClick={calculateRoot} className="centered-button">
                                    Solve
                                </Button>
                                <h5 style={{ textAlign: 'center', marginTop: '20px' }}>Answer : {Root}</h5>
                                
                            </Form>
                        </div>
                    </Col>
                    <Col md={9} className='right-column'>
                        <Accordion defaultActiveKey="0" className='according-container'>
                        <Accordion defaultActiveKey="0" className='according-container'>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Equation Graph</Accordion.Header>
                                <Accordion.Body>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                        {EquationGraph(selectedX)}
                                    </div>
                                    <div style={{ width: '80%', margin: '0 auto', textAlign: 'center' }}>
                                        <Form.Label>
                                            Iteration {selectedIter}
                                            <br />                                      
                                            <span style={{ color: '#117554', fontWeight: '500' }}>
                                                ({selectedX},{selectedY})
                                            </span>
                                        </Form.Label>

                                        <Form.Range 
                                            min={0} 
                                            max={(data.length)-1} 
                                            step={1} 
                                            onChange={(e) => handleSelectedIteration(Number(e.target.value))}
                                        />
                                    </div>
                                    <br />
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                                    <Accordion.Header>Iteration Table</Accordion.Header>
                                <Accordion.Body>
                                    <div>{print()}</div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                            
                        </Accordion>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default GraphicalMethods;
