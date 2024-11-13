import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, Row, Col } from 'reactstrap';
import { FaRegSmile } from 'react-icons/fa';

export default function GreetingModal({ greetingModal, setGreetingModal }) {
  
    return (
        <>
        <Modal isOpen={greetingModal} centered={true} size="md">
            <ModalHeader>
            Thank You!
            </ModalHeader>
            <ModalBody className="text-center">
                <FaRegSmile size={50} color="green" />
                <p className="mt-3">Thank you for signing up! Please log in now.</p>
            </ModalBody>
            <ModalFooter>
                <Button type='primary' style={{ backgroundColor: 'orange' }} onClick={() => setGreetingModal(false)}>
                    Close
                </Button>
            </ModalFooter>
        </Modal>
        </>
    );
}
