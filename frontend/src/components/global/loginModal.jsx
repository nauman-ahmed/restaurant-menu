import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, Row, Col } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { login } from '../../APIs/auth';

export default function LoginModal({ loginModal, setLoginModal }) {
    
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const formSubmitHandler = async () => {
        
        try {

            const { data, status } = await login(email, password);
            if(status !== 200){
                toast.error('Login failed. Try again.');
                return 
            }

            if (data.role === 'Student') {
                localStorage.setItem('credentials', JSON.stringify({ email:data.email, role:data.role, _id:data._id  }));
                navigate('/student');
            } else if (data.role === 'Admin') {
                localStorage.setItem('credentials', JSON.stringify({ email:data.email, role:data.role, _id:data._id  }));
                navigate('/admin');
            } else {
                toast.error('Wrong Credentials');
            }

            setLoginModal(false)
            setEmail("")
            setPassword("")
            toast.success("Sign up successfully")

        } catch (error) {
            console.error("Signup failed", error);
            toast.error('Signup failed. Try again.');
        }

    }

    return (
        <>
        <Modal isOpen={loginModal} centered={true} size="md">
            <ModalHeader>
                <p style={{
                    fontSize: '20px',
                    fontWeight: 'bold'
                }} className='w-100 text-black fw-bold text-center theme-color'>
                    Log In to your Account
                </p>
            </ModalHeader>
            <Form onSubmit={(e) => {
                e.preventDefault();
                formSubmitHandler()
            }}>
                <ModalBody className='p-5'>
                    <Row>
                        <Col xs='12' className='my-2'>
                            <div style={{
                                fontSize: '16px',
                                color: 'gray'
                            }} className="label theme-color">
                                Email Address
                            </div>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="text"
                                name="email"
                                className='searchInput border-circular w-100 bg-white'
                                required
                            />
                        </Col>
                        <Col xs='12' className='my-2'>
                            <div style={{
                                fontSize: '16px',
                                color: 'gray'
                            }} className="label theme-color">
                                Password
                            </div>
                            <input
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                name="password"
                                className='searchInput border-circular w-100 bg-white'
                                required
                            />
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button type='submit' style={{ backgroundColor: 'orange' }}>
                        LOG IN
                    </Button>
                    <Button onClick={() => setLoginModal(false)} color="danger">
                        Cancel
                    </Button>
                </ModalFooter>
            </Form>
        </Modal>
        </>
    );
}
