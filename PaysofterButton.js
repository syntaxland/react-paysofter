// PaysofterButton.js
import React, { useState } from "react";
import { Button, Modal, Row, Col } from "react-bootstrap";
import CardPayment from "./CardPayment";
import PaysofterAccountFund from "./PaysofterAccountFund";
import PaysofterPromise from "./PaysofterPromise";
import UssdPayment from "./UssdPayment";
import BankPayment from "./BankPayment";
import TransferPayment from "./TransferPayment";
import QrPayment from "./QrPayment";
import "./Paysofter.css";
import { formatAmount } from "./FormatAmount";
import logoImage from "./images/logo.png";
import "./Paysofter.css";

function PaysofterButton({
  amount,
  currency,
  email,
  paysofterPublicKey,
  onSuccess,
  onClose,
  payment_id,
  showPaymentModal,
  setShowPaymentModal,
  showFundOption,
  showCardOption,
  showPromiseOption,
}) {
  const getDefaultPaymentOption = () => {
    if (showPromiseOption) return "promise";
    if (showCardOption) return "card";
    if (showFundOption) return "fund";
    return "promise";
  };

  const [selectedPaymentOption, setSelectedPaymentOption] = useState(
    getDefaultPaymentOption()
  );

  // const [showMoreOptions, setShowMoreOptions] = useState(false);

  const handlePaymentOptionChange = (option) => {
    setSelectedPaymentOption(option);
  };

  // const handleMoreOptions = () => {
  //   setShowMoreOptions(!showMoreOptions);
  // };

  const handleOnClosePayment = () => {
    console.log("onClose called!");
    setShowPaymentModal(false);
    onClose();
  };

  return (
    <div>
      <Modal
        show={showPaymentModal}
        onHide={handleOnClosePayment}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <div className="text-center w-100 py-2">
            <div className="py-2">
              <img
                src={logoImage}
                alt="Paysofter"
                style={{
                  maxHeight: "40px",
                  maxWidth: "80px",
                  height: "auto",
                  width: "auto",
                }}
              />
            </div>
            <Modal.Title>
              Paysofter <span className="live-mode">Live</span>
            </Modal.Title>
            <div>{email}</div>
            <div>
              {formatAmount(amount)} {currency}
            </div>
          </div>
        </Modal.Header>

        {/* {loading && <Loader />}
        {error && <Message variant="danger">{error}</Message>} */}

        <Modal.Body>
          <Row>
            <Col md={3}>
              <div className="text-center">
                <p>Options</p>

                {showPromiseOption && (
                  <div className="py-1">
                    <Button
                      variant="primary"
                      onClick={() => handlePaymentOptionChange("promise")}
                      className={
                        selectedPaymentOption === "promise" ? "active" : ""
                      }
                    >
                      <i className="fas fa-money-bill-wave"></i> Paysofter
                      Promise
                    </Button>
                  </div>
                )}

                {showCardOption && (
                  <div className="py-1">
                    <Button
                      variant="outline-primary"
                      onClick={() => handlePaymentOptionChange("card")}
                      className={
                        selectedPaymentOption === "card" ? "active" : ""
                      }
                    >
                      <i className="fas fa-credit-card"></i> Debit Card
                    </Button>{" "}
                  </div>
                )}

                {showFundOption && (
                  <div className="py-1">
                    <Button
                      variant="outline-primary"
                      onClick={() => handlePaymentOptionChange("fund")}
                      className={
                        selectedPaymentOption === "fund" ? "active" : ""
                      }
                    >
                      <i className="fas fa-money-bill-alt"></i> Paysofter
                      Account Fund
                    </Button>
                  </div>
                )}

                {/* <div className="py-1">
                  <Button
                    variant="outline-primary"
                    onClick={() => handlePaymentOptionChange("card")}
                    className={selectedPaymentOption === "card" ? "active" : ""}
                    // disabled={showCardOption ? true}
                  >
                    <i className="fas fa-credit-card"></i> Debit Card
                  </Button>{" "}
                </div>

                <div className="py-1">
                  <Button
                    variant="outline-primary"
                    onClick={() => handlePaymentOptionChange("fund")}
                    className={
                      selectedPaymentOption === "fund" ? "active" : ""
                    }
                    // disabled
                  >
                    <i className="fas fa-money-bill-alt"></i> Paysofter Account
                    Fund
                  </Button>
                </div> */}

                {/* <div className="py-1">
                  <Button
                    variant="primary"
                    onClick={() => handlePaymentOptionChange("promise")}
                    className={
                      selectedPaymentOption === "promise" ? "active" : ""
                    }
                  >
                    <i className="fas fa-money-bill-wave"></i> Paysofter Promise
                  </Button>
                </div> */}

                {/* {currency === "USD" && (
                   <div className="py-1">
                   <Button
                     variant="outline-primary"
                     onClick={() => handlePaymentOptionChange("usd-promise")}
                     className={
                       selectedPaymentOption === "usd-promise" ? "active" : ""
                     }
                   >
                     <i className="fas fa-money-bill-wave"></i> Paysofter Promise
                   </Button>
                 </div>
                )} */}

                {/* <div className="text-center py-2">
                  <Button
                    variant="outline-primary"
                    onClick={handleMoreOptions}
                    className="rounded"
                    // disabled
                  >
                    <i className="fas fa-bars"></i> More Options
                  </Button>
                </div> */}

                {/* {showMoreOptions && (
                  <>
                    <div className="py-1">
                      <Button
                        variant="outline-primary"
                        onClick={() => handlePaymentOptionChange("transfer")}
                        className={
                          selectedPaymentOption === "transfer" ? "active" : ""
                        }
                      >
                        <i className="fa fa-exchange"></i> Transfer
                      </Button>
                    </div>

                    <div className="py-1">
                      <Button
                        variant="outline-primary"
                        onClick={() => handlePaymentOptionChange("bank")}
                        className={
                          selectedPaymentOption === "bank" ? "active" : ""
                        }
                      >
                        <i className="fas fa-bank"></i> Bank
                      </Button>
                    </div>

                    <div className="py-1">
                      <Button
                        variant="outline-primary"
                        onClick={() => handlePaymentOptionChange("ussd")}
                        className={
                          selectedPaymentOption === "ussd" ? "active" : ""
                        }
                      >
                        <i className="fa fa-mobile"></i> USSD
                      </Button>{" "}
                    </div>

                    <div className="py-1">
                      <Button
                        variant="outline-primary"
                        onClick={() => handlePaymentOptionChange("qr")}
                        className={
                          selectedPaymentOption === "qr" ? "active" : ""
                        }
                      >
                        <i className="fa fa-qrcode"></i> Visa QR
                      </Button>{" "}
                    </div>
                  </>
                )} */}
              </div>
            </Col>

            <Col md={9}>
              {selectedPaymentOption === "promise" && (
                <PaysofterPromise
                  amount={amount}
                  currency={currency}
                  email={email}
                  paysofterPublicKey={paysofterPublicKey}
                  onSuccess={onSuccess}
                  onClose={handleOnClosePayment}
                  payment_id={payment_id}
                />
              )}

              {selectedPaymentOption === "card" && (
                <CardPayment
                  amount={amount}
                  currency={currency}
                  email={email}
                  paysofterPublicKey={paysofterPublicKey}
                  onSuccess={onSuccess}
                  onClose={handleOnClosePayment}
                  payment_id={payment_id}
                />
              )}

              {selectedPaymentOption === "fund" && (
                <PaysofterAccountFund
                  amount={amount}
                  currency={currency}
                  email={email}
                  paysofterPublicKey={paysofterPublicKey}
                  onSuccess={onSuccess}
                  onClose={handleOnClosePayment}
                  payment_id={payment_id}
                />
              )}

              {selectedPaymentOption === "bank" && <BankPayment />}
              {selectedPaymentOption === "transfer" && <TransferPayment />}
              {selectedPaymentOption === "ussd" && <UssdPayment />}
              {selectedPaymentOption === "qr" && <QrPayment />}
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default PaysofterButton;
