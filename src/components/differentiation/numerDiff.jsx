import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { evaluate,derivative,isNumber   } from 'mathjs';
import NavigationBar from '../MyNavbar';
import '../../App.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import katex from 'katex';

const NumericalDifferentiation = () => {
    const [Equation, setEquation] = useState("");
    const [X, setX] = useState("");
    const [H, setH] = useState("");
    const [Answer, setAnswer] = useState(0);
    const [selectedOrder, setSelectedOrder] = useState("1"); // first second third fourth
    const [selectedDirection, setSelectedDirection] = useState("1"); // forward backward center


    const [title, setTitle] = useState(""); 

    const [formula, setFormula] = useState(""); 
    const [substitude, setSubstitude] = useState(""); 

    const [exactDiff, setExactDiff] = useState(""); 

    const [errorFormula, setErrorFormula] = useState(""); 

    const f = (x) =>{
        return evaluate(Equation,{x : x});
    }

    const forwardCalculate = (x, h) => {
        let fxip4 = f(x+(4*h));
        let fxip3 = f(x+(3*h));
        let fxip2 = f(x+(2*h));
        let fxip1 = f(x+(1*h));
        let fxi = f(x);

        let result;
        let formulaLatex = ``;
        let subFormulaLatex = ``;

        switch (selectedOrder) {
            case "1":
                result = (fxip1-fxi)/h;
                formulaLatex = `f'(x) = [ f(x_{i+1}) - f(x_{i}) ] / h`;
                subFormulaLatex = `f'(${x}) = [ (${fxip1}) - (${fxi}) ] / (${h}) = ${result}`;
                break;
            case "2":
                result = (fxip2-(2*fxip1)+fxi)/(h**2);
                formulaLatex = `f''(x) = [ f(x_{i+2}) - 2f(x_{i+1}) + f(x_{i}) ] / h^2`;
                subFormulaLatex = `f''(${x}) = [ (${fxip2}) - (${2*fxip1}) + (${fxi}) ] / ${h**2} = ${result}`;
                break;
            case "3":
                result = (fxip3-(3*fxip2)+(3*fxip1)-fxi)/(h**3);
                formulaLatex = `f'''(x) = [ f(x_{i+3}) - 3f(x_{i+2}) + 3f(x_{i+1}) - f(x_{i}) ] / h^3`;
                subFormulaLatex = `f'''(${x}) = [ (${fxip3}) - (${3*fxip2}) + (${3*fxip1}) - (${fxi}) ] / ${h**3} = ${result}`;
                break;
            case "4":
                result = (fxip4-(4*fxip3)+(6*fxip2)-(4*fxip1)+fxi)/(h**4);
                formulaLatex = `f''''(x) = [ f(x_{i+4}) - 4f(x_{i+3}) + 6f(x_{i+2}) - 4f(x_{i+1}) + f(x_{i}) ] / h^4`;
                subFormulaLatex = `f''''(${x}) = [ (${fxip4}) - (${4*fxip3}) + (${6*fxip2}) - (${4*fxip1}) + (${fxi}) ] / ${h**4} = ${result}`;
            default:
                console.log("not matched");
          }
          
        const renderedFormula = katex.renderToString(formulaLatex, {
            throwOnError: false,
        });
        const renderedSubFormula = katex.renderToString(subFormulaLatex, {
            throwOnError: false,
        });

        setFormula(renderedFormula);
        setSubstitude(renderedSubFormula);
        setAnswer(result);
    }

    const backwardCalculate = (x, h) => {
        let fxi = f(x);
        let fxim1 = f(x-(1*h));
        let fxim2 = f(x-(2*h));
        let fxim3 = f(x-(3*h));
        let fxim4 = f(x-(4*h));

        let result;
        let formulaLatex = ``;
        let subFormulaLatex = ``;
        switch (selectedOrder) {
            case "1":
                result = (fxi-fxim1)/h;
                formulaLatex = `f'(x) = [ f(x_{i}) - f(x_{i-1}) ] / h`;
                subFormulaLatex = `f'(${x}) = [ (${fxi}) - (${fxim1}) ] / (${h}) = ${result}`;
                break;
            case "2":
                result = (fxi-(2*fxim1)+fxim2)/(h**2);
                formulaLatex = `f''(x) = [ f(x_{i}) - 2f(x_{i-1}) + f(x_{i-2}) ] / h^2`;
                subFormulaLatex = `f''(${x}) = [ (${fxi}) - (${2*fxim1}) + (${fxim2}) ] / ${h**2} = ${result}`;
                break;
            case "3":
                result = (fxi-(3*fxim1)+(3*fxim2)-fxim3)/(h**3);
                formulaLatex = `f'''(x) = [ f(x_{i}) - 3f(x_{i-1}) + 3f(x_{i-2}) - f(x_{i-3}) ] / h^3`;
                subFormulaLatex = `f'''(${x}) = [ (${fxi}) - (${3*fxim1}) + (${3*fxim2}) - (${fxim3}) ] / ${h**3} = ${result}`;
                break;
            case "4":
                result = (fxi-(4*fxim1)+(6*fxim2)-(4*fxim3)+fxim4)/(h**4);
                formulaLatex = `f''''(x) = [ f(x_{i}) - 4f(x_{i-1}) + 6f(x_{i-2}) - 4f(x_{i-3}) + f(x_{i-4}) ] / h^4`;
                subFormulaLatex = `f''''(${x}) = [ (${fxi}) - (${4*fxim1}) + (${6*fxim2}) - (${4*fxim3}) + (${fxim4}) ] / ${h**4} = ${result}`;
            default:
                console.log("not matched");
          }

        const renderedFormula = katex.renderToString(formulaLatex, {
            throwOnError: false,
        });
        const renderedSubFormula = katex.renderToString(subFormulaLatex, {
            throwOnError: false,
        });

        setFormula(renderedFormula);
        setSubstitude(renderedSubFormula);
        setAnswer(result);
    }

    const centerCalculate = (x, h) => {
        let fxip2 = f(x+(2*h));
        let fxip1 = f(x+(1*h));
        let fxi = f(x);
        let fxim1 = f(x-(1*h));
        let fxim2 = f(x-(2*h));

        let result;
        let formulaLatex = ``;
        let subFormulaLatex = ``;
        switch (selectedOrder) {
            case "1":
                result = (fxip1-fxim1)/(2*h);
                formulaLatex = `f'(x) = [ f(x_{i+1}) - f(x_{i-1}) ] / 2h`;
                subFormulaLatex = `f'(${x}) = [ (${fxip1}) - (${fxim1}) ] / (${2*h}) = ${result}`;
                break;
            case "2":
                result = (fxip1-(2*fxi)+fxim1)/(h**2);
                formulaLatex = `f''(x) = [ f(x_{i+1}) - 2f(x_{i}) + f(x_{i-1}) ] / h^2`;
                subFormulaLatex = `f'(${x}) = [ (${fxip1}) - (${2*fxi}) + (${fxim1}) ] / (${h**2}) = ${result}`;
                break;
            case "3":
                result = (fxip2-(2*fxip1)+(2*fxim1)-(fxim2))/(2*(h**3));
                formulaLatex = `f'''(x) = [ f(x_{i+2}) - 2f(x_{i+1}) + 2f(x_{i-1}) - f(x_{i-2}) ] / 2h^3`;
                subFormulaLatex = `f'(${x}) = [ (${fxip2}) - (${2*fxip1}) + (${2*fxim1}) - (${fxim2})] / (${2*(h**3)}) = ${result}`;
                break;
            case "4":
                result = (fxip2-(4*fxip1)+(6*fxi)-(4*fxim1)+(fxim2))/((h**4));
                formulaLatex = `f''''(x) = [ f(x_{i+2}) - 4f(x_{i+1}) + 6f(x_{i}) - 4f(x_{i-1}) + f(x_{i-2}) ] / h^4`;
                subFormulaLatex = `f'(${x}) = [ (${fxip2}) - (${4*fxip1}) + (${6*fxi}) - (${4*fxim1}) + (${fxim2})] / (${(h**4)}) = ${result}`;
            default:
                console.log("not matched");
          }

        const renderedFormula = katex.renderToString(formulaLatex, {
            throwOnError: false,
        });
        const renderedSubFormula = katex.renderToString(subFormulaLatex, {
            throwOnError: false,
        });

        setFormula(renderedFormula);
        setSubstitude(renderedSubFormula);
        setAnswer(result);
    }

    const CalDiff = (x, h) => {
        let titleLatex = ``;
        switch (selectedOrder) {
            case "1":
                titleLatex += `First \\ `;
                break;
            case "2":
                titleLatex += `Second \\ `;
                break;
            case "3":
                titleLatex += `Third \\ `;
                break;
            case "4":
                titleLatex += `Fourth \\ `;
                break;
            default:
                console.log("not matched");
          }


        switch (selectedDirection) {
            case "1":
                titleLatex += `Forward \\ Divided-Differences \\ ; \\ O(h) `;
                forwardCalculate(x, h);
                break;
            case "2":
                titleLatex += `Backward \\ Divided-Differences \\ ; \\ O(h) `;
                backwardCalculate(x, h);
                break;
            case "3":
                titleLatex += `Central \\ Divided-Differences \\ ; \\ O(h^2) `;
                centerCalculate(x, h);
                break;
            default:
                console.log("not matched");
          }

        
        let diffEquation = derivative(Equation, 'x');;
        let exactDiffLatex = `Exact \\ Differentiation \\ of \\ f(x) = ${Equation} \\\\ f'(x) = ${diffEquation.toString()} \\\\ `;
        let symbol = `'`;
        for (let i = 2; i <= selectedOrder; i++) {
            symbol += `'`;
            diffEquation = derivative(diffEquation.toString(), 'x');
            exactDiffLatex += `f${symbol}(x) = ${diffEquation.toString()} \\\\`;
        }

        //console.log(diffEquation);
        let evaluatedValue = evaluate(diffEquation.toString(), { x: X });
        exactDiffLatex += `At \\ x = ${X} \\ ; \\ f${symbol}(${X}) = ${evaluatedValue}`

        let evaluatedError = Math.abs((Answer-evaluatedValue)/evaluatedValue)*100;
        let errorLatex = `\\displaystyle error = \\left\\lvert \\frac{f${symbol}(x)_{numerical} - f${symbol}(x)_{true}}{f${symbol}(x)_{true}} \\right\\rvert \\times 100\\% = ${evaluatedError}\\%`;
        
        const renderedError = katex.renderToString(errorLatex, {
            throwOnError: false,
        });
        const renderedExactDiff = katex.renderToString(exactDiffLatex, {
            throwOnError: false,
        });
        const renderedTitle = katex.renderToString(titleLatex, {
            throwOnError: false,
        });

        setErrorFormula(renderedError);
        setTitle(renderedTitle);
        setExactDiff(renderedExactDiff);
    };

    const printSolution = () => {
        return (
            <div style={{ width: "100%" }}>
                <div style={{ textAlign: "center" , fontSize: "20px"}} dangerouslySetInnerHTML={{ __html: title }} />
                <br />
                <div style={{ textAlign: "center"}} dangerouslySetInnerHTML={{ __html: formula }} />
                <div style={{ textAlign: "center"}} dangerouslySetInnerHTML={{ __html: substitude }} />
                <br />
                <div style={{ textAlign: "center"}} dangerouslySetInnerHTML={{ __html: exactDiff }} />
                <br />
                <div style={{ textAlign: "center"}} dangerouslySetInnerHTML={{ __html: errorFormula }} />
            </div>
        );
    }

    const inputEquation = (event) => {
        setEquation(event.target.value);
    };

    const inputX = (event) => {
        setX(event.target.value);
    };

    const inputH = (event) => {
        setH(event.target.value);
    };

    const handleSelectedOrderChange = (event) => {
        setSelectedOrder(event.target.value);
    };

    const handleSelectedDirectionChange = (event) => {
        setSelectedDirection(event.target.value);
    };
    

    const calculateRoot = () => {
        setAnswer(0);
        const Xnum = parseFloat(X);
        const Hnum = parseFloat(H);
        CalDiff(Xnum, Hnum);
    };

    const getEquationApi = async () => {
        try {
            const response = await fetch("https://pj-numer-api.onrender.com/differentiateData/random"); 
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const equationData = await response.json();  
            //console.log(equationData);
            if (equationData) {
                setEquation(equationData.fx);
                setX(parseFloat(equationData.x).toFixed(4));
                setH(parseFloat(equationData.h).toFixed(4));
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
                <h1 className='title'>Numerical Differentiation</h1>
                <Row>
                    <Col md={3} className='left-column'>
                        <div className="form-container">
                            <Form>
                                <Form.Label style={{ display: 'flex', justifyContent: 'center' }}>Select Order</Form.Label>
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <Form.Select
                                                style={{ width: "125px" }}
                                                value={selectedOrder}
                                                onChange={handleSelectedOrderChange} 
                                            >
                                                <option value="1">First</option>
                                                <option value="2">Second</option>
                                                <option value="3">Third</option>
                                                <option value="4">Fourth</option>
                                        </Form.Select>
                                    </div>
                                    <br />
                                <Form.Label style={{ display: 'flex', justifyContent: 'center' }}>Select Direction</Form.Label>
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <Form.Select
                                                style={{ width: "125px" }}
                                                value={selectedDirection}
                                                onChange={handleSelectedDirectionChange} 
                                            >
                                                <option value="1">Forward</option>
                                                <option value="2">Backward</option>
                                                <option value="3">Central</option>
                                        </Form.Select>
                                </div>
                                <br />
                                <Form.Group className="mb-3">
                                    <Form.Label style={{ display: 'flex', justifyContent: 'center' }} >Input Equation f(x)</Form.Label>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Form.Control type="text" id="equation" value={Equation} onChange={inputEquation} style={{ width: '80%' }}/>
                                    </div>
                                    <Form.Text className="text-muted" style={{ display: 'flex', justifyContent: 'center' }} >
                                        Ensure proper arithmetic syntax.
                                    </Form.Text>                                    
                                </Form.Group>

                                <Form.Group className="mb-3">
                                <Form.Label style={{ display: 'flex', justifyContent: 'center' }}>Input x</Form.Label>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Form.Control type="number" value={X} onChange={inputX} style={{ width: '50%' }} className="custom-placeholder"/>
                                    </div>

                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label style={{ display: 'flex', justifyContent: 'center' }}>Input h</Form.Label>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Form.Control type="number" value={H} onChange={inputH} style={{ width: '50%' }} className="custom-placeholder"/>
                                    </div>
                                </Form.Group>

                                <Button variant="dark" onClick={getEquationApi} className="centered-button" style={{ width: '50%' }}>
                                    Get Equation
                                </Button>

                                <Button variant="dark" onClick={calculateRoot} className="centered-button">
                                    Solve
                                </Button>

                                <h5 style={{ textAlign: 'center', marginTop: '20px' }}>Answer : {Answer}</h5>
                            </Form>
                        </div>
                    </Col>
                    <Col md={9} className='right-column'>
                        <Accordion defaultActiveKey="0" className='according-container'>
                            <Accordion.Item eventKey="0">
                                    <Accordion.Header>Solution</Accordion.Header>
                                <Accordion.Body>
                                    <div>{printSolution()}</div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default NumericalDifferentiation;
