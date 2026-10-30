import React from "react";
import CustomButton from "../custom-button/custom-button.component";

const StripeCheckoutButton = ({ price }) => {
  const onPay = () => {
    alert("Payment Successful");
  };

  return (
    <CustomButton
      onClick={onPay}
      aria-label="Pay Now with Stripe"
    >
      PAY NOW
    </CustomButton>
  );
};

export default StripeCheckoutButton;
