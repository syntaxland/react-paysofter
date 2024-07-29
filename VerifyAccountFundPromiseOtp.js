// VerifyAccountFundPromiseOtp.js
import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Loader from "./Loader";
import Message from "./Message";
import MessageFixed from "./MessageFixed";
import ConfirmPaysofterPromise from "./ConfirmPaysofterPromise";
import { PAYSOFTER_API_URL } from "./config/apiConfig";
import axios from "axios";

const VerifyAccountFundPromiseOtp = ({
  email,
  amount,
  paysofterPublicKey,
  formattedPayerEmail,
  currency,
  duration,
  onSuccess,
}) => {
  const [otp, setOtp] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
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
  const [
    showConfirmPaysofterPromise,
    setShowConfirmPaysofterPromise,
  ] = useState(false);
  const [hasHandledSuccess, setHasHandledSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [promiseLoading, setPromiseLoading] = useState(false);
  const [promiseSuccess, setPromiseSuccess] = useState(false);
  const [promiseError, setPromiseError] = useState("");

  const sendOtpData =
    JSON.parse(localStorage.getItem("debitAccountData")) || [];

  const otpData = {
    otp: otp,
    account_id: sendOtpData.account_id,
    amount: amount,
    currency: currency,
    public_api_key: paysofterPublicKey,
    created_at: createdAt,
  };

  const debitAccountData = {
    account_id: sendOtpData.account_id,
    security_code: sendOtpData.security_code,
    amount: amount,
    public_api_key: paysofterPublicKey,
    created_at: createdAt,
  };

  const handleVerifyEmailOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(
        `${PAYSOFTER_API_URL}/api/verify-otp/`,
        otpData
      );
      console.log(data);
      setSuccess(true);
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

  const handleResendEmailOtp = async () => {
    setResendLoading(true);
    setResendMessage("");

    try {
      await axios.post(
        `${PAYSOFTER_API_URL}/api/send-debit-fund-account-otp/`,
        debitAccountData
      );

      setResendMessage(`OTP resent to ${formattedPayerEmail} successfully.`);
      setResendDisabled(true);
    } catch (error) {
      setResendMessage("Error resending OTP. Please try again.");
    } finally {
      setResendLoading(false);
    }
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
    if (success) {
      const createPaysofterPromise = async () => {
        setPromiseLoading(true);
        setPromiseError("");

        try {
          const paysofterPromiseData = {
            email: email,
            amount: amount,
            public_api_key: paysofterPublicKey,
            account_id: sendOtpData.account_id,
            currency: currency,
            duration: duration,
            created_at: createdAt,
            payment_method: paymentMethod,
          };

          const { data } = await axios.post(
            `${PAYSOFTER_API_URL}/api/create-promise/`,
            paysofterPromiseData
          );
          console.log(data);
          setPromiseSuccess(true);
        } catch (error) {
          setPromiseError(
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message
          );
        } finally {
          setPromiseLoading(false);
        }
      };

      createPaysofterPromise();
    }
  }, [
    success,
    email,
    amount,
    paysofterPublicKey,
    sendOtpData.account_id,
    currency,
    duration,
    createdAt,
    paymentMethod,
  ]);

  useEffect(() => {
    if (promiseSuccess && !hasHandledSuccess) {
      setHasHandledSuccess(true);
      setShowSuccessMessage(true);
      handleOnSuccess();
      setTimeout(() => {
        setShowConfirmPaysofterPromise(true);
        setShowSuccessMessage(false);
        localStorage.removeItem("debitAccountData");
      }, 3000);
    }
  }, [promiseSuccess, handleOnSuccess, hasHandledSuccess]);

  return (
    <Container>
      {showConfirmPaysofterPromise ? (
        <ConfirmPaysofterPromise />
      ) : (
        <Row className="d-flex justify-content-center text-center mt-5">
          <Col>
            <div className="border rounded p-4 py-2">
              <h1 className="py-2 text-center">Verify OTP ({currency})</h1>
              {showSuccessMessage && (
                <Message variant="success">Promise sent successfully!</Message>
              )}

              {loading && <Loader />}
              {error && <Message variant="danger">{error}</Message>}

              {promiseLoading && <Loader />}
              {promiseError && (
                <Message variant="danger">{promiseError}</Message>
              )}

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
                  />
                </Form.Group>
                <div className="py-3">
                  <Button
                    onClick={handleVerifyEmailOtp}
                    disabled={otp === "" || loading || success}
                    variant="success"
                    type="button"
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
              <p>
                OTP has been sent to your email {formattedPayerEmail} for
                Paysofter Account ID: {sendOtpData.account_id} and expires in 10
                minutes. It might take a few seconds to deliver.
              </p>
              <Button
                variant="link"
                type="button"
                disabled={resendDisabled || resendLoading}
                onClick={handleResendEmailOtp}
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

export default VerifyAccountFundPromiseOtp;
