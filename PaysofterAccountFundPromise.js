// PaysofterAccountFundPromise.js
import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Modal } from "react-bootstrap";
import VerifyAccountFundPromiseOtp from "./VerifyAccountFundPromiseOtp";
import Message from "./Message";
import MessageFixed from "./MessageFixed";
import Loader from "./Loader";
import { formatAmount } from "./FormatAmount";
import { PAYSOFTER_API_URL } from "./config/apiConfig";
import axios from "axios";

const PaysofterAccountFundPromise = ({
  email,
  amount,
  paysofterPublicKey,
  duration,
  currency,
  onSuccess,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formattedPayerEmail, setFormattedPayerEmail] = useState("");
  const [error, setError] = useState("");

  const [accountId, setAccountId] = useState("");
  const [accountIdError, setAccountIdError] = useState("");

  const [securityCode, setSecurityCode] = useState("");
  const [securityCodeError, setSecurityCodeError] = useState("");

  // const [formError, setFormError] = useState("");

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showAccountInfoModal, setShowAccountInfoModal] = useState(false);
  const [showSecurityCodeModal, setShowSecurityCodeModal] = useState(false);
  const [
    showVerifyAccountFundPromiseOtp,
    setShowVerifyAccountFundPromiseOtp,
  ] = useState(false);
  const [securityCodeVisible, setSecurityCodeVisible] = useState(false);

  const handleAccountInfoModalShow = () => {
    setShowAccountInfoModal(true);
  };

  const handleAccountInfoModalClose = () => {
    setShowAccountInfoModal(false);
  };

  const handleSecurityCodeModalShow = () => {
    setShowSecurityCodeModal(true);
  };

  const handleSecurityCodeModalClose = () => {
    setShowSecurityCodeModal(false);
  };

  const toggleSecurityCodeVisibility = () => {
    setSecurityCodeVisible(!securityCodeVisible);
  };

  const handleInfoModalShow = () => {
    setShowInfoModal(true);
  };

  const handleInfoModalClose = () => {
    setShowInfoModal(false);
  };

  const handleFieldChange = (fieldName, value) => {
    switch (fieldName) {
      case "accountId":
        setAccountId(value);
        setAccountIdError("");
        break;

      case "securityCode":
        setSecurityCode(value);
        setSecurityCodeError("");
        break;

      default:
        break;
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!accountId) {
      setAccountIdError("Please enter Account ID.");
      return;
    }

    if (!securityCode) {
      setSecurityCodeError("Please enter Security Code.");
      return;
    }

    const debitAccountData = {
      account_id: accountId,
      security_code: securityCode,
      amount: amount,
      currency: currency,
      public_api_key: paysofterPublicKey,
    };

    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(
        `${PAYSOFTER_API_URL}/api/send-debit-fund-account-otp/`,
        debitAccountData
      );

      setSuccess(true);
      setFormattedPayerEmail(data.formattedPayerEmail);

      localStorage.setItem(
        "debitAccountData",
        JSON.stringify(debitAccountData)
      );
    } catch (error) {
      setError(
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setShowVerifyAccountFundPromiseOtp(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <>
      {showVerifyAccountFundPromiseOtp ? (
        <VerifyAccountFundPromiseOtp
          amount={amount}
          paysofterPublicKey={paysofterPublicKey}
          email={email}
          securityCode={securityCode}
          accountId={accountId}
          formattedPayerEmail={formattedPayerEmail}
          currency={currency}
          duration={duration}
          onSuccess={onSuccess}
          onClose={onClose}
        />
      ) : (
        <Row className="justify-content-center">
          <Col>
            <Row className="text-center py-2">
              <Col md={10}>
                <h2 className="py-2 text-center">
                  Paysofter Account Fund (NGN)
                </h2>
              </Col>
              <Col md={2}>
                <Button
                  variant="outline"
                  onClick={handleAccountInfoModalShow}
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Paysofter Account Fund option settles payments using the user's funded Paysofter Account Fund."
                >
                  <i className="fa fa-info-circle"> </i>
                </Button>

                <Modal
                  show={showAccountInfoModal}
                  onHide={handleAccountInfoModalClose}
                >
                  <Modal.Header closeButton>
                    <Modal.Title className="text-center w-100 py-2">
                      Paysofter Account Fund
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p className="text-center">
                      Paysofter Account Fund option settles payments using the
                      payer's funded Paysofter Account Fund.{" "}
                      <a
                        href="https://paysofter.com/"
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

            {success && (
              <Message variant="success">
                OTP sent to your email {formattedPayerEmail} successfully.
              </Message>
            )}

            {error && <Message variant="danger">{error}</Message>}
            {loading && <Loader />}

            {/* {formError && <Message variant="danger">{formError}</Message>} */}

            <Form>
              <Form.Group controlId="accountId">
                <Form.Label>Account ID</Form.Label>

                <Row className="text-center py-2">
                  <Col md={10}>
                    <Form.Control
                      type="text"
                      placeholder="Enter Paysofter Account ID"
                      value={accountId}
                      onChange={(e) =>
                        handleFieldChange("accountId", e.target.value)
                      }
                      maxLength={12}
                    />
                  </Col>
                  <Col md={2}>
                    <Button
                      variant="outline"
                      onClick={handleInfoModalShow}
                      data-toggle="tooltip"
                      data-placement="top"
                      title="A uniquely assigned 12-digit Paysofter Account ID. Don't have a Paysofter account? Click here."
                    >
                      <i className="fa fa-info-circle"> </i>
                    </Button>

                    <Modal show={showInfoModal} onHide={handleInfoModalClose}>
                      <Modal.Header closeButton>
                        <Modal.Title className="text-center w-100 py-2">
                          Paysofter Account ID
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <p className="text-center">
                          A uniquely assigned 12-digit Paysofter Account ID.
                          Don't have a Paysofter account? You're just about 3
                          minutes away!{" "}
                          <a
                            href="https://paysofter.com/"
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
                                Create A Free Account
                              </Button>
                            </span>
                          </a>
                        </p>
                      </Modal.Body>
                    </Modal>
                  </Col>
                </Row>
                <Form.Text className="text-danger">{accountIdError}</Form.Text>
              </Form.Group>

              <Form.Group controlId="securityCode">
                <Form.Label>Security Code</Form.Label>
                <Row className="text-center py-2">
                  <Col md={10}>
                    <Form.Control
                      type={securityCodeVisible ? "text" : "password"}
                      placeholder="Enter Account Security Code"
                      value={securityCode}
                      onChange={(e) =>
                        handleFieldChange("securityCode", e.target.value)
                      }
                      maxLength={4}
                    />
                  </Col>
                  <Col md={2}>
                    <Button
                      variant="outline"
                      onClick={handleSecurityCodeModalShow}
                      data-toggle="tooltip"
                      data-placement="top"
                      title="A 4-digit randomly generated Paysofter Account Security Code that expires at a given time  (e.g. every hour). Having issue applying the security code? Refresh your paysofter account page, logout and login or clear browsing data."
                    >
                      <i className="fa fa-info-circle"> </i>
                    </Button>

                    <Modal
                      show={showSecurityCodeModal}
                      onHide={handleSecurityCodeModalClose}
                    >
                      <Modal.Header closeButton>
                        <Modal.Title className="text-center w-100 py-2">
                          Paysofter Account Security Code
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <p className="text-center">
                          A 4-digit randomly generated Paysofter Account
                          Security Code that expires at a given time (e.g. every
                          hour). Having issue applying the security code?
                          Refresh your paysofter account page, logout and login
                          or clear browsing data.{" "}
                          <a
                            href="https://paysofter.com/"
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
                                Learn More
                              </Button>
                            </span>
                          </a>
                        </p>
                      </Modal.Body>
                    </Modal>
                  </Col>
                  <span className="d-flex justify-content-left">
                    <Button
                      variant="outline"
                      className="rounded"
                      size="sm"
                      onClick={toggleSecurityCodeVisibility}
                    >
                      {securityCodeVisible ? (
                        <span>
                          <i className="fa fa-eye-slash"></i> Hide
                        </span>
                      ) : (
                        <span>
                          <i className="fa fa-eye"></i> Show
                        </span>
                      )}
                    </Button>
                  </span>
                </Row>
                <Form.Text className="text-danger">
                  {securityCodeError}
                </Form.Text>
              </Form.Group>

              <div className="py-3 text-center">
                <Button
                  className="w-100 rounded"
                  type="submit"
                  variant="primary"
                  onClick={submitHandler}
                  disabled={loading}
                >
                  Pay{" "}
                  <span>
                    ({formatAmount(amount)} {currency})
                  </span>
                </Button>
              </div>
              <div className="py-2 d-flex justify-content-center">
                {error && <MessageFixed variant="danger">{error}</MessageFixed>}
              </div>
            </Form>
          </Col>
        </Row>
      )}
    </>
  );
};

export default PaysofterAccountFundPromise;
