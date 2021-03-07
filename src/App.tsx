import {useState, useEffect, useRef, ChangeEvent } from "react";
import * as esbuild from 'esbuild-wasm';
import {Container, Row, Col, Navbar, NavbarBrand, FormGroup, Label, Input, Button} from "reactstrap";

import { PREFILLED_CODE } from "./utils/constants";

import { Code } from "./Components";

function App() {
    const ref = useRef<esbuild.Service | null>(null);
    const [input, setInput] = useState<string>(PREFILLED_CODE);
    const [code, setCode] = useState<string>('');

    const startService = async (): Promise<void> => {
        ref.current = await esbuild.startService({
            // It's better to use Web Worker for WASM
            // to prevent blocking UI thread.
            // It's consumed by default.
            // worker: true,
            wasmURL: 'esbuild.wasm'
        });

        console.log('esbuild', ref.current);
    };

    useEffect((): void => {
        startService();
    }, []);

    const onClick = async (): Promise<void> => {
        if (!ref.current) {
            return;
        }

        const result = await ref.current.transform(input, {
            loader: "jsx",
            target: "es2015"
        });

        console.log("transpiled", result);
        setCode(result.code);
    };

    return (
        <Container className="App">
            <Navbar color="light" className='mb-5'>
                <NavbarBrand href="/">Browser Transpiler</NavbarBrand>
            </Navbar>
            <Row>
                <Col sm='12'>
                    <FormGroup>
                        <Label for="code">Insert your code:</Label>
                        <Code id='code' language="js" value={input} onChange={setInput}/>
                        <Button className='mb-3' color="success" onClick={(): Promise<void>=> onClick()}>Transpile!</Button>
                    </FormGroup>
                </Col>
                <Col sm='12'>
                    <Label for="transpiled-code">Transpiled code:</Label>
                    <Input id="transpiled-code" multiple value={code} onChange={(e:ChangeEvent<HTMLInputElement>): void => setCode(e.target.value)}/>
                </Col>
            </Row>
        </Container>
    );
}

export default App;
