// ConfirmPaysofterPromiseTest.js
import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

const ConfirmPaysofterPromiseTest = () => {
  const handleConfirmPromise = () => {
    window.location.reload();
    window.location.href = "https://paysofter.com/promise/buyer";
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col>
          <div className="py-2 text-center">
            <h3 className="py-2 mb-2">
              A Test Promise Transaction Successfully Created!{" "}
            </h3>
            <p>A test promoise transaction email has been sent to you.</p>{" "}
            <span>
              <Button
                className="w-100 rounded"
                type="button"
                variant="primary"
                onClick={handleConfirmPromise}
                disabled
              >
                Confirm Promise (at Paysofter)
              </Button>
            </span>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ConfirmPaysofterPromiseTest;
