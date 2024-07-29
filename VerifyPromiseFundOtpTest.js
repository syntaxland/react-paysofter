// VerifyPromiseFundOtpTest.js
import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Loader from "./Loader";
import Message from "./Message";
import MessageFixed from "./MessageFixed";
import ConfirmPaysofterPromiseTest from "./ConfirmPaysofterPromiseTest";
import { generateRandomNum } from "./GenerateRandomNum";
import { PAYSOFTER_API_URL } from "./config/apiConfig";
import axios from "axios";

const VerifyPromiseFundOtpTest = ({
  email,
  amount,
  paysofterPublicKey,
  formattedPayerEmail,
  currency,
  duration,
  onSuccess,
}) => {
  const [otp, setOtp] = useState(generateRandomNum(6));
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [
    showConfirmPaysofterPromiseTest,
    setShowConfirmPaysofterPromiseTest,
  ] = useState(false);
  const [hasHandledSuccess, setHasHandledSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createdAt = new Date().toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });
  const paymentMethod = "Paysofter Promise";

  const sendOtpData =
    JSON.parse(localStorage.getItem("debitAccountData")) || [];

  const paysofterPromiseData = {
    email: email,
    amount: amount,
    public_api_key: paysofterPublicKey,
    account_id: sendOtpData.account_id,
    buyer_email: email,
    currency: currency,
    duration: duration,
    created_at: createdAt,
    payment_method: paymentMethod,
  };

  const handleCreatePromise = async (paysofterPromiseData) => {
    try {
      const response = await axios.post(
        `${PAYSOFTER_API_URL}/api/create-promise/`,
        paysofterPromiseData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleVerifyEmailOtp = async () => {
    console.log("handleVerifyEmailOtp test...");
    setLoading(true);
    setError(null);
    try {
      await handleCreatePromise(paysofterPromiseData);
      setShowSuccessMessage(true);
      setHasHandledSuccess(true);
      handleOnSuccess();

      localStorage.removeItem("debitAccountData");
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          error.message ||
          "Error creating promise"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmailOtp = () => {
    setResendLoading(true);
    setResendMessage("");
    try {
      setResendMessage(`OTP resent to ${formattedPayerEmail} successfully.`);
      setResendDisabled(true);
    } catch (error) {
      setResendMessage("Error resending OTP. Please try again.");
    }
    setResendLoading(false);
  };

  useEffect(() => {
    let timer;
    if (countdown > 0 && resendDisabled) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false);
    } else if (!resendDisabled) {
      setCountdown(60);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [countdown, resendDisabled]);

  const handleOnSuccess = useCallback(() => {
    onSuccess();
  }, [onSuccess]);

  useEffect(() => {
    if (hasHandledSuccess) {
      setTimeout(() => {
        setShowConfirmPaysofterPromiseTest(true);
        setShowSuccessMessage(false);
      }, 3000);
    }
  }, [hasHandledSuccess]);

  return (
    <Container>
      {showConfirmPaysofterPromiseTest ? (
        <ConfirmPaysofterPromiseTest />
      ) : (
        <Row className="justify-content-center text-center mt-5">
          <Col>
            <div className="border rounded p-4 py-2">
              <h1 className="py-2 text-center">Verify OTP ({currency})</h1>
              {showSuccessMessage && (
                <Message variant="success">
                  A test Promise transaction has been created successfully!
                </Message>
              )}

              {loading && <Loader />}
              {error && <Message variant="danger">{error}</Message>}

              {resendMessage && (
                <Message variant={resendLoading ? "info" : "success"}>
                  {resendMessage}
                </Message>
              )}
              <Form className="py-2">
                <Form.Group controlId="otp">
                  <Form.Control
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    required
                    disabled
                  />
                </Form.Group>
                <div className="py-3">
                  <Button
                    onClick={handleVerifyEmailOtp}
                    disabled={otp === "" || loading}
                    variant="success"
                    type="submit"
                    className="rounded"
                  >
                    Verify OTP
                  </Button>
                </div>
                <div className="py-2 d-flex justify-content-center">
                  {error && (
                    <MessageFixed variant="danger">{error}</MessageFixed>
                  )}
                </div>
              </Form>
              <p>OTP has been automatically generated for testing purposes.</p>
              <Button
                variant="link"
                type="submit"
                onClick={handleResendEmailOtp}
                disabled
              >
                {resendLoading
                  ? "Resending OTP..."
                  : resendDisabled
                  ? `Resend OTP (${countdown}sec)`
                  : "Resend OTP"}
              </Button>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default VerifyPromiseFundOtpTest;
