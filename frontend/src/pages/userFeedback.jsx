import React, { useEffect, useState, useRef } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, Row, Col } from 'reactstrap';
import { addFeedback } from '../APIs/feedback';
import { toast } from 'react-toastify';

const UserFeedback = ({ }) => {
  
    const [content, setContent] = useState('');
    
    const formHandler = async (e) => {
        try {
            e.preventDefault();
            const { data, status } = await addFeedback(content);
            console.log("Data", data)
            if(status !== 200){
                toast.error('Request failed. Try again.');
                return
            }
            setContent('')
            toast.success("Feedback has been sent")

        } catch (error) {
            console.error("Request failed", error);
            toast.error('Request failed. Try again.');
        }
    }

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <Row style={{ width: "50%", overflow: "scroll" }} >
                <Col xs='12' className='my-2'>
                    <div style={{
                        fontSize: '16px',
                        color: 'gray'
                    }} className="label theme-color">
                        Feedback Form
                    </div>
                    
                </Col>
                <Col xs="12" className='my-2'>
                    <textarea
                        id="content"
                        className="p-2 searchInput"
                        name="content"
                        rows="4"
                        cols="50"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        ></textarea>
                </Col>
                <Col xs='12' className='my-2'>
                    <Button type='button' onClick={formHandler} style={{ backgroundColor: 'orange' }}>
                        Send Feedback
                    </Button>
                </Col>
            </Row>
        </div>
  );
};

export default UserFeedback;
