// VerifyUsdAccountFundPromiseOtp.js
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  debitPaysofterUsdAccountFund,
  verifyUsdPromiseOtp,
  createPaysofterPromise,
  resetDebitPaysofterUsdState,
  resetVerifyUsdOtpState,
  resetCreatePaysofterPromiseState,
} from "../../actions/paymentActions";
import { useHistory } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Loader from "../Loader";
import Message from "../Message";
import ConfirmPaysofterPromise from "./ConfirmPaysofterPromise";

const VerifyUsdAccountFundPromiseOtp = ({
  email,
  amount,
  paysofterPublicKey,
  formattedPayerEmail,
  currency,
  duration,
  onSuccess,
  // onClose,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [otp, setOtp] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const createdAt = new Date().toISOString();
  const [
    showConfirmPaysofterPromise,
    setShowConfirmPaysofterPromise,
  ] = useState(false);
  const [hasHandledSuccess, setHasHandledSuccess] = useState(false);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      window.location.href = "/login";
    }
  }, [userInfo]);

  const otpVerifyUsdPromiseState = useSelector(
    (state) => state.otpVerifyUsdPromiseState
  );
  const { loading, success, error } = otpVerifyUsdPromiseState;

  const createPaysofterPromiseState = useSelector(
    (state) => state.createPaysofterPromiseState
  );
  const {
    loading: promiseLoading,
    success: promiseSuccess,
    error: promiseError,
  } = createPaysofterPromiseState;

  // console.log("formattedPayerEmail:", formattedPayerEmail);

  const sendOtpData =
    JSON.parse(localStorage.getItem("debitUsdAccountData")) || [];
  // console.log("sendOtpData:", sendOtpData, sendOtpData.account_id);

  const otpData = {
    otp: otp,
    account_id: sendOtpData.account_id,
    amount: amount,
    currency: currency,
    public_api_key: paysofterPublicKey,
  };

  const debitUsdAccountData = {
    account_id: sendOtpData.account_id,
    security_code: sendOtpData.security_code,
    amount: amount,
  };

  const paysofterPromiseData = {
    email: email,
    amount: amount,
    public_api_key: paysofterPublicKey,
    account_id: sendOtpData.account_id,
    currency: currency,
    duration: duration,
    created_at: createdAt,
  };

  const handleVerifyEmailOtp = () => {
    dispatch(verifyUsdPromiseOtp(otpData));
  };

  const handleResendEmailOtp = () => {
    setResendLoading(true);
    setResendMessage("");
    try {
      dispatch(
        debitPaysofterUsdAccountFund(JSON.stringify(debitUsdAccountData))
      );
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
    if (success) {
      dispatch(createPaysofterPromise(paysofterPromiseData));
    }
    // eslint-disable-next-line
  }, [dispatch, success, history]);

  useEffect(() => {
    if (promiseSuccess && !hasHandledSuccess) {
      setHasHandledSuccess(true);
      setShowSuccessMessage(true);
      handleOnSuccess();
      console.log("onSuccess dispatched2");
      setTimeout(() => {
        setShowConfirmPaysofterPromise(true);
        setShowSuccessMessage(false);
        dispatch(resetDebitPaysofterUsdState());
        dispatch(resetVerifyUsdOtpState());
        dispatch(resetCreatePaysofterPromiseState());
        localStorage.removeItem("debitAccountData");
      }, 3000);
    }
  }, [
    dispatch,
    promiseSuccess,
    promiseError,
    handleOnSuccess,
    hasHandledSuccess,
  ]);

  return (
    <Container>
      {showConfirmPaysofterPromise ? (
        <ConfirmPaysofterPromise />
      ) : (
        <Row className="justify-content-center text-center mt-5">
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
                    type="submit"
                    className="rounded"
                  >
                    Verify OTP
                  </Button>
                </div>
              </Form>
              <p>
                OTP has been sent to your email {formattedPayerEmail} for
                Paysofter Account ID: {sendOtpData.account_id} and expires in 10
                minutes. It might take a few seconds to deliver.
              </p>
              <Button
                variant="link"
                type="submit"
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

export default VerifyUsdAccountFundPromiseOtp;
