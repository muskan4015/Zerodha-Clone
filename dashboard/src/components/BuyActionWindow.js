import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { API_URL } from "../api";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";
import { useAuth } from "../hooks/useAuth";

const BuyActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const { user } = useAuth();
  const generalContext = useContext(GeneralContext);

  const handleBuyClick = () => {
    axios
      .post(
        `${API_URL}/orders/create`,
        {
          name: uid,
          qty: stockQuantity,
          price: stockPrice,
          mode: "BUY",
        },
        {
          headers: {
            Authorization: user,
          },
        }
      )
      .then((res) => {
        generalContext.refreshOrders();
        generalContext.refreshHoldings();
        generalContext.closeBuyWindow();
      })
      .catch((error) => {
        generalContext.closeBuyWindow();
      });
  };

  const handleCancelClick = () => {
    generalContext.closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input type="number" name="qty" id="qty" onChange={(e) => setStockQuantity(e.target.value)} value={stockQuantity} />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input type="number" name="price" id="price" step="0.05" onChange={(e) => setStockPrice(e.target.value)} value={stockPrice} />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹140.65</span>
        <div>
          <Link className="btn btn-blue" onClick={handleBuyClick}>
            Buy
          </Link>
          <Link to="" className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
