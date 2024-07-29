// CardPaymentTest.js
import React, { useState, useEffect, useCallback } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { MONTH_CHOICES, YEAR_CHOICES } from "./payment-constants";
import Message from "./Message";
import MessageFixed from "./MessageFixed";
import Loader from "./Loader";
import { formatAmount } from "./FormatAmount";
import { PAYSOFTER_API_URL } from "./config/apiConfig";
import axios from "axios";
import { generateRandomNum } from "./GenerateRandomNum";

function CardPaymentTest({
  amount,
  currency,
  email,
  paysofterPublicKey,
  onSuccess,
  onClose,
  payment_id,
}) {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [hasHandledSuccess, setHasHandledSuccess] = useState(false);

  const [monthChoices, setMonthChoices] = useState([]);
  const [yearChoices, setYearChoices] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMonthChoices(MONTH_CHOICES);
    setYearChoices(YEAR_CHOICES);
  }, []);

  const [cardType, setCardType] = useState("");
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: generateRandomNum(16),
    expirationMonth: "12",
    expirationYear: "2026",
    cvv: generateRandomNum(3),
  });

  const [cvvVisible, setCvvVisible] = useState(false);
  const toggleCvvVisibility = () => setCvvVisible(!cvvVisible);

  const formatCard = (value) => {
    return value
      .replace(/\s?/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim();
  };

  const handlePaymentDetailsChange = (name, value) => {
    if (name === "cardNumber") {
      value = formatCard(value);
      let detectedCardType = "";
      if (/^4/.test(value)) {
        detectedCardType = "Visa";
      } else if (/^5[1-5]/.test(value)) {
        detectedCardType = "Mastercard";
      }
      setCardType(detectedCardType);
    }

    setPaymentDetails({ ...paymentDetails, [name]: value });
  };

  const isFormValid = () => {
    return (
      paymentDetails.cardNumber &&
      paymentDetails.expirationMonth &&
      paymentDetails.expirationYear &&
      paymentDetails.cvv
    );
  };

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
  const paymentMethod = "Debit Card";

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const paysofterPaymentData = {
      payment_id: payment_id,
      buyer_email: email,
      currency: currency,
      amount: amount,
      public_api_key: paysofterPublicKey,
      created_at: createdAt,
      payment_method: paymentMethod,

      card_number: paymentDetails.cardNumber,
      expiration_month: paymentDetails.expirationMonth,
      expiration_year: paymentDetails.expirationYear,
      cvv: paymentDetails.cvv,
    };

    try {
      const { data } = await axios.post(
        `${PAYSOFTER_API_URL}/api/initiate-transaction/`,
        paysofterPaymentData
      );
      console.log(data);
      setShowSuccessMessage(true);
      setTimeout(() => {
        handleOnClose();
        setShowSuccessMessage(false);
      }, 3000);
      handleOnSuccess();
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

  const handleOnSuccess = useCallback(() => {
    onSuccess();
  }, [onSuccess]);

  const handleOnClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (showSuccessMessage && !hasHandledSuccess) {
      setHasHandledSuccess(true);
    }
  }, [showSuccessMessage, hasHandledSuccess]);

  return (
    <div>
      <h2 className="py-2 text-center">Debit Card</h2>

      {showSuccessMessage && (
        <Message variant="success">Payment made successfully.</Message>
      )}

      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}

      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label>Card Number</Form.Label>
          <Form.Control
            type="text"
            name="cardNumber"
            value={paymentDetails.cardNumber}
            onChange={(e) =>
              handlePaymentDetailsChange("cardNumber", e.target.value)
            }
            required
            placeholder="1234 5678 9012 3456"
            maxLength="19"
            disabled
          />
        </Form.Group>
        {cardType && (
          <p>
            Detected Card Type: {cardType}
            {cardType === "Visa " && <i className="fab fa-cc-visa"></i>}
            {cardType === "Mastercard " && (
              <i className="fab fa-cc-mastercard"></i>
            )}
          </p>
        )}
        <i className="fab fa-cc-mastercard"></i>{" "}
        <i className="fab fa-cc-visa"></i>
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Expiration Month</Form.Label>
              <Select
                options={monthChoices?.map(([value, label]) => ({
                  value,
                  label,
                }))}
                onChange={(selectedOption) =>
                  handlePaymentDetailsChange(
                    "expirationMonth",
                    selectedOption.value
                  )
                }
                value={{
                  value: paymentDetails.expirationMonth,
                  label: paymentDetails.expirationMonth,
                }}
                placeholder="Select Month"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Expiration Year</Form.Label>
              <Select
                options={yearChoices?.map(([value, label]) => ({
                  value,
                  label,
                }))}
                value={{
                  value: paymentDetails.expirationYear,
                  label: paymentDetails.expirationYear,
                }}
                onChange={(selectedOption) =>
                  handlePaymentDetailsChange(
                    "expirationYear",
                    selectedOption.value
                  )
                }
                placeholder="Select Year"
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group>
          <Form.Label>CVV</Form.Label>
          <Form.Control
            type={cvvVisible ? "text" : "password"}
            name="cvv"
            value={paymentDetails.cvv}
            onChange={(e) => handlePaymentDetailsChange("cvv", e.target.value)}
            required
            maxLength="3"
            placeholder="123"
            disabled
          />
        </Form.Group>
        <span className="d-flex justify-content-end">
          <Button
            variant="outline"
            className="rounded"
            size="sm"
            onClick={toggleCvvVisibility}
          >
            {cvvVisible ? (
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
        <div className="text-center w-100  mt-3 py-2">
          <Button
            className="w-100 rounded"
            variant="primary"
            type="submit"
            disabled={!isFormValid() || loading}
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
    </div>
  );
}

export default CardPaymentTest;
