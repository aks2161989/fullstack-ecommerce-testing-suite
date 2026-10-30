import React, { useEffect } from "react";
import "./shop-items.styles.scss";
import ShopItemCard from "../shop-item-card/shopItemCard.component";
import { connect } from "react-redux";
import { getProductByCategory } from "../../redux/producs/products.action";

const ShopItem = ({ product, match, getProductByCategory }) => {
  const catId = match && match.params ? match.params.catId : null;

  useEffect(() => {
    if (catId) {
      getProductByCategory(catId);
    }
  }, [catId, getProductByCategory]);

  return (
    <main className="products">
      {product &&
        product.items &&
        product.items.map((item) => (
          <ShopItemCard key={item._id || item.id} item={item} />
        ))}
    </main>
  );
};

const mapStateToProps = (state) => ({
  product: state.products.product[0],
});

export default connect(mapStateToProps, { getProductByCategory })(ShopItem);
