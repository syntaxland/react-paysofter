// Paysofter.js
import React, { useEffect, useState } from "react";
import { Row, Col, Modal } from "react-bootstrap";
import axios from "axios";
import PaysofterButton from "./PaysofterButton";
import PaysofterButtonTest from "./PaysofterButtonTest";
import Loader from "./Loader";
import MessageFixed from "./MessageFixed";
import { PAYSOFTER_API_URL } from "./config/apiConfig";

export function Paysofter({
  amount,
  currency,
  email,
  paysofterPublicKey,
  onSuccess,
  onClose,
  payment_id,
  showFundOption,
  showCardOption,
  showPromiseOption,
}) {
  const [apiKeyStatus, setApiKeyStatus] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApiKeyStatus = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${PAYSOFTER_API_URL}/api/get-api-key-status/`,
          {
            public_api_key: paysofterPublicKey,
          }
        );

        const data = response.data;
        console.log("data:", data);
        console.log("response.data:", response.data);

        if (response.status === 200) {
          setApiKeyStatus(data.api_key_status);
          setShowPaymentModal(true);

          console.log("api_key_status:", data.api_key_status);
          setSuccess(true);
        } else {
          setError(data.detail || "Unexpected response from server.");
        }
      } catch (error) {
        setError(
          error.response?.data?.detail ||
            error.MessageFixed ||
            "Error fetching API key status"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApiKeyStatus();
  }, [paysofterPublicKey]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setLoading(false);
        setError(null);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleClose = () => {
    setError(null);
    setLoading(false);
  };

  return (
    <>
      {(loading || error) && (
        <Modal show={loading || error} onHide={handleClose} backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title className="text-center w-100 py-2">
              {loading ? "Loading..." : "Error!"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex justify-content-center text-center w-100 py-2">
            {loading && <Loader />}
            {error && <MessageFixed variant="danger">{error}</MessageFixed>}
          </Modal.Body>
        </Modal>
      )}
      {!loading && !error && (
        <Row>
          <div className="d-flex justify-content-center">
            <Col md={8}>
              <div>
                {apiKeyStatus === "live" && (
                  <PaysofterButton
                    amount={amount}
                    email={email}
                    currency={currency}
                    paysofterPublicKey={paysofterPublicKey}
                    onSuccess={onSuccess}
                    onClose={onClose}
                    payment_id={payment_id}
                    showPaymentModal={showPaymentModal}
                    setShowPaymentModal={setShowPaymentModal}
                    showPromiseOption={showPromiseOption}
                    showFundOption={showFundOption}
                    showCardOption={showCardOption}
                  />
                )}
              </div>
              <div>
                {apiKeyStatus === "test" && (
                  <PaysofterButtonTest
                    amount={amount}
                    email={email}
                    currency={currency}
                    paysofterPublicKey={paysofterPublicKey}
                    onSuccess={onSuccess}
                    onClose={onClose}
                    showPaymentModal={showPaymentModal}
                    setShowPaymentModal={setShowPaymentModal}
                    showPromiseOption={showPromiseOption}
                    showFundOption={showFundOption}
                    showCardOption={showCardOption}
                  />
                )}
              </div>
            </Col>
          </div>
        </Row>
      )}
    </>
  );
}
