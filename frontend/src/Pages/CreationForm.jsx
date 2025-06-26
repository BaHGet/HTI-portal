import { useState } from "react";
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import InputGroup from 'react-bootstrap/InputGroup';

const CreationForm = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!id || !password) {
        return setErrorMessage('Please enter both National ID and Password.');
        }

        if (!/^\d+$/.test(id)) {
        return setErrorMessage('ID must contain numbers only.');
        }

        if(id.length !== 8) {
        return setErrorMessage('ID must be 8 digits.');
        }

        const data = { id, password };
        console.log(data);

        const loginData = { id, password };

        try {
        await axios.post('https://example.com/api/login', loginData);
        } catch {
        setErrorMessage('Login failed. Please check your ID and password.');
        }

    };
    return(
        <div className="bg-white" >
            <div  className="card p-4 shadow-lg" style={{ width: '20rem' }}>
                <Form>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Full Name"
                        className="mb-3"
                    >
                        <Form.Control
                            type="text"
                            placeholder="Full Name"
                            value={id}
                            onChange={(e) => {setId(e.target.value); setErrorMessage('');}}
                            className="form-control form-control-sm"
                        />
                    </FloatingLabel>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Email"
                        className="mb-3"
                    >
                        <Form.Control
                            type="text"
                            placeholder="email"
                            value={id}
                            onChange={(e) => {setId(e.target.value); setErrorMessage('');}}
                            className="form-control form-control-sm"
                        />
                    </FloatingLabel>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="password"
                        className="mb-3"
                    >
                        <Form.Control
                            type="text"
                            placeholder="password"
                            value={id}
                            onChange={(e) => {setId(e.target.value); setErrorMessage('');}}
                            className="form-control form-control-sm"
                        />
                    </FloatingLabel>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="National Id"
                        className="mb-3"
                    >
                        <Form.Control
                            type="text"
                            placeholder="National Id"
                            value={id}
                            onChange={(e) => {setId(e.target.value); setErrorMessage('');}}
                            className="form-control form-control-sm"
                        />
                    </FloatingLabel>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Phone Number"
                        className="mb-3"
                    >
                        <Form.Control
                            type="text"
                            placeholder="Phone Number"
                            value={id}
                            onChange={(e) => {setId(e.target.value); setErrorMessage('');}}
                            className="form-control form-control-sm"
                        />
                    </FloatingLabel>
                    <div className=" mb-3">
                        <Form.Check
                            inline
                            label="male"
                            name="gender"
                            type="radio"
                        />
                        <Form.Check
                            inline
                            label="female"
                            name="gender"
                            type="radio"
                        />
                    </div>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Department"
                        className="mb-3"
                    >
                        <Form.Control
                            type="text"
                            placeholder="Department"
                            value={id}
                            onChange={(e) => {setId(e.target.value); setErrorMessage('');}}
                            className="form-control form-control-sm"
                        />
                    </FloatingLabel>
                    <Form.Label>Enrollment Year - {currentYear}</Form.Label>
                    <Form.Range min="1990" max={new Date().getFullYear() } onChange={e => setCurrentYear(e.target.value)}/>
                    <Form.Select size="sm">
                        <option>Current Year</option>
                        {/* TODO:add collage year names here */}
                    </Form.Select>
                   <br/>

                    <button type="submit" className="btn btn-primary btn-sm w-100 mb-3">
                        Login
                    </button>
                </Form>
            </div>
        </div>
    );
};

export default CreationForm;