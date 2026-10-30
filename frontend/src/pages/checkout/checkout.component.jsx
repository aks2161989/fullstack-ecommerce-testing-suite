import React from "react";
import "./checkout.styles.scss";
import CheckoutItem from "../../components/checkout-item/checkout-item.component";
import StripeCheckoutButton from "../../components/stripe-button/stripe-button.component";
import { connect } from "react-redux";
import { selectCartTotal } from "../../redux/cart/cart.selectors";

const CheckoutPage = ({ cartItems, total }) => (
  <div className="checkout-page" role="region" aria-label="Checkout">
    <div className="checkout-header" role="row">
      <div className="header-block" role="columnheader">
        <span>Product</span>
      </div>

      <div className="header-block" role="columnheader">
        <span>Description</span>
      </div>

      <div className="header-block" role="columnheader">
        <span>Quantity</span>
      </div>

      <div className="header-block" role="columnheader">
        <span>Price</span>
      </div>

      <div className="header-block" role="columnheader">
        <span>Remove</span>
      </div>
    </div>
    {cartItems &&
      cartItems.map((cartItem) => (
        <CheckoutItem key={cartItem._id} cartItem={cartItem} />
      ))}

    <div className="total" role="status" aria-label="Total Price">
      <span>TOTAL : ${total}</span>
    </div>

    <StripeCheckoutButton price={total} />
  </div>
);

const mapStateToProps = (state) => ({
  cartItems: state.cart.cartItems,
  total: selectCartTotal(state.cart.cartItems),
});

export default connect(mapStateToProps)(CheckoutPage);
