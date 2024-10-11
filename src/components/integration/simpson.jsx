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

const Simpson = () => {
    const [Equation, setEquation] = useState("");
    const [area, setArea] = useState(0);
    const [XL, setXL] = useState(""); //a
    const [XR, setXR] = useState(""); //b
    const [N, setN] = useState(""); //n
    const [solution,setSolution] = useState("");

    const getEquationApi = async () => {
        try {
            const response = await fetch("https://pj-numer-api.onrender.com/integrateData/random"); 
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const equationData = await response.json();  
            //console.log(equationData);
            if (equationData) {
                setEquation(equationData.fx);
                setXL(parseFloat(equationData.a).toFixed(4));
                setXR(parseFloat(equationData.b).toFixed(4));
                setN(parseFloat(equationData.n));
            } else {
                console.error("No data received");
            }
        } catch (error) {
            console.error("Failed to fetch equation data:", error);
        }
    };

    const CalArea = (a, b) => {
        //console.log(N);
        const fa = evaluate(Equation, { x: a });
        const fb = evaluate(Equation, { x: b });
        let integrateArea = 0;

        let solutionLatex = ``;
        if(N === '1'){
            const h = (b-a)/2;
            const fmid = evaluate(Equation, { x: (a+b)/2 });
            integrateArea = (h/3)*(fa+(4*fmid)+fb);
            solutionLatex = `\\displaystyle
            Evaluate \\ ; \\ I = \\int_{a}^{b} f(x) \\ dx \\ = \\int_{${a}}^{${b}} ${Equation} \\ dx \\\\
            when \\ \\ x_0 = a \\ ,\\ x_1 = \\frac{a+b}{2} \\,\\  x_n = b \\\\
            From \\ \\ \\ I = \\frac{h}{3} [f(x_0) + 4f(x_1) + f(x_2)] \\ ; \\ h = \\frac{b-a}{2} \\\\
            Simpson \\ Integral \\ ; I = \\frac{${h}}{3} [(${fa}) + 4(${fmid}) + (${fb})] = ${Math.abs(integrateArea)}
            `;
        }
        else{
            const h = (b-a)/(N*2); // amout of box
            //console.log(h);
            let fodd = 0;
            let feven = 0;
            let oddArr = [];
            let evenArr = [];
            let xArr = [];
            let fxArr = [];
            for (let i = 1; i <= (N*2)-1; i++) {
                let xi = a + (i * h); 
                xArr.push(xi);
                fxArr.push(evaluate(Equation,{x : xi}));
                if(i % 2 == 0){ // i = even
                    feven += evaluate(Equation,{x : xi});
                    //evenArr.push(xi);
                }
                else if(i % 2 !== 0){ // i = odd
                    fodd += evaluate(Equation,{x : xi});
                    //oddArr.push(xi);
                }
            }
            console.log("x : " + xArr);
            console.log("fx : " + fxArr);
            //console.log("odd : " + oddArr);
            //console.log("even : " + evenArr);
            integrateArea = (h/3)*(fa+fb+(4*fodd)+(2*feven));

            solutionLatex = `\\displaystyle
            Evaluate \\ ; \\ I = \\int_{a}^{b} f(x) \\ dx \\ = \\int_{${a}}^{${b}} ${Equation} \\ dx \\\\
            when \\ \\ x_0 = a \\ ,\\ x_i = x_0+ih \\,\\  x_n = b \\\\
            From \\ \\ \\ I = \\frac{h}{3} [f(x_0) + f(x_n) + 4f(x_i) + 2f(x_i)] \\ ; \\ h = \\frac{b-a}{2} \\\\
            Simpson \\ Integral \\ ; I = \\frac{${h.toFixed(6)}}{3} [(${fa}) + 4(${fb}) + 4(${fodd.toFixed(6)}) + 2(${feven.toFixed(6)})] = ${Math.abs(integrateArea).toFixed(6)}
            `;
        }
        


        const renderedSolution = katex.renderToString(solutionLatex, {
            throwOnError: false,
        });
        setSolution(renderedSolution);
        setArea(Math.abs(integrateArea));
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

    const inputN = (event) => {
        setN(event.target.value);
    };

    const calculateRoot = () => {
        const xlnum = parseFloat(XL);
        const xrnum = parseFloat(XR);
        const nnum = parseFloat(N)
        CalArea(xlnum, xrnum, nnum);
    };

    const getLineFunction = (XL,XR) => {
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
        const xlNum = parseFloat(XL)-1;
        const xrNum = parseFloat(XR)+1;

        const xlNum2 = parseFloat(XL);
        const xrNum2 = parseFloat(XR);

        const Nnum = parseFloat(N)

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


        let slopeEquation = [];
        let error = 1e-10;
        let segmentAmount = (xrNum2-xlNum2)/Nnum;
        for(let i = xlNum2; i < xrNum2-error ;i+=segmentAmount){
            slopeEquation.push({
                a: i, 
                mid: (i+i+segmentAmount)/2,
                b: Math.min(i + segmentAmount, xrNum2), //cap at xrNum2
                equationLeft: getLineFunction(i, (i+i+segmentAmount)/2)  ,
                equationRight: getLineFunction((i+i+segmentAmount)/2, i+segmentAmount) 
            });
        }
        console.log(slopeEquation);

        const stepSize2 = (xrNum2 - xlNum2) / 100;
        const areaX = Array.from({ length: 201 }, (_, i) => xlNum2 + (i * stepSize2 / 2)); // Double the number of points

        // Modify areaY to use the left and right equations based on segment
        const areaY = areaX.map(x => {
            try {
                const segment = slopeEquation.find(s => x >= s.a && x <= s.b);
                if (segment) {
                    if (x <= segment.mid) {
                        // Use equationLeft for the left half
                        return evaluate(segment.equationLeft, { x });
                    } else {
                        // Use equationRight for the right half
                        return evaluate(segment.equationRight, { x });
                    }
                }
                return null;
            } catch (error) {
                console.error(`Error evaluating area equation at x=${x}:`, error);
                return null;
            }
        });

        //console.log('areaX:', areaX);
        //console.log('areaY:', areaY);

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
                    shapes: slopeEquation.flatMap(segment => {
                        const { a, mid,b, equationLeft,equationRight } = segment;
        
                        return [
                            // Vertical line at 'a'
                            {
                                type: 'line',
                                x0: a,
                                x1: a,
                                y0: 0,
                                y1: (() => {
                                    try {
                                        return evaluate(equationLeft, { x: a });
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
                            // Vertical line at 'mid' Left
                            {
                                type: 'line',
                                x0: mid,
                                x1: mid,
                                y0: 0,
                                y1: (() => {
                                    try {
                                        return evaluate(equationLeft, { x: mid });
                                    } catch (error) {
                                        return null;
                                    }
                                })(),
                                line: {
                                    color: '#FF6500',
                                    width: 1,
                                    dash: 'dot',
                                },
                            },
                            // Vertical line at 'mid' right
                            {
                                type: 'line',
                                x0: mid,
                                x1: mid,
                                y0: 0,
                                y1: (() => {
                                    try {
                                        return evaluate(equationRight, { x: mid });
                                    } catch (error) {
                                        return null;
                                    }
                                })(),
                                line: {
                                    color: '#FF6500',
                                    width: 1,
                                    dash: 'dot',
                                },
                            },
                            // Vertical line at 'b'
                            {
                                type: 'line',
                                x0: b,
                                x1: b,
                                y0: 0,
                                y1: (() => {
                                    try {
                                        return evaluate(equationRight, { x: b });
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
                            // Line connecting f(a) to f(mid)left
                            {
                                type: 'line',
                                x0: a,
                                x1: mid,
                                y0: (() => {
                                    try {
                                        return evaluate(equationLeft, { x: a });
                                    } catch (error) {
                                        return null;
                                    }
                                })(),
                                y1: (() => {
                                    try {
                                        return evaluate(equationLeft, { x: mid });
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
                            // Line connecting f(mid)right to b
                            {
                                type: 'line',
                                x0: b,
                                x1: mid,
                                y0: (() => {
                                    try {
                                        return evaluate(equationRight, { x: b });
                                    } catch (error) {
                                        return null;
                                    }
                                })(),
                                y1: (() => {
                                    try {
                                        return evaluate(equationRight, { x: mid });
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
                        ];
                    }),
                    
                }} 
            />
        );
    };

    return (
        <>
            <NavigationBar />
            <div className="outer-container">
                <h1 className='title'>Simpson Rule</h1>
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
                                    <Form.Label>Input a (left)</Form.Label>
                                    <Form.Control type="number" value={XL} id="XL" onChange={inputXL} style={{ width: '50%' }} className="custom-placeholder"/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Input b (right)</Form.Label>
                                    <Form.Control type="number" value={XR} id="XR" onChange={inputXR} style={{ width: '50%' }} className="custom-placeholder"/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Input n</Form.Label>
                                    <Form.Control type="number" value={N} id="N" onChange={inputN} style={{ width: '50%' }} className="custom-placeholder"/>
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
                                        {EquationGraph(parseFloat(XL),parseFloat(XR))}
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

export default Simpson;
