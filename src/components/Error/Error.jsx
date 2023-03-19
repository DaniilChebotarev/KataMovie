import React from "react";
import { Alert } from "antd";

function ErrorIndicator() {
  return (
    <Alert message="Что-то пошло не так" type="error" showIcon />
  );
}

export default ErrorIndicator;