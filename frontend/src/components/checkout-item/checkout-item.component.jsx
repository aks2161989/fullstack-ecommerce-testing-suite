import React from "react";
import "./checkout-item.styles.scss";
import { connect } from "react-redux";
import {
  clearItemFromCart,
  addItem,
  removeItem,
} from "../../redux/cart/cart.action";

const CheckoutItem = ({ cartItem, clearItem, addItem, removeItem }) => {
  const { imageUrl, price, name, quantity } = cartItem;
  return (
    <article className="checkout-item" role="row" aria-label={name}>
      <div className="image-container">
        <img src={imageUrl} alt={name} />
      </div>
      <span className="name">{name}</span>
      <span className="quantity">
        <button
          type="button"
          className="arrow"
          role="button"
          aria-label={`Decrease quantity of ${name}`}
          onClick={() => removeItem(cartItem)}
          style={{ background: "none", border: "none", cursor: "pointer", font: "inherit" }}
        >
          &#10094;
        </button>
        <span className="value" aria-label={`Quantity of ${name}`}>{quantity}</span>
        <button
          type="button"
          className="arrow"
          role="button"
          aria-label={`Increase quantity of ${name}`}
          onClick={() => addItem(cartItem)}
          style={{ background: "none", border: "none", cursor: "pointer", font: "inherit" }}
        >
          &#10095;
        </button>
      </span>

      <span className="price" aria-label={`Price of ${name}`}>$ {price}</span>
      <button
        type="button"
        className="remove-button"
        role="button"
        aria-label={`Remove ${name} from cart`}
        onClick={() => clearItem(cartItem)}
        style={{ background: "none", border: "none", cursor: "pointer", font: "inherit" }}
      >
        &#10005;
      </button>
    </article>
  );
};

const mapDispatchToProps = (dispatch) => ({
  clearItem: (item) => dispatch(clearItemFromCart(item)),
  addItem: (item) => dispatch(addItem(item)),
  removeItem: (item) => dispatch(removeItem(item)),
});

export default connect(null, mapDispatchToProps)(CheckoutItem);
