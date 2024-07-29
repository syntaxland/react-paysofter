// Message.js
import React, { useState, useEffect } from "react";
import {
  Alert,
  CloseButton
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationTriangle,
  faInfoCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

const Message = ({ variant, children, fixed }) => {
  const [showMessage, setShowMessage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const messageStyle = {
    position: fixed ? "fixed" : "relative",
    top: fixed ? 80 : null,
    transform: fixed ? null : null,
  };

  const getIcon = (variant) => {
    switch (variant) {
      case "success":
        return faCheckCircle;
      case "danger":
        return faTimesCircle;
      case "warning":
        return faExclamationTriangle;
      case "info":
        return faInfoCircle;
      default:
        return faInfoCircle;
    }
  };

  return showMessage ? (
    <div
      style={messageStyle}
      className="d-flex justify-content-center text-center py-2"
    >
      <Alert
        className="rounded w-100"
        variant={variant}
        onClose={() => setShowMessage(false)}
        dismissible
      >
        <div className="d-flex justify-content-between align-items-center w-100">
          <FontAwesomeIcon icon={getIcon(variant)} className="me-2" />
          {children}
          <CloseButton onClick={() => setShowMessage(false)} />
        </div>
      </Alert>
    </div>
  ) : null;
};

export default Message;
