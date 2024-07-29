// PaysofterPromise.js
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import PaysofterAccountFundPromise from "./PaysofterAccountFundPromise";
import Select from "react-select";
import { PAYMENT_DURATION_CHOICES } from "./payment-constants";

const PaysofterPromise = ({
  email,
  currency,
  amount,
  paysofterPublicKey,
  onSuccess,
  onClose,
}) => {
  const [durationChoices, setDurationChoices] = useState([]);

  useEffect(() => {
    setDurationChoices(PAYMENT_DURATION_CHOICES);
  }, []);

  const handleDurationChange = (selectedOption) => {
    setDuration(selectedOption.value);
  };

  const [duration, setDuration] = useState("Within 1 day");

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [
    showPaysofterAccountFundPromise,
    setShowPaysofterAccountFundPromise,
  ] = useState(false);

  const handleShowPaysofterAccountFundPromise = () => {
    setShowPaysofterAccountFundPromise(true);
  };

  const handleInfoModalShow = () => {
    setShowInfoModal(true);
  };

  const handleInfoModalClose = () => {
    setShowInfoModal(false);
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <Container>
      {showPaysofterAccountFundPromise ? (
        <>
          <PaysofterAccountFundPromise
            currency={currency}
            amount={amount}
            email={email}
            duration={duration}
            paysofterPublicKey={paysofterPublicKey}
            onSuccess={onSuccess}
            onClose={onClose}
          />
        </>
      ) : (
        <Row className="justify-content-center">
          <Col>
            <Row className="text-center py-2">
              <Col md={10}>
                <h2 className="py-2 text-center">Paysofter Promise</h2>
              </Col>
              <Col md={2}>
                <Button
                  variant="outline"
                  onClick={handleInfoModalShow}
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Paysofter Promise option escrows or places in custody the received payment until a specified condition has been fulfilled before payment is transferred to the seller."
                >
                  <i className="fa fa-info-circle"> </i>
                </Button>

                <Modal show={showInfoModal} onHide={handleInfoModalClose}>
                  <Modal.Header closeButton>
                    <Modal.Title className="text-center w-100 py-2">
                      Paysofter Promise
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p className="text-center">
                      Paysofter Promise option escrows or places in custody the
                      payment made to a seller (using the payer's funded
                      Paysofter Account Fund) until a specified condition has
                      been fulfilled.{" "}
                      <a
                        href="https://paysofter.com/promise/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {" "}
                        <span>
                          <Button
                            variant="primary"
                            size="sm"
                            className="text-center py-2"
                          >
                            Learn more
                          </Button>
                        </span>
                      </a>
                    </p>
                  </Modal.Body>
                </Modal>
              </Col>
            </Row>

            <Form onSubmit={submitHandler}>
              <Form.Group controlId="currency">
                <Form.Label>Currency</Form.Label>
                <Select
                  value={{ value: currency, label: currency }}
                  isDisabled
                />
              </Form.Group>

              <Form.Group controlId="duration">
                <Form.Label>Expected Settlement Duration</Form.Label>
                <Select
                  options={durationChoices?.map(([value, label]) => ({
                    value,
                    label,
                  }))}
                  value={{ value: duration, label: duration }}
                  onChange={handleDurationChange}
                  placeholder="Select Duration"
                />
              </Form.Group>

              <div className="py-3 text-center">
                <Button
                  className="w-100 rounded"
                  type="submit"
                  variant="primary"
                  onClick={handleShowPaysofterAccountFundPromise}
                >
                  Submit{" "}
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default PaysofterPromise;
