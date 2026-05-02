import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { API_URL } from "../api";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";
import { useAuth } from "../hooks/useAuth";

const SellActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const { user } = useAuth();
  const generalContext = useContext(GeneralContext);

  const handleSellClick = () => {
    axios
      .post(
        `${API_URL}/orders/create`,
        {
          name: uid,
          qty: stockQuantity,
          price: stockPrice,
          mode: "SELL",
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
        generalContext.closeSellWindow();
      })
      .catch((error) => {
        generalContext.closeSellWindow();
      });
  };

  const handleCancelClick = () => {
    generalContext.closeSellWindow();
  };

  return (
    <div className="container" id="sell-window" draggable="true">
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
        <span>Margin required Rs.140.65</span>
        <div>
          <Link className="btn btn-blue" onClick={handleSellClick}>
            Sell
          </Link>
          <Link to="" className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellActionWindow;
