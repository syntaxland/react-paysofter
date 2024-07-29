// ConfirmPaysofterPromise.js
import React, { useEffect } from "react";
import { 
  // useDispatch, 
  useSelector } from "react-redux";
import { Container, Row, Col, Button } from "react-bootstrap";
// import { clearCart } from "../../actions/cartActions";

const ConfirmPaysofterPromise = () => {
  // const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      window.location.href = "/login"; 
    }
  }, [userInfo]);

  const handleConfirmPromise = () => {
    // dispatch(clearCart());
    window.location.reload();
    window.location.href = "https://paysofter.com/promise/buyer";
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col>
          <Row className="text-center py-2">
            <Col>
              {/* <h2 className="py-2 text-center">Confirm Paysofter Promise</h2> */}
            </Col>
          </Row>

          <div className="py-2 text-center">
            <h3 className="py-2 mb-2">Promise successfully created! </h3>
            <p>
              Is Promise fulfilled? Check your email or login to your Paysofter
              account to check out the Promise status to confirm.
            </p>{" "}
            <span>
              <Button
                className="w-100 rounded"
                type="button"
                variant="primary"
                onClick={handleConfirmPromise}
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

export default ConfirmPaysofterPromise;
